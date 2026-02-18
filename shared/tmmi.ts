/**
 * TDM (Test Data Manager) Constants and Types
 * Modelo de maturidade para gestão de dados de teste
 * Com 8 pilares específicos de TDM
 */

export const TMMI_PILLARS = [
  {
    id: 1,
    name: "TDM Strategy & Policy",
    description: "Estratégia e políticas de gestão de dados de teste alinhadas com negócio",
    icon: "🎯",
    details: "Existe estratégia de TDM, objetivos claros (risco, LGPD, eficiência) e alinhamento com SDLC",
  },
  {
    id: 2,
    name: "TDM Planning & Demand Management",
    description: "Planejamento de necessidades de dados e gestão de demanda",
    icon: "📋",
    details: "Necessidades de dados são planejadas, há priorização e previsibilidade",
  },
  {
    id: 3,
    name: "Data Sourcing & Modeling",
    description: "Origem dos dados e modelagem para testes representativos",
    icon: "📊",
    details: "Origem dos dados (prod, sintético, mock), modelagem para testes e representatividade dos cenários",
  },
  {
    id: 4,
    name: "Data Provisioning & Environment",
    description: "Provisionamento de dados e integração com ambientes de teste",
    icon: "⚙️",
    details: "Provisionamento de dados, integração com ambientes, velocidade e repetibilidade",
  },
  {
    id: 5,
    name: "Data Privacy, Masking & Compliance",
    description: "Privacidade, mascaramento e conformidade com LGPD",
    icon: "🔒",
    details: "LGPD, mascaramento, anonimização e auditoria de dados de teste",
  },
  {
    id: 6,
    name: "Data Lifecycle & Reuse",
    description: "Versionamento, reuso e rastreabilidade de dados de teste",
    icon: "🔄",
    details: "Versionamento de dados, reuso, rastreabilidade e descarte controlado",
  },
  {
    id: 7,
    name: "Automation & Integration",
    description: "Automação de TDM e integração com CI/CD",
    icon: "🤖",
    details: "Automação de TDM, integração com CI/CD e self-service",
  },
  {
    id: 8,
    name: "Metrics & Continuous Improvement",
    description: "Métricas e melhoria contínua baseada em dados",
    icon: "📈",
    details: "Métricas de TDM, identificação de gargalos e melhoria contínua",
  },
];

export const MATURITY_LEVELS = [
  { level: 1, name: "Inicial", description: "Processos não estruturados" },
  { level: 2, name: "Repetível", description: "Processos documentados e repetíveis" },
  { level: 3, name: "Definido", description: "Processos padronizados e definidos" },
  { level: 4, name: "Gerenciado", description: "Processos medidos e controlados" },
  { level: 5, name: "Otimizado", description: "Processos otimizados e inovadores" },
];

