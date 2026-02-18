import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Zap, BarChart3, Target } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const captureLead = trpc.leads.capture.useMutation();
  const startDiagnosis = trpc.diagnoses.start.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadResult = await captureLead.mutateAsync({
        email,
      });

      const diagnosisResult = await startDiagnosis.mutateAsync({
        leadId: leadResult.leadId!,
        type: "express",
      });

      setLocation(`/diagnostico/${diagnosisResult.token}`);
    } catch (error) {
      toast.error("Erro ao iniciar diagnóstico. Tente novamente.");
      console.error(error);
    }
  };

  const isLoading = captureLead.isPending || startDiagnosis.isPending;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold">Assistente TDM</div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-sm hover:text-accent transition">Benefícios</a>
            <a href="#faq" className="text-sm hover:text-accent transition">FAQ</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              Avalie a Maturidade da Gestão de Dados de Teste TDM (Test Data Manager)
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
              Diagnóstico rápido e preciso baseado no modelo TDM (Test Data Manager). Receba insights acionáveis em minutos.
            </p>
            
            {/* Email Capture */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isLoading ? "..." : "Começar"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                ✓ Sem cadastro complexo  ✓ Resultado imediato  ✓ Dados seguros
              </p>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Baseado em TDM Oficial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Dados 100% Privados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Sem Compromisso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostic Options */}
      <section className="py-20 md:py-32 bg-card border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Diagnóstico TDM</h2>
            <p className="text-lg text-muted-foreground">
              Avalie a maturidade da gestão de dados de teste em sua organização.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Express */}
            <Card className="relative border-2 border-accent/20 hover:border-accent/50 transition">
              <div className="absolute -top-4 left-6 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Mais Popular
              </div>
              <CardHeader>
                <div className="text-4xl mb-4">⚡</div>
                <CardTitle>Diagnóstico Express</CardTitle>
                <CardDescription>Avaliação rápida e objetiva</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-accent mb-1">5 min</div>
                  <p className="text-sm text-muted-foreground">Tempo estimado</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">10 perguntas de múltipla escolha</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Resultado imediato</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Nível TDM + 3 principais gaps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Recomendações prioritárias</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Benchmarking com o mercado</span>
                  </li>
                </ul>

                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
              Começar Diagnóstico
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <a href="/exemplo-relatorio">
              <Button variant="outline" size="lg">
                Ver Exemplo de Relatório
              </Button>
            </a>     <p className="text-xs text-muted-foreground text-center mt-3">
                  Ideal para quem quer uma visão geral rápida
                </p>
              </CardContent>
            </Card>


            {/* Complete */}
           
            <Card className="border-2 border-border opacity-60">
              <div className="absolute -top-4 left-6 bg-muted text-muted-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Em Breve
              </div>
              <CardHeader>
                <div className="text-4xl mb-4">🎯</div>
                <CardTitle>Diagnóstico Completo</CardTitle>
                <CardDescription>Análise profunda e detalhada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-muted-foreground mb-1">30-40 min</div>
                  <p className="text-sm text-muted-foreground">Tempo estimado</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Conversa com IA especializada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Análise das 16 áreas TMMi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Pontuação detalhada por área</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Roadmap de implementação 12 meses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Relatório executivo completo</span>
                  </li>
                </ul>

                <Button disabled className="w-full">
                  Em Breve
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Por Que Profissionais de QA Confiam no Assistente TMMi?</h2>
            <p className="text-lg text-muted-foreground">
              A forma mais moderna e eficiente de avaliar maturidade de processos de teste
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <Zap className="w-8 h-8 text-accent mb-4" />
                <CardTitle>Flexível e Adaptável</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Escolha entre uma avaliação rápida ou uma análise profunda. Você decide o nível de detalhe.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <Target className="w-8 h-8 text-accent mb-4" />
                <CardTitle>Fundamentado em TMMi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Baseado no Test Maturity Model integration, o padrão global reconhecido para maturidade de processos de teste.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-accent mb-4" />
                <CardTitle>Insights Acionáveis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Não apenas um número. Receba gaps específicos, benchmarking e um plano de ação pronto para executar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-card border-t border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona?</h2>
            <p className="text-lg text-muted-foreground">
              Um processo simples para descobrir o verdadeiro nível de maturidade dos seus testes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, title: "Escolha seu modelo", desc: "Selecione entre Express (5min) ou Completo (30-40min)" },
              { step: 2, title: "Receba o link", desc: "Preencha seus dados e receba instantaneamente o link do assistente" },
              { step: 3, title: "Responda as perguntas", desc: "Interaja com o assistente de IA especializado" },
              { step: 4, title: "Execute o plano", desc: "Implemente as recomendações e veja sua equipe evoluir" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-6 -right-4 text-2xl text-border">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas sobre o Assistente de Avaliação TMMi
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { q: "Preciso me cadastrar ou fornecer cartão de crédito?", a: "Não. O diagnóstico é completamente gratuito e sem compromisso. Você apenas precisa fornecer seu e-mail para receber o resultado." },
              { q: "Meus dados estão seguros?", a: "Sim. Seus dados são criptografados e armazenados com segurança. Nunca compartilhamos informações com terceiros." },
              { q: "Qual a diferença entre o Diagnóstico Express e o Completo?", a: "O Express é rápido (5 min) com 10 perguntas. O Completo é mais profundo (30-40 min) com análise conversacional de IA." },
              { q: "O que é TMMi?", a: "TMMi é o Test Maturity Model integration, um framework internacional para avaliar e melhorar processos de teste." },
              { q: "Preciso ter conhecimento técnico avançado?", a: "Não. As perguntas são formuladas para profissionais de QA de todos os níveis." },
              { q: "Vou receber o resultado por e-mail?", a: "Sim. O resultado é exibido imediatamente e também enviado por e-mail com um link para download do relatório em PDF." },
            ].map((item, idx) => (
              <Card key={idx} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para Elevar Seus Processos de Teste?</h2>
            <p className="text-lg mb-8 opacity-90">
              Escolha seu modelo de diagnóstico e descubra os gaps críticos que estão impedindo sua evolução.
            </p>
            
            <Button size="lg" className="bg-white text-accent hover:bg-white/90">
              Começar Diagnóstico Agora <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-12 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Sem cadastro complexo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Resultado imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Baseado em TMMi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Assistente TMMi</h3>
              <p className="text-sm text-muted-foreground">
                Avaliação de maturidade de testes baseada em TMMi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Diagnóstico Express</a></li>
                <li><a href="#" className="hover:text-foreground">Exemplo de Relatório</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">TMMi Foundation</a></li>
                <li><a href="#" className="hover:text-foreground">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Assistente TMMi. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
