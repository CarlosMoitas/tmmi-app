import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Share2, ArrowRight } from "lucide-react";
import { exportResultadoToPdf } from "@/utils/exportResultadoToPdf";

import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { TMMI_PILLARS, MATURITY_LEVELS, DiagnosisResult } from "@shared/tmmi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";

export default function Result() {
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  const [, navigate] = useLocation();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    try {
      await exportResultadoToPdf("resultado-pdf");
    } catch (err) {
      console.error("Erro ao baixar PDF:", err);
    }
  };

  const diagnosisIdNum = diagnosisId ? parseInt(diagnosisId) : null;
  const { data: diagnosisData, isLoading: isLoadingData, error: fetchError } = trpc.diagnoses.getResult.useQuery(
    { diagnosisId: diagnosisIdNum || 0 },
    { enabled: !!diagnosisIdNum }
  );

  useEffect(() => {
    if (diagnosisData) {
      const analysis = typeof diagnosisData.analysis === 'string' 
        ? JSON.parse(diagnosisData.analysis) 
        : diagnosisData.analysis;
      setResult(analysis);
      setIsLoading(false);
    } else if (fetchError) {
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
            <p className="text-muted-foreground mb-4">{error || "Não foi possível carregar o resultado."}</p>
            <Button className="w-full" onClick={() => navigate("/")}>Voltar para Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelInfo = MATURITY_LEVELS[result.maturityLevel - 1];
  const chartData = Object.entries(result.scores).map(([pillar, score]) => ({
    name: TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name || `Pilar ${pillar}`,
    score: score,
  }));

  const radarData = Object.entries(result.scores).map(([pillar, score]) => ({
    name: TMMI_PILLARS.find(p => p.id === parseInt(pillar))?.name || `Pilar ${pillar}`,
    value: score,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Fixo - Não entra no PDF */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border no-print">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resultado do Diagnóstico TDM</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleDownloadPdf}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Container de Captura para o PDF */}
      <div 
        id="resultado-pdf" 
        className="container py-12 bg-white text-black" 
        style={{ backgroundColor: '#ffffff', color: '#000000' }}
      >
        {/* SEÇÃO 1: Resumo e Benchmarking */}
        <section className="avoid-break-pdf mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 border-2 border-accent bg-white text-black">
              <CardHeader className="text-center">
                <CardTitle>Nível de Maturidade</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-bold text-cyan-600 mb-2">{result.maturityLevel}</div>
                <div className="text-2xl font-semibold mb-2">{levelInfo.name}</div>
                <p className="text-gray-600 text-sm mb-4">{levelInfo.description}</p>
                <Progress value={(result.maturityLevel / 5) * 100} className="h-3 bg-gray-100" />
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-white text-black">
              <CardHeader>
                <CardTitle>Benchmarking</CardTitle>
                <CardDescription>Comparação com o mercado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Seu Score</span>
                      <span className="text-cyan-600 font-bold">{result.benchmarking.userScore}/5</span>
                    </div>
                    <Progress value={(result.benchmarking.userScore / 5) * 100} className="h-2 bg-gray-100" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Média de Mercado</span>
                      <span className="text-gray-500">{result.benchmarking.marketAverage}/5</span>
                    </div>
                    <Progress value={(result.benchmarking.marketAverage / 5) * 100} className="h-2 bg-gray-100" />
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Você está no</p>
                    <p className="text-3xl font-bold text-cyan-600">{result.benchmarking.percentile}º percentil</p>
                    {/* <p className="text-sm text-gray-500">Melhor que {100 - result.benchmarking.percentile}% das organizações</p> */}
                   
                    <p className="text-sm text-gray-500">Melhor que {result.benchmarking.percentile}% das organizações</p>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 2: Gráficos de Pilar e Radar */}
        <section className="avoid-break-pdf mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Pontuação por Pilar TDM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#666" />
                      <YAxis domain={[0, 5]} stroke="#666" />
                      <Tooltip />
                      <Bar dataKey="score" fill="#06b6d4" isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Visão Geral de Maturidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} /> 
                      <Radar 
                        name="Score" 
                        dataKey="value" 
                        stroke="#06b6d4" 
                        fill="#06b6d4" 
                        fillOpacity={0.6} 
                        isAnimationActive={false} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 3: Gaps Identificados */}
        <section className="avoid-break-pdf mb-12">
          <Card className="border-2 border-red-200 bg-white">
            <CardHeader>
              <CardTitle className="text-red-600">3 Principais Gaps Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.gaps.map((gap, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-red-50 border border-red-100">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-700">
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-black">
                      <h4 className="font-semibold text-red-900">{gap.name}</h4>
                      <p className="text-sm text-red-800 mt-1">{gap.gap}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SEÇÃO 4: Recomendações Prioritárias */}
        <section className="avoid-break-pdf mb-12">
          <Card className="border-2 border-green-200 bg-white">
            <CardHeader>
              <CardTitle className="text-green-600">Recomendações Prioritárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700">
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-black">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-green-900">{rec.title}</h4>
                      </div>
                      <p className="text-sm text-green-800">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Botão de Rodapé - Escondido no PDF */}
        <div className="text-center mt-8 no-print">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate("/")}
          >
            Iniciar Novo Diagnóstico
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}