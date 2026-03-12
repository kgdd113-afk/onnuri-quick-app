import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportQuoteToPDF({
  items,
  summary,
  fileName,
  meta
}: {
  items: any[];
  summary: { supplyTotal: number; vat: number; grandTotal: number };
  fileName: string;
  meta: { title: string; date: string; manager: string; company: string };
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('helvetica');

  // 제목/정보
  doc.setFontSize(18);
  doc.text(meta.title, 105, 20, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`작성일: ${meta.date}`, 15, 32);
  doc.text(`담당자: ${meta.manager}`, 15, 40);
  doc.text(`업체명: ${meta.company}`, 15, 48);

  // 표
  autoTable(doc, {
    startY: 55,
    head: [['품목명', '규격', '수량', '단가', '금액']],
    body: items.map(item => [
      item.name,
      item.spec,
      item.quantity,
      item.unitPrice,
      item.unitPrice * item.quantity
    ]),
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 245, 255] },
    tableWidth: 'auto',
    margin: { left: 15, right: 15 },
  });

  // 합계
  let y = ((doc as any).lastAutoTable?.finalY) || 55 + items.length * 8;
  doc.setFontSize(11);
  doc.text(`공급가액: ${summary.supplyTotal.toLocaleString()}원`, 15, y + 12);
  doc.text(`부가세: ${summary.vat.toLocaleString()}원`, 15, y + 20);
  doc.text(`총합계: ${summary.grandTotal.toLocaleString()}원`, 15, y + 28);

  doc.save(fileName);
}
