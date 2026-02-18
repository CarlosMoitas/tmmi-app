import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createLead, getLeadByEmail, createDiagnosis, getDiagnosisByToken, updateDiagnosis, getDiagnosisById } from "./db";
import { analyzeExpressDiagnosis } from "./tmmi-analysis";
import { generateReportHTML } from "./pdf-generator";
import { sendDiagnosisLinkEmail, sendDiagnosisReportEmail, notifyOwnerOfNewDiagnosis } from "./email-service";
import { nanoid } from "nanoid";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    capture: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        company: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Check if lead already exists
          const existingLead = await getLeadByEmail(input.email);
          if (existingLead) {
            return { success: true, leadId: existingLead.id, isNew: false };
          }

          const lead = await createLead(input.email, input.name, input.company);
          return { success: true, leadId: lead?.id, isNew: true };
        } catch (error) {
          console.error("Error creating lead:", error);
          throw new Error("Failed to create lead");
        }
      }),
  }),

  diagnoses: router({
    start: publicProcedure
      .input(z.object({
        leadId: z.number(),
        type: z.enum(["express", "complete"]).default("express"),
      }))
      .mutation(async ({ input }) => {
        try {
          const token = nanoid(32);
          const diagnosis = await createDiagnosis(input.leadId, token, input.type);
          
          // Get lead email
          const lead = (diagnosis as any)?.lead;
          if (lead?.email) {
            // Send diagnosis link email
            await sendDiagnosisLinkEmail(lead.email, token);
          }

          return { success: true, token };
        } catch (error) {
          console.error("Error starting diagnosis:", error);
          throw new Error("Failed to start diagnosis");
        }
      }),

    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        try {
          const diagnosis = await getDiagnosisByToken(input.token);
          if (!diagnosis) {
            throw new Error("Diagnosis not found");
          }
          return diagnosis;
        } catch (error) {
          console.error("Error fetching diagnosis:", error);
          throw new Error("Failed to fetch diagnosis");
        }
      }),

    submit: publicProcedure
      .input(z.object({
        token: z.string(),
        answers: z.record(z.string(), z.number()),
      }))
      .mutation(async ({ input }) => {
        try {
          console.log("[DEBUG] Recebido no servidor:", input);
          console.log("[DEBUG] Answers:", input.answers);
          console.log("[DEBUG] Answers keys:", Object.keys(input.answers));
          console.log("[DEBUG] Answers values:", Object.values(input.answers));
          
          const diagnosis = await getDiagnosisByToken(input.token);
          if (!diagnosis) {
            throw new Error("Diagnosis not found");
          }

          // Analyze with AI
          console.log("[DEBUG] Chamando analyzeExpressDiagnosis com:", input.answers);
          const analysis = await analyzeExpressDiagnosis(input.answers);
          console.log("[DEBUG] Resultado da analise:", analysis);

          // Generate PDF report
          const lead = (diagnosis as any)?.lead;
          const reportHTML = generateReportHTML({
            email: lead?.email || "unknown@email.com",
            createdAt: diagnosis.createdAt,
            completedAt: new Date(),
            analysis,
          });

          // Upload PDF to S3
          const pdfFileName = `diagnosis-${diagnosis.id}-${nanoid(8)}.pdf`;
          // TODO: Convert HTML to PDF using weasyprint or similar
          // For now, store the HTML URL
          const reportUrl = `${process.env.VITE_FRONTEND_URL || "https://assistente-tmmi.com"}/relatorio/${diagnosis.id}`;

          // Update diagnosis with analysis and report URL
          await updateDiagnosis(diagnosis.id, {
            answers: JSON.stringify(input.answers) as any,
            analysis: JSON.stringify(analysis) as any,
            maturityLevel: analysis.maturityLevel as any,
            scores: JSON.stringify(analysis.scores) as any,
            gaps: JSON.stringify(analysis.gaps) as any,
            recommendations: JSON.stringify(analysis.recommendations) as any,
            benchmarking: JSON.stringify(analysis.benchmarking) as any,
            reportUrl: reportUrl as any,
            status: "completed" as any,
            completedAt: new Date() as any,
          });

          // Send report email
          if (lead?.email) {
            await sendDiagnosisReportEmail(
              lead.email,
              reportUrl,
              analysis.maturityLevel,
              analysis.recommendations
            );

            // Notify owner
            await notifyOwnerOfNewDiagnosis(
              lead.email,
              analysis.maturityLevel,
              lead.company || undefined
            );
          }

          return { success: true, diagnosisId: diagnosis.id };
        } catch (error) {
          console.error("Error submitting diagnosis:", error);
          throw new Error("Failed to submit diagnosis");
        }
      }),

    getResult: publicProcedure
      .input(z.object({ diagnosisId: z.number() }))
      .query(async ({ input }) => {
        try {
          const diagnosis = await getDiagnosisById(input.diagnosisId);
          if (!diagnosis) {
            throw new Error("Diagnosis not found");
          }
          return {
            id: diagnosis.id,
            analysis: diagnosis.analysis,
            maturityLevel: diagnosis.maturityLevel,
            scores: diagnosis.scores,
            gaps: diagnosis.gaps,
            recommendations: diagnosis.recommendations,
            benchmarking: diagnosis.benchmarking,
            reportUrl: diagnosis.reportUrl,
          };
        } catch (error) {
          console.error("Error fetching result:", error);
          throw new Error("Failed to fetch result");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
