"use client";
import React, { useRef, useState } from "react";

type Item = {
  id: number;
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number;
};

export default function Page() {
  // 샘플 품목 데이터
  const sampleData: Item[] = [
    { id: 1, name: "품목A", spec: "규격A", quantity: 10, unitPrice: 1000 },
    { id: 2, name: "품목B", spec: "규격B", quantity: 5, unitPrice: 2000 },
  ];
  const [items, setItems] = useState<Item[]>(sampleData);

  // 할인율 state
  const [discount1, setDiscount1] = useState(3);
  const [discount2, setDiscount2] = useState(7);

  // 금액 계산
  const getAmount = (item: Item, discount = 0) =>
    Math.round(item.quantity * item.unitPrice * (1 - discount / 100));

  // 공급가액, 부가세, 총합계 계산
  const getSummary = (discount: number) => {
    const supply = items.reduce(
      (sum, item) => sum + getAmount(item, discount),
      0
    );
    const vat = Math.round(supply * 0.1);
    const total = supply + vat;
    return { supply, vat, total };
  };

  const summary1 = getSummary(discount1);
  const summary2 = getSummary(discount2);

  // 파일 업로드 UI용
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // 파일 선택 input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setUploadSuccess(true);
    } else {
      setFileName("");
      setUploadSuccess(false);
      if (file) alert("PDF 파일만 업로드 가능합니다.");
    }
  };
  // 드래그 앤 드롭
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setUploadSuccess(true);
    } else {
      setFileName("");
      setUploadSuccess(false);
      if (file) alert("PDF 파일만 업로드 가능합니다.");
    }
  };
  // 샘플 데이터 불러오기
  const handleLoadSample = () => {
    setItems(sampleData);
    setFileName("");
    setUploadSuccess(false);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 32,
        }}
      >
        {/* 왼쪽: PDF 업로드 + 표 */}
        <section
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>비교견적서 자동 생성</h1>
          <p style={{ color: "#475569", marginBottom: 24 }}>
            PDF 업로드 후 품목을 확인하고 비교견적서를 생성합니다.
          </p>
          <div
            style={{
              border: dragActive
                ? "2px solid #0ea5e9"
                : "2px dashed #cbd5e1",
              borderRadius: 16,
              padding: 40,
              textAlign: "center",
              background: dragActive ? "#e0f2fe" : "#f8fafc",
              marginBottom: 24,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              본 견적서 PDF 업로드
            </div>
            <p style={{ color: "#64748b", marginTop: 8 }}>
              드래그 앤 드롭 또는 파일 선택
            </p>
            {fileName && uploadSuccess && (
              <div style={{ marginTop: 16, color: "#0ea5e9", fontWeight: 600 }}>
                업로드 성공: {fileName}
              </div>
            )}
            {fileName && !uploadSuccess && (
              <div style={{ marginTop: 16, color: "#ef4444", fontWeight: 600 }}>
                업로드 실패: {fileName}
              </div>
            )}
            <button
              type="button"
              style={{
                marginTop: 20,
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#0f172a",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={handleLoadSample}
            >
              샘플 데이터 불러오기
            </button>
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>자동 추출 결과</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th style={{ padding: 12, textAlign: "left" }}>품목명</th>
                <th style={{ padding: 12, textAlign: "left" }}>규격</th>
                <th style={{ padding: 12, textAlign: "right" }}>수량</th>
                <th style={{ padding: 12, textAlign: "right" }}>단가</th>
                <th style={{ padding: 12, textAlign: "right" }}>금액</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: 12, borderTop: "1px solid #e2e8f0" }}>
                    {row.name}
                  </td>
                  <td style={{ padding: 12, borderTop: "1px solid #e2e8f0" }}>
                    {row.spec}
                  </td>
                  <td
                    style={{
                      padding: 12,
                      borderTop: "1px solid #e2e8f0",
                      textAlign: "right",
                    }}
                  >
                    {row.quantity}
                  </td>
                  <td
                    style={{
                      padding: 12,
                      borderTop: "1px solid #e2e8f0",
                      textAlign: "right",
                    }}
                  >
                    {row.unitPrice.toLocaleString()}원
                  </td>
                  <td
                    style={{
                      padding: 12,
                      borderTop: "1px solid #e2e8f0",
                      textAlign: "right",
                    }}
                  >
                    {(row.quantity * row.unitPrice).toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {/* 오른쪽: 할인율 입력, 결과 카드 */}
        <aside
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            height: "fit-content",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>비교견적 조건</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              비교견적서 1 할인율
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={discount1}
              onChange={(e) => setDiscount1(Number(e.target.value))}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
              }}
              placeholder="예: 3"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              비교견적서 2 할인율
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={discount2}
              onChange={(e) => setDiscount2(Number(e.target.value))}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
              }}
              placeholder="예: 7"
            />
          </div>
          <button
            style={{
              width: "100%",
              padding: 12,
              background: "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            비교견적서 2부 생성
          </button>
          {/* 결과 카드 */}
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8, color: "#334155" }}>
              비교견적서 1 결과
            </h3>
            <div
              style={{
                background: "#f1f5f9",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <div>
                공급가액: <b>{summary1.supply.toLocaleString()}원</b>
              </div>
              <div>
                부가세: <b>{summary1.vat.toLocaleString()}원</b>
              </div>
              <div>
                총합계: <b>{summary1.total.toLocaleString()}원</b>
              </div>
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 8, color: "#334155" }}>
              비교견적서 2 결과
            </h3>
            <div
              style={{
                background: "#f1f5f9",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div>
                공급가액: <b>{summary2.supply.toLocaleString()}원</b>
              </div>
              <div>
                부가세: <b>{summary2.vat.toLocaleString()}원</b>
              </div>
              <div>
                총합계: <b>{summary2.total.toLocaleString()}원</b>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}