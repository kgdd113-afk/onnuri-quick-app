import * as XLSX from 'xlsx';

export function exportQuoteToExcel({
  items,
  summary,
  fileName
}: {
  items: any[];
  summary: { supplyTotal: number; vat: number; grandTotal: number };
  fileName: string;
}) {
  const wsData = [
    ['품목명', '규격', '수량', '단가', '금액'],
    ...items.map(item => [
      item.name,
      item.spec,
      item.quantity,
      item.unitPrice,
      item.unitPrice * item.quantity
    ]),
    [],
    ['공급가액', '', '', '', summary.supplyTotal],
    ['부가세', '', '', '', summary.vat],
    ['총합계', '', '', '', summary.grandTotal],
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '비교견적');
  XLSX.writeFile(wb, fileName);
}
