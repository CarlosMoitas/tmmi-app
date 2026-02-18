import { EXPRESS_QUESTIONS, TMMI_PILLARS, DiagnosisResult } from "@shared/tmmi";

/**
 * Processa respostas do diagnóstico express TDM e gera análise
 * Versão LOCAL - sem dependência de IA
 * Com 8 pilares TDM específicos
 */
export async function analyzeExpressDiagnosis(answers: Record<number, number>): Promise<DiagnosisResult> {
  console.log("Analisando respostas TDM:", answers);
  
  // Calcular scores por pilar
  const pillarScores: Record<number, number[]> = {};
  
  EXPRESS_QUESTIONS.forEach(q => {
    if (!pillarScores[q.pillar]) {
      pillarScores[q.pillar] = [];
    }
    const answerValue = answers[q.id];
    console.log(`Pergunta ${q.id} (Pilar ${q.pillar}): ${answerValue}`);
    pillarScores[q.pillar].push(answerValue || 1);
  });

  console.log("Pillar Scores:", pillarScores);

  // Calcular média por pilar (1-5)
  const scores: Record<number, number> = {};
  Object.entries(pillarScores).forEach(([pillar, values]) => {
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    scores[parseInt(pillar)] = Math.round(average * 10) / 10;
    console.log(`Pilar ${pillar}: ${scores[parseInt(pillar)]}`);
  });

  // Determinar nível de maturidade geral (média de todos os pilares)
  const allScores = Object.values(scores);
  const overallScore = Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10;
  const maturityLevel = Math.ceil(overallScore) as 1 | 2 | 3 | 4 | 5;

  console.log("Overall Score:", overallScore);
  console.log("Maturity Level:", maturityLevel);

  // Identificar 3 principais gaps (pilares com menor score)
  const gapsByScore = Object.entries(scores)
    .map(([pillarId, score]) => ({
      pillar: parseInt(pillarId),
      score,
      name: TMMI_PILLARS.find(p => p.id === parseInt(pillarId))?.name || "",
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const gaps = gapsByScore.map(gap => ({
    pillar: gap.pillar,
    name: gap.name,
    gap: `Score atual: ${gap.score}/5 - Oportunidade de melhoria identificada`,
  }));

  // Gerar recomendações baseadas nos scores (sem IA)
  const recommendations = generateRecommendations(scores, gaps);

  // Calcular benchmarking
  const marketAverage = 2.8;

  const userPercentile = Math.max(0, Math.round((overallScore / 5) * 100));
 { /** Calculo antigo: ===> const userPercentile = Math.min(100, Math.round((overallScore / 5) * 100)); */}

  const result: DiagnosisResult = {
    maturityLevel,
    scores,
    gaps,
    recommendations,
    benchmarking: {
      userScore: overallScore,
      marketAverage,
      percentile: userPercentile,
    },
  };

  console.log("Resultado final:", result);
  return result;
}

/**
 * Gera recomendações baseadas nos scores dos pilares TDM
 */

/**
function generateRecommendations(
  scores: Record<number, number>,
  gaps: Array<{ pillar: number; name: string; gap: string }>
): Array<{
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  pillar: number;
}> {
  const recommendations: Array<{
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    pillar: number;
  }> = [];

  // Mapa de recomendações por pilar TDM
  const recommendationMap: Record<number, Array<{
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>> = {
    1: [
      {
        priority: "high",
        title: "Definir Estratégia de TDM",
        description: "Criar estratégia formal de TDM alinhada com objetivos de negócio e SDLC",
      },
      {
        priority: "medium",
        title: "Estabelecer Governança de Dados de Teste",
        description: "Definir papéis, responsabilidades e políticas para TDM",
      },
    ],
    2: [
      {
        priority: "high",
        title: "Implementar Planejamento de Demanda",
        description: "Criar processo formal para planejar necessidades de dados de teste",
      },
      {
        priority: "medium",
        title: "Priorizar Necessidades de Dados",
        description: "Estabelecer critérios de priorização para demandas de dados",
      },
    ],
    3: [
      {
        priority: "high",
        title: "Diversificar Fontes de Dados",
        description: "Implementar dados sintéticos, mocks e extrações controladas",
      },
      {
        priority: "medium",
        title: "Modelar Dados para Testes",
        description: "Criar modelos de dados que representem cenários reais",
      },
    ],
    4: [
      {
        priority: "high",
        title: "Automatizar Provisionamento",
        description: "Implementar pipeline automatizado para provisionar dados em ambientes",
      },
      {
        priority: "medium",
        title: "Integrar com Ambientes",
        description: "Conectar provisionamento de dados com ambientes de teste",
      },
    ],
    5: [
      {
        priority: "high",
        title: "Implementar Mascaramento de Dados",
        description: "Aplicar mascaramento e anonimização para conformidade LGPD",
      },
      {
        priority: "medium",
        title: "Estabelecer Auditoria de Dados",
        description: "Criar logs de acesso e uso de dados de teste",
      },
    ],
    6: [
      {
        priority: "high",
        title: "Versionar Dados de Teste",
        description: "Implementar versionamento controlado de conjuntos de dados",
      },
      {
        priority: "medium",
        title: "Criar Catálogo de Dados",
        description: "Documentar e catalogar dados disponíveis para reuso",
      },
    ],
    7: [
      {
        priority: "high",
        title: "Automatizar TDM",
        description: "Criar scripts e ferramentas para automatizar processos de TDM",
      },
      {
        priority: "medium",
        title: "Integrar com CI/CD",
        description: "Conectar TDM ao pipeline de integração contínua",
      },
    ],
    8: [
      {
        priority: "high",
        title: "Definir Métricas de TDM",
        description: "Estabelecer KPIs para medir eficiência e qualidade do TDM",
      },
      {
        priority: "medium",
        title: "Implementar Melhoria Contínua",
        description: "Criar ciclos de análise e melhoria baseados em métricas",
      },
    ],
  };

  // Adicionar recomendações para os 3 pilares com menor score
  gaps.forEach((gap, index) => {
    const pillarRecs = recommendationMap[gap.pillar];
    if (pillarRecs && pillarRecs[0]) {
      recommendations.push({
        ...pillarRecs[0],
        pillar: gap.pillar,
      });
    }
  });

  // Adicionar recomendações adicionais para outros pilares com score baixo
  Object.entries(scores).forEach(([pillarId, score]) => {
    const pillar = parseInt(pillarId);
    if (score < 3 && !gaps.find(g => g.pillar === pillar)) {
      const pillarRecs = recommendationMap[pillar];
      if (pillarRecs && pillarRecs[1]) {
        recommendations.push({
          ...pillarRecs[1],
          pillar,
        });
      }
    }
  });

  // Garantir que temos pelo menos 5 recomendações
  while (recommendations.length < 5) {
    const randomPillar = Math.floor(Math.random() * 8) + 1;
    const pillarRecs = recommendationMap[randomPillar];
    if (pillarRecs && pillarRecs[1]) {
      recommendations.push({
        ...pillarRecs[1],
        pillar: randomPillar,
      });
    }
  }

  return recommendations.slice(0, 5);
}
 */

function generateRecommendations(
  scores: Record<number, number>,
  gaps: Array<{ pillar: number; name: string; gap: string }>
): Array<{
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  pillar: number;
}> {
  const recommendations: Array<{
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    pillar: number;
  }> = [];

  // Usaremos um Set para garantir que não recomendamos o mesmo pilar duas vezes
  const recommendedPillarIds = new Set<number>();

  const recommendationMap: Record<number, Array<{
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>> = {
    1: [
      { priority: "high", title: "Definir Estratégia de TDM", description: "Criar estratégia formal de TDM alinhada com objetivos de negócio e SDLC" },
      { priority: "medium", title: "Estabelecer Governança de Dados", description: "Definir papéis, responsabilidades e políticas para TDM" },
    ],
    2: [
      { priority: "high", title: "Implementar Planejamento de Demanda", description: "Criar processo formal para planejar necessidades de dados de teste" },
      { priority: "medium", title: "Priorizar Necessidades de Dados", description: "Estabelecer critérios de priorização para demandas de dados" },
    ],
    3: [
      { priority: "high", title: "Diversificar Fontes de Dados", description: "Implementar dados sintéticos, mocks e extrações controladas" },
      { priority: "medium", title: "Modelar Dados para Testes", description: "Criar modelos de dados que representem cenários reais" },
    ],
    4: [
      { priority: "high", title: "Automatizar Provisionamento", description: "Implementar pipeline automatizado para provisionar dados em ambientes" },
      { priority: "medium", title: "Integrar com Ambientes", description: "Conectar provisionamento de dados com ambientes de teste" },
    ],
    5: [
      { priority: "high", title: "Implementar Mascaramento de Dados", description: "Aplicar mascaramento e anonimização para conformidade LGPD" },
      { priority: "medium", title: "Estabelecer Auditoria de Dados", description: "Criar logs de acesso e uso de dados de teste" },
    ],
    6: [
      { priority: "high", title: "Versionar Dados de Teste", description: "Implementar versionamento controlado de conjuntos de dados" },
      { priority: "medium", title: "Criar Catálogo de Dados", description: "Documentar e catalogar dados disponíveis para reuso" },
    ],
    7: [
      { priority: "high", title: "Automatizar TDM", description: "Criar scripts e ferramentas para automatizar processos de TDM" },
      { priority: "medium", title: "Integrar com CI/CD", description: "Conectar TDM ao pipeline de integração contínua" },
    ],
    8: [
      { priority: "high", title: "Definir Métricas de TDM", description: "Estabelecer KPIs para medir eficiência e qualidade do TDM" },
      { priority: "medium", title: "Implementar Melhoria Contínua", description: "Criar ciclos de análise e melhoria baseados em métricas" },
    ],
  };

  // 1. ADICIONAR GAPS (Prioridade Máxima)
  gaps.forEach(gap => {
    const recs = recommendationMap[gap.pillar];
    if (recs && recs[0]) {
      recommendations.push({ ...recs[0], pillar: gap.pillar });
      recommendedPillarIds.add(gap.pillar);
    }
  });

  // 2. ADICIONAR PILARES COM SCORE BAIXO (< 3) QUE NÃO SÃO GAPS
  Object.entries(scores)
    .sort((a, b) => a[1] - b[1]) // Ordena do menor score para o maior
    .forEach(([pillarId, score]) => {
      const pId = parseInt(pillarId);
      if (score < 3 && !recommendedPillarIds.has(pId) && recommendations.length < 5) {
        const recs = recommendationMap[pId];
        if (recs) {
          recommendations.push({ ...recs[0], pillar: pId });
          recommendedPillarIds.add(pId);
        }
      }
    });

  // 3. COMPLETAR ATÉ 5 COM RECOMENDAÇÕES SECUNDÁRIAS (Medium) SE NECESSÁRIO
  // Se ainda não temos 5, voltamos nos pilares que já recomendamos e pegamos a segunda dica
  if (recommendations.length < 5) {
    for (const pId of Array.from(recommendedPillarIds)) {
      if (recommendations.length >= 5) break;
      const recs = recommendationMap[pId];
      if (recs && recs[1]) {
        recommendations.push({ ...recs[1], pillar: pId });
      }
    }
  }

  // 4. ÚLTIMO RECURSO: Se ainda não tiver 5 (ex: o usuário tirou 5 em tudo), 
  // pega qualquer pilar que ainda não foi usado
  if (recommendations.length < 5) {
    for (let i = 1; i <= 8; i++) {
      if (recommendations.length >= 5) break;
      if (!recommendedPillarIds.has(i)) {
        const recs = recommendationMap[i];
        if (recs) {
          recommendations.push({ ...recs[0], pillar: i });
          recommendedPillarIds.add(i);
        }
      }
    }
  }

  return recommendations.slice(0, 5);
}


/**
 * Gera um resumo em texto da análise para incluir no e-mail
 */
export function generateAnalysisSummary(result: DiagnosisResult): string {
  const levelName = ["Inicial", "Repetível", "Definido", "Gerenciado", "Otimizado"][result.maturityLevel - 1];
  
  return `
Seu Nível de Maturidade TDM: ${result.maturityLevel}/5 (${levelName})

Pontuação por Pilar:
${Object.entries(result.scores).map(([pillar, score]) => {
  const pillarName = TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name;
  return `- ${pillarName}: ${score}/5`;
}).join('\n')}

Principais Gaps:
${result.gaps.map(g => `- ${g.name}: ${g.gap}`).join('\n')}

Recomendações Prioritárias:
${result.recommendations.slice(0, 3).map(r => `- [${r.priority.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')}

Benchmarking:
- Seu Score: ${result.benchmarking.userScore}/5
- Média de Mercado: ${result.benchmarking.marketAverage}/5
- Percentil: ${result.benchmarking.percentile}%
  `;
}
