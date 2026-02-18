import { ENV } from "./_core/env";

/**
 * Envia e-mail com link do diagnóstico para o lead
 */
export async function sendDiagnosisLinkEmail(email: string, diagnosisToken: string): Promise<boolean> {
  try {
    const diagnosisUrl = `${process.env.VITE_FRONTEND_URL || "https://assistente-tmmi.com"}/diagnostico/${diagnosisToken}`;

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seu Diagnóstico TMMi Está Pronto</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #06b6d4; margin-bottom: 20px;">Seu Diagnóstico TMMi Está Pronto!</h1>
          
          <p style="margin-bottom: 20px;">Olá,</p>
          
          <p style="margin-bottom: 20px;">
            Obrigado por se interessar em avaliar a maturidade dos seus processos de teste. 
            Seu link de diagnóstico está pronto!
          </p>

          <div style="background: #f0f9fa; border-left: 4px solid #06b6d4; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; color: #666;">
              <strong>Tempo estimado:</strong> 5 minutos
            </p>
            <p style="margin: 0 0 15px 0; color: #666;">
              <strong>O que você vai receber:</strong> Nível de maturidade TMMi (1-5), scores por pilar, principais gaps e recomendações prioritárias.
            </p>
            <a href="${diagnosisUrl}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 10px;">
              Começar Diagnóstico
            </a>
          </div>

          <p style="margin-bottom: 20px;">
            Se o botão acima não funcionar, copie e cole este link no seu navegador:
          </p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
            ${diagnosisUrl}
          </p>

          <p style="margin-top: 30px; color: #666; font-size: 13px;">
            Este link é válido por 30 dias. Se você não solicitou este diagnóstico, ignore este e-mail.
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px;">
            <p style="margin: 0;">© 2026 Assistente TMMi. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // TODO: Implementar envio real com SendGrid ou Resend
    // Por enquanto, apenas log
    console.log(`[EMAIL] Diagnosis link sent to ${email}`);
    console.log(`[EMAIL] URL: ${diagnosisUrl}`);

    return true;
  } catch (error) {
    console.error("Error sending diagnosis link email:", error);
    return false;
  }
}

/**
 * Envia relatório de diagnóstico por e-mail
 */
export async function sendDiagnosisReportEmail(
  email: string,
  reportUrl: string,
  maturityLevel: number,
  recommendations: Array<{ title: string; priority: string }>
): Promise<boolean> {
  try {
    const topRecommendations = recommendations.slice(0, 3);

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seu Relatório de Diagnóstico TMMi</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #06b6d4; margin-bottom: 20px;">Seu Relatório de Diagnóstico TMMi</h1>
          
          <p style="margin-bottom: 20px;">Olá,</p>
          
          <p style="margin-bottom: 20px;">
            Obrigado por completar o diagnóstico! Aqui está um resumo dos seus resultados.
          </p>

          <!-- Maturity Level -->
          <div style="background: #f0f9fa; border: 2px solid #06b6d4; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Seu Nível de Maturidade</p>
            <p style="margin: 0; font-size: 48px; font-weight: bold; color: #06b6d4;">${maturityLevel}</p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">/5</p>
          </div>

          <!-- Top Recommendations -->
          <div style="margin: 30px 0;">
            <h2 style="color: #06b6d4; font-size: 16px; margin-bottom: 15px;">Principais Recomendações</h2>
            ${topRecommendations
              .map(
                (rec) => `
              <div style="background: #f9fafb; border-left: 4px solid #06b6d4; padding: 12px; margin-bottom: 10px; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold; color: #000;">${rec.title}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Prioridade: <strong>${rec.priority.toUpperCase()}</strong></p>
              </div>
            `
              )
              .join("")}
          </div>

          <!-- Download Report -->
          <div style="background: #f0f9fa; border: 1px solid #06b6d4; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 15px 0; color: #666;">
              Seu relatório completo está pronto para download
            </p>
            <a href="${reportUrl}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
              Download Relatório PDF
            </a>
          </div>

          <p style="margin-top: 30px; color: #666; font-size: 13px;">
            Este é um e-mail automático. Não responda a este endereço.
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px;">
            <p style="margin: 0;">© 2026 Assistente TMMi. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // TODO: Implementar envio real com SendGrid ou Resend
    // Por enquanto, apenas log
    console.log(`[EMAIL] Report sent to ${email}`);
    console.log(`[EMAIL] Report URL: ${reportUrl}`);

    return true;
  } catch (error) {
    console.error("Error sending diagnosis report email:", error);
    return false;
  }
}

/**
 * Envia notificação ao owner sobre novo diagnóstico completado
 */
export async function notifyOwnerOfNewDiagnosis(
  email: string,
  maturityLevel: number,
  company?: string
): Promise<boolean> {
  try {
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Novo Diagnóstico Completado</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #06b6d4;">Novo Diagnóstico Completado</h2>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Empresa:</strong> ${company || "Não informada"}</p>
          <p><strong>Nível de Maturidade:</strong> ${maturityLevel}/5</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      </body>
      </html>
    `;

    // TODO: Implementar envio real com SendGrid ou Resend
    console.log(`[EMAIL] Owner notification for new diagnosis from ${email}`);

    return true;
  } catch (error) {
    console.error("Error notifying owner:", error);
    return false;
  }
}
