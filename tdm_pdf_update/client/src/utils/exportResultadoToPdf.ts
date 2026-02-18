// exportresultadotopdf.ts
import html2pdf from 'html2pdf.js';

export async function exportResultadoToPdf(elementId: string, filename = "resultado-diagnostico-tdm.pdf") {
  const element = document.getElementById(elementId);
  if (!element) return;

  const options = {
    margin: [10, 10, 10, 10], // Margens: topo, direita, baixo, esquerda
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      logging: false 
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'] 
    }
  };

  // Importante: Adicionar um pequeno delay para garantir que os gráficos (charts) renderizaram
  setTimeout(() => {
    html2pdf().set(options).from(element).save();
  }, 500);
}