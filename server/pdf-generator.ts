import { DiagnosisResult } from "@shared/tmmi";
import { TMMI_PILLARS, MATURITY_LEVELS } from "@shared/tmmi";

/**
 * Gera HTML do relatório para conversão em PDF
 */
export function generateReportHTML(diagnosis: {
  email: string;
  createdAt: Date;
  completedAt?: Date;
  analysis: DiagnosisResult;
}): string {
  const result = diagnosis.analysis;
  const levelInfo = MATURITY_LEVELS[result.maturityLevel - 1];
  const formattedDate = new Date(diagnosis.completedAt || diagnosis.createdAt).toLocaleDateString("pt-BR");

  const scoresHTML = Object.entries(result.scores)
    .map(([pillar, score]) => {
      const pillarName = TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name || `Pilar ${pillar}`;
      const percentage = (score / 5) * 100;
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${pillarName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <div style="background: #f0f9fa; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #06b6d4;">
              ${score.toFixed(1)}/5
            </div>
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: #06b6d4; height: 100%; width: ${percentage}%;"></div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const gapsHTML = result.gaps
    .map((gap, idx) => `
      <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 6px; padding: 12px; margin-bottom: 10px;">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <div style="background: #dc2626; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">
            ${idx + 1}
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #7f1d1d;">${gap.name}</h4>
            <p style="margin: 0; font-size: 13px; color: #991b1b;">${gap.gap}</p>
          </div>
        </div>
      </div>
    `)
    .join("");

  const recommendationsHTML = result.recommendations
    .map((rec) => {
      const priorityColors = {
        high: { bg: "#fee2e2", text: "#991b1b", label: "ALTA" },
        medium: { bg: "#fef3c7", text: "#92400e", label: "MÉDIA" },
        low: { bg: "#dcfce7", text: "#166534", label: "BAIXA" },
      };
      const colors = priorityColors[rec.priority];
      const pillarName = TMMI_PILLARS.find(p => p.id === rec.pillar)?.name || "";

      return `
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h4 style="margin: 0; font-weight: bold; color: #000;">${rec.title}</h4>
            <span style="background: ${colors.bg}; color: ${colors.text}; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: bold;">
              ${colors.label}
            </span>
          </div>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">${rec.description}</p>
          <p style="margin: 0; font-size: 12px; color: #999;">Pilar: ${pillarName}</p>
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Diagnóstico TMMi</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #333;
          line-height: 1.6;
          background: white;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
        }
        .header {
          border-bottom: 2px solid #06b6d4;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 28px;
          color: #000;
          margin-bottom: 5px;
        }
        .header p {
          font-size: 12px;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #06b6d4;
          margin-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
        }
        .maturity-box {
          background: #f0f9fa;
          border: 2px solid #06b6d4;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        .maturity-number {
          font-size: 48px;
          font-weight: bold;
          color: #06b6d4;
          margin-bottom: 10px;
        }
        .maturity-name {
          font-size: 18px;
          font-weight: bold;
          color: #000;
          margin-bottom: 5px;
        }
        .maturity-desc {
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #f3f4f6;
          padding: 10px;
          text-align: left;
          font-weight: bold;
          border-bottom: 1px solid #e5e7eb;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .benchmark-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .benchmark-label {
          font-weight: bold;
          flex: 1;
        }
        .benchmark-value {
          font-size: 18px;
          font-weight: bold;
          color: #06b6d4;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 11px;
          color: #999;
          text-align: center;
        }
        @media print {
          .page-break {
            page-break-after: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Relatório de Diagnóstico TMMi</h1>
          <p>Avaliação de Maturidade de Processos de Teste</p>
          <p style="margin-top: 10px; font-size: 11px;">
            E-mail: ${diagnosis.email} | Data: ${formattedDate}
          </p>
        </div>

        <!-- Maturity Level -->
        <div class="section">
          <div class="maturity-box">
            <div class="maturity-number">${result.maturityLevel}</div>
            <div class="maturity-name">${levelInfo.name}</div>
            <div class="maturity-desc">${levelInfo.description}</div>
          </div>
        </div>

        <!-- Benchmarking -->
        <div class="section">
          <h2 class="section-title">Benchmarking</h2>
          <div class="benchmark-row">
            <span class="benchmark-label">Seu Score:</span>
            <span class="benchmark-value">${result.benchmarking.userScore.toFixed(1)}/5</span>
          </div>
          <div class="benchmark-row">
            <span class="benchmark-label">Média de Mercado:</span>
            <span>${result.benchmarking.marketAverage.toFixed(1)}/5</span>
          </div>
          <div class="benchmark-row">
            <span class="benchmark-label">Percentil:</span>
            <span class="benchmark-value">${result.benchmarking.percentile}º</span>
          </div>
        </div>

        <!-- Scores by Pillar -->
        <div class="section">
          <h2 class="section-title">Pontuação por Pilar</h2>
          <table>
            <thead>
              <tr>
                <th>Pilar</th>
                <th style="text-align: center;">Score</th>
                <th>Progresso</th>
              </tr>
            </thead>
            <tbody>
              ${scoresHTML}
            </tbody>
          </table>
        </div>

        <!-- Gaps -->
        <div class="section">
          <h2 class="section-title">3 Principais Gaps Identificados</h2>
          ${gapsHTML}
        </div>

        <div class="page-break"></div>

        <!-- Recommendations -->
        <div class="section">
          <h2 class="section-title">Recomendações Prioritárias</h2>
          ${recommendationsHTML}
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Relatório gerado automaticamente pelo Assistente TMMi</p>
          <p>© 2026 Assistente TMMi. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
