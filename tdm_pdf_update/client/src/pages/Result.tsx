import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Share2, ArrowRight, TrendingUp } from "lucide-react";
import { exportResultadoToPdf } from "@/utils/exportResultadoToPdf";
import { exportResultadoToPdf } from "@/utils/exportResultadoToPdf";
import { exportResultadoToPdf } from "@/utils/exportResultadoToPdf";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { TMMI_PILLARS, MATURITY_LEVELS, DiagnosisResult } from "@shared/tmmi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function Result() {
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  const [, navigate] = useLocation();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar resultado do diagnóstico via tRPC
  const diagnosisIdNum = diagnosisId ? parseInt(diagnosisId) : null;
  const { data: diagnosisData, isLoading: isLoadingData, error: fetchError } = trpc.diagnoses.getResult.useQuery(
    { diagnosisId: diagnosisIdNum || 0 },
    { enabled: !!diagnosisIdNum }
  );

  useEffect(() => {
    if (diagnosisData) {
      console.log("Dados do diagnóstico recebidos:", diagnosisData);
      // Parse JSON strings if they are strings
      const analysis = typeof diagnosisData.analysis === 'string' 
        ? JSON.parse(diagnosisData.analysis) 
        : diagnosisData.analysis;
      setResult(analysis);
      setIsLoading(false);
    } else if (fetchError) {
      console.error("Erro ao buscar diagnóstico:", fetchError);
      setError("Não foi possível carregar o resultado do diagnóstico.");
      setIsLoading(false);
    } else if (isLoadingData) {
      setIsLoading(true);
    }
  }, [diagnosisData, fetchError, isLoadingData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processando seu diagnóstico...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro ao Carregar Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error || "Não foi possível carregar o resultado do diagnóstico."}</p>
            <Button className="w-full" onClick={() => navigate("/")}>Voltar para Home</Button>
            <Button className="w-full mt-2" variant="outline" onClick={() => navigate("/")}>Novo Diagnóstico</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelInfo = MATURITY_LEVELS[result.maturityLevel - 1];
  const chartData = Object.entries(result.scores).map(([pillar, score]) => ({
    name: TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name || `Pilar ${pillar}`,
    score: score,
    max: 5,
  }));

  const radarData = Object.entries(result.scores).map(([pillar, score]) => ({
    name: TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name || `Pilar ${pillar}`,
    value: score,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resultado do Diagnóstico TDM</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => exportResultadoToPdf("resultado-pdf")}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div id="resultado-pdf" className="container py-12">
        {/* Maturity Level Card */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="md:col-span-1 border-2 border-accent">
            <CardHeader className="text-center">
              <CardTitle>Nível de Maturidade</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-accent mb-2">{result.maturityLevel}</div>
              <div className="text-2xl font-semibold mb-2">{levelInfo.name}</div>
              <p className="text-muted-foreground text-sm mb-4">{levelInfo.description}</p>
              <Progress value={(result.maturityLevel / 5) * 100} className="h-3" />
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
                    <span className="text-accent font-bold">{result.benchmarking.userScore}/5</span>
                  </div>
                  <Progress value={(result.benchmarking.userScore / 5) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Média de Mercado</span>
                    <span className="text-muted-foreground">{result.benchmarking.marketAverage}/5</span>
                  </div>
                  <Progress value={(result.benchmarking.marketAverage / 5) * 100} className="h-2" />
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Você está no</p>
                  <p className="text-3xl font-bold text-accent">{result.benchmarking.percentile}º percentil</p>
                  <p className="text-sm text-muted-foreground">Melhor que {100 - result.benchmarking.percentile}% das organizações</p>
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
              <CardTitle>Pontuação por Pilar TDM</CardTitle>
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
              {result.gaps.map((gap, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-red-50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900">{gap.name}</h4>
                    <p className="text-sm text-red-700 mt-1">{gap.gap}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-12 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-600">Recomendações Prioritárias</CardTitle>
            <CardDescription>Próximos passos para melhorar a maturidade TDM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-green-900">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        rec.priority === "high" ? "bg-red-200 text-red-700" :
                        rec.priority === "medium" ? "bg-yellow-200 text-yellow-700" :
                        "bg-blue-200 text-blue-700"
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">{rec.description}</p>
                    <p className="text-xs text-green-600 mt-2">
                      Pilar: {TMMI_PILLARS.find(p => p.id === rec.pillar)?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Iniciar Novo Diagnóstico
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
