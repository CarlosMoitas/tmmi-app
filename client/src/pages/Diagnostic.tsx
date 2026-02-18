import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { EXPRESS_QUESTIONS } from "@shared/tmmi";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Diagnostic() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const submitDiagnosis = trpc.diagnoses.submit.useMutation();

  const question = EXPRESS_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / EXPRESS_QUESTIONS.length) * 100;
  const isAnswered = answers[question?.id] !== undefined;

  const handleSelectAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < EXPRESS_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Validar se todas as perguntas foram respondidas
    if (Object.keys(answers).length !== EXPRESS_QUESTIONS.length) {
      toast.error("Por favor, responda todas as perguntas antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Enviando respostas:", answers);
      const result = await submitDiagnosis.mutateAsync({
        token: token!,
        answers: answers,
      });
      console.log("Resultado:", result);
      setIsCompleted(true);
      setTimeout(() => {
        setLocation(`/resultado/${result.diagnosisId}`);
      }, 2000);
    } catch (error) {
      toast.error("Erro ao enviar diagnóstico. Tente novamente.");
      console.error("Error submitting diagnosis:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12">
        <div className="container max-w-2xl">
          <Card className="border-2 border-accent">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-accent" />
              </div>
              <CardTitle className="text-3xl">Diagnóstico Completo!</CardTitle>
              <CardDescription className="text-lg mt-2">
                Suas respostas foram recebidas. Processando análise...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Você será redirecionado para o resultado em alguns momentos.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Diagnóstico Express TMMi (TDM)</h1>
          <p className="text-muted-foreground">
            Pergunta {currentQuestion + 1} de {EXPRESS_QUESTIONS.length}
          </p>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-8 h-2" />

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{question?.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[question?.id]?.toString() || ""} onValueChange={(v) => handleSelectAnswer(parseInt(v))}>
              <div className="space-y-4">
                {question?.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentQuestion === EXPRESS_QUESTIONS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered || isSubmitting}
              className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2"
            >
              {isSubmitting ? "Enviando..." : "Enviar Diagnóstico"}
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2"
            >
              Próxima
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
          <p>
            💡 <strong>Dica:</strong> Responda com sinceridade para obter uma análise mais precisa da maturidade de testes da sua organização.
          </p>
        </div>
      </div>
    </div>
  );
}