export const EXPRESS_QUESTIONS = [
  {
    id: 1,
    pillar: 1,
    question: "Existe uma estratégia de TDM definida e alinhada com os objetivos de negócio e SDLC?",
    options: [
      { value: 1, label: "Não existe estratégia de TDM" },
      { value: 2, label: "Estratégia informal e não documentada" },
      { value: 3, label: "Estratégia definida para alguns projetos" },
      { value: 4, label: "Estratégia formal documentada e comunicada" },
      { value: 5, label: "Estratégia integrada à governança corporativa" },
    ],
  },
  {
    id: 2,
    pillar: 2,
    question: "Como as necessidades de dados de teste são planejadas e gerenciadas?",
    options: [
      { value: 1, label: "Sem planejamento, dados chegam quando solicitados" },
      { value: 2, label: "Planejamento informal e reativo" },
      { value: 3, label: "Planejamento básico com priorização informal" },
      { value: 4, label: "Planejamento formal com priorização clara" },
      { value: 5, label: "Planejamento integrado ao SDLC com previsibilidade" },
    ],
  },
  {
    id: 3,
    pillar: 3,
    question: "De onde vêm os dados de teste e como são modelados para representar a realidade?",
    options: [
      { value: 1, label: "Cópia direta de produção sem modelagem" },
      { value: 2, label: "Cópia de produção com ajustes manuais" },
      { value: 3, label: "Extrações controladas com modelagem básica" },
      { value: 4, label: "Dados sintéticos/mock com modelagem estruturada" },
      { value: 5, label: "Mix de fontes com modelagem avançada e cenários representativos" },
    ],
  },
  {
    id: 4,
    pillar: 4,
    question: "Como os dados são provisionados para os ambientes de teste?",
    options: [
      { value: 1, label: "Manual e não repetível" },
      { value: 2, label: "Scripts manuais e não padronizados" },
      { value: 3, label: "Processo definido, pouco automatizado" },
      { value: 4, label: "Pipeline automatizado e versionado" },
      { value: 5, label: "Self-service integrado ao CI/CD com velocidade" },
    ],
  },
  {
    id: 5,
    pillar: 5,
    question: "Como a privacidade, mascaramento e conformidade (LGPD) são tratados?",
    options: [
      { value: 1, label: "Não são tratados" },
      { value: 2, label: "Dependem de cuidados individuais" },
      { value: 3, label: "Mascaramento básico e manual" },
      { value: 4, label: "Mascaramento automatizado com padrões definidos" },
      { value: 5, label: "Privacy by design, auditável e totalmente conforme LGPD" },
    ],
  },
  {
    id: 6,
    pillar: 6,
    question: "Como os dados de teste são versionados, reutilizados e descartados?",
    options: [
      { value: 1, label: "Sem versionamento ou rastreabilidade" },
      { value: 2, label: "Reuso informal e não controlado" },
      { value: 3, label: "Versionamento manual documentado" },
      { value: 4, label: "Versionamento automatizado e rastreável" },
      { value: 5, label: "Reuso inteligente com catálogo, descarte controlado" },
    ],
  },
  {
    id: 7,
    pillar: 7,
    question: "Como o TDM é automatizado e integrado ao CI/CD?",
    options: [
      { value: 1, label: "Sem automação ou integração" },
      { value: 2, label: "Automação manual e pontual" },
      { value: 3, label: "Automação parcial com scripts" },
      { value: 4, label: "Integrado às ferramentas de teste" },
      { value: 5, label: "Totalmente integrado ao ecossistema DevOps com self-service" },
    ],
  },
  {
    id: 8,
    pillar: 8,
    question: "Quais métricas são utilizadas para medir e melhorar o TDM?",
    options: [
      { value: 1, label: "Nenhuma métrica" },
      { value: 2, label: "Métricas informais (tempo, esforço percebido)" },
      { value: 3, label: "Métricas básicas documentadas" },
      { value: 4, label: "KPIs claros (lead time, qualidade, retrabalho)" },
      { value: 5, label: "Métricas preditivas com melhoria contínua baseada em dados" },
    ],
  },
  {
    id: 9,
    pillar: 1,
    question: "Existe governança clara para dados de teste na organização?",
    options: [
      { value: 1, label: "Não existe governança" },
      { value: 2, label: "Depende de pessoas específicas" },
      { value: 3, label: "Papéis e responsabilidades definidos" },
      { value: 4, label: "Governança formal com políticas e controles" },
      { value: 5, label: "Governança integrada à governança corporativa de dados" },
    ],
  },
  {
    id: 10,
    pillar: 8,
    /** Era pillar 2 e substitui por 8
 * pillar: 2,
 */
    
    question: "Como a organização evolui suas práticas de TDM ao longo do tempo?",
    options: [
      { value: 1, label: "Não há evolução estruturada" },
      { value: 2, label: "Melhorias reativas aos problemas" },
      { value: 3, label: "Melhorias planejadas ocasionalmente" },
      { value: 4, label: "Ciclos formais de melhoria contínua" },
      { value: 5, label: "Inovação contínua com dados sintéticos e IA" },
    ],
  },
];

export interface DiagnosisResult {
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  scores: Record<number, number>;
  gaps: Array<{
    pillar: number;
    name: string;
    gap: string;
  }>;
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    pillar: number;
  }>;
  benchmarking: {
    userScore: number;
    marketAverage: number;
    percentile: number;
  };
}
