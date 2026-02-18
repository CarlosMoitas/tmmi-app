import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, ArrowRight, TrendingUp } from "lucide-react";
import { TMMI_PILLARS, MATURITY_LEVELS } from "@shared/tmmi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function ReportExample() {
  // Mock data for demonstration
  const mockResult = {
    maturityLevel: 3,
    scores: {
      1: 2.8,
      2: 3.2,
      3: 3.5,
      4: 2.9,
      5: 3.1,
      6: 2.5,
      7: 3.3,
      8: 2.7,
    },
    gaps: [
      {
        pillar: 6,
        name: "Automação de Testes",
        gap: "Score atual: 2.5/5 - Oportunidade de melhoria identificada",
      },
      {
        pillar: 1,
        name: "Planejamento e Estimativa",
        gap: "Score atual: 2.8/5 - Oportunidade de melhoria identificada",
      },
      {
        pillar: 8,
        name: "Melhoria Contínua",
        gap: "Score atual: 2.7/5 - Oportunidade de melhoria identificada",
      },
    ],
    recommendations: [
      {
        priority: "high",
        title: "Implementar Plano Formal de Testes",
        description: "Documentar e estruturar o processo de planejamento de testes",
        pillar: 1,
      },
      {
        priority: "high",
        title: "Padronizar Casos de Teste",
        description: "Criar template e padrões para design de casos de teste",
        pillar: 2,
      },
      {
        priority: "high",
        title: "Automatizar Testes Críticos",
        description: "Iniciar automação em funcionalidades críticas",
        pillar: 6,
      },
      {
        priority: "medium",
        title: "Implementar Métricas de Teste",
        description: "Coletar dados sobre cobertura e defeitos",
        pillar: 7,
      },
      {
        priority: "low",
        title: "Estabelecer Ciclo de Melhoria",
        description: "Criar processo de retrospectivas e melhorias contínuas",
        pillar: 8,
      },
    ],
    benchmarking: {
      userScore: 3.0,
      marketAverage: 2.8,
      percentile: 65,
    },
  };

  const levelInfo = MATURITY_LEVELS[mockResult.maturityLevel - 1];
  const chartData = Object.entries(mockResult.scores).map(([pillar, score]) => ({
    name: TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name || `Pilar ${pillar}`,
    score: score,
    max: 5,
  }));

  const radarData = Object.entries(mockResult.scores).map(([pillar, score]) => ({
    name: TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name || `Pilar ${pillar}`,
    value: score,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Exemplo de Relatório</h1>
          <div className="flex gap-2">
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Maturity Level Card */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="md:col-span-1 border-2 border-accent">
            <CardHeader className="text-center">
              <CardTitle>Nível de Maturidade</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-accent mb-2">{mockResult.maturityLevel}</div>
              <div className="text-2xl font-semibold mb-2">{levelInfo.name}</div>
              <p className="text-muted-foreground text-sm mb-4">{levelInfo.description}</p>
              <Progress value={(mockResult.maturityLevel / 5) * 100} className="h-3" />
            </CardContent>
          </Card>

          {/* Benchmarking */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Benchmarking</CardTitle>
              <CardDescription>Comparação com o mercado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Seu Score</span>
                    <span className="text-accent font-bold">{mockResult.benchmarking.userScore}/5</span>
                  </div>
                  <Progress value={(mockResult.benchmarking.userScore / 5) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Média de Mercado</span>
                    <span className="text-muted-foreground">{mockResult.benchmarking.marketAverage}/5</span>
                  </div>
                  <Progress value={(mockResult.benchmarking.marketAverage / 5) * 100} className="h-2" />
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Você está no</p>
                  <p className="text-3xl font-bold text-accent">{mockResult.benchmarking.percentile}º percentil</p>
                  <p className="text-sm text-muted-foreground">Melhor que {100 - mockResult.benchmarking.percentile}% das organizações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Pontuação por Pilar</CardTitle>
              <CardDescription>Score em cada área de maturidade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral de Maturidade</CardTitle>
              <CardDescription>Distribuição dos scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 5]} />
                  <Radar name="Score" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gaps */}
        <Card className="mb-12 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">3 Principais Gaps Identificados</CardTitle>
            <CardDescription>Áreas com maior oportunidade de melhoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResult.gaps.map((gap, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-red-50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{gap.name}</h4>
                    <p className="text-sm text-muted-foreground">{gap.gap}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Recomendações Prioritárias
            </CardTitle>
            <CardDescription>Plano de ação para melhorar sua maturidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResult.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border hover:border-accent transition">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      rec.priority === "high" ? "bg-red-100 text-red-700" :
                      rec.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Pilar: {TMMI_PILLARS.find(p => p.id === rec.pillar)?.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-accent text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar a Melhorar?</h2>
          <p className="text-lg mb-6 opacity-90">
            Implemente as recomendações acima e acompanhe seu progresso
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-white text-accent hover:bg-white/90">
              Começar Diagnóstico
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
