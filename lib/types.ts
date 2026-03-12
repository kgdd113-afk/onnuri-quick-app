export type QuoteItem = {
  id: string;
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number;
};

export type QuoteSummary = {
  supplyTotal: number;
  vat: number;
  grandTotal: number;
};

export type QuoteMeta = {
  companyName: string;
  manager: string;
  quoteDate: string;
};
