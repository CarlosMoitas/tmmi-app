import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportResultadoToPdf(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      // Esta opção ajuda a ignorar propriedades de CSS que ele não entende
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById(elementId);
        if (el) {
          el.style.fontFamily = "Arial, sans-serif";
        }
      },
      // Ignora erros de parse para não interromper a execução
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    pdf.save("resultado-diagnostico.pdf");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    // Se o html2canvas falhar, pelo menos tenta imprimir a página
    window.print();
  }
}