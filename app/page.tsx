"use client";

import { useMemo, useState } from "react";
import { sampleItems } from "@/lib/sample-data";

const VEHICLES = ["오토바이", "다마스", "라보", "1톤", "1.4톤", "2.5톤"];

function normalizeText(value: string) {
  return value.replace(/\s/g, "").trim();
}

function isSimilar(a: string, b: string) {
  const aa = normalizeText(a);
  const bb = normalizeText(b);
  return aa.includes(bb) || bb.includes(aa);
}

function formatPrice(value: number) {
  return `${value.toLocaleString()}원`;
}

export default function Page() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicle, setVehicle] = useState("다마스");
  const [searched, setSearched] = useState(false);

  const matchedItems = useMemo(() => {
    return sampleItems.filter((item) => {
      const vehicleMatch = item.vehicle === vehicle;
      const fromMatch = from ? isSimilar(item.from, from) : true;
      const toMatch = to ? isSimilar(item.to, to) : true;
      return vehicleMatch && fromMatch && toMatch;
    });
  }, [from, to, vehicle]);

  const summary = useMemo(() => {
    if (matchedItems.length === 0) return null;

    const prices = matchedItems.map((item) => item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);

    return {
      min,
      max,
      avg,
      count: matchedItems.length,
    };
  }, [matchedItems]);

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "44px", marginBottom: "12px" }}>온누리퀵 배송비 조회</h1>
        <p style={{ color: "#475569", marginBottom: "32px" }}>
          출발지, 도착지, 차량 종류를 입력하면 과거 사례 기준 예상 배송비를 조회합니다.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>조회 조건 입력</h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>출발지</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="예: 서울 중구 인현동"
                style={{ width: "100%", padding: "12px", fontSize: "16px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>도착지</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="예: 수원시청"
                style={{ width: "100%", padding: "12px", fontSize: "16px" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>차량 종류</label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                style={{ width: "100%", padding: "12px", fontSize: "16px" }}
              >
                {VEHICLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSearched(true)}
              style={{
                padding: "14px 20px",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              배송비 조회
            </button>
          </div>

          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>조회 결과</h2>

            {!searched ? (
              <div style={{ background: "#f8fafc", padding: "20px", color: "#64748b" }}>
                출발지, 도착지, 차량을 입력한 뒤 배송비 조회 버튼을 눌러주세요.
              </div>
            ) : summary ? (
              <div>
                <div style={{ background: "#eff6ff", padding: "20px", marginBottom: "16px" }}>
                  <div style={{ color: "#475569", marginBottom: "8px" }}>예상 배송비</div>
                  <div style={{ fontSize: "36px", fontWeight: "bold" }}>{formatPrice(summary.avg)}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ border: "1px solid #e2e8f0", padding: "16px" }}>
                    <div style={{ color: "#64748b", marginBottom: "8px" }}>최저</div>
                    <div style={{ fontWeight: "bold" }}>{formatPrice(summary.min)}</div>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", padding: "16px" }}>
                    <div style={{ color: "#64748b", marginBottom: "8px" }}>평균</div>
                    <div style={{ fontWeight: "bold" }}>{formatPrice(summary.avg)}</div>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", padding: "16px" }}>
                    <div style={{ color: "#64748b", marginBottom: "8px" }}>최고</div>
                    <div style={{ fontWeight: "bold" }}>{formatPrice(summary.max)}</div>
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", color: "#475569" }}>
                  유사 사례 {summary.count}건 기준입니다. 실제 배차 시 금액은 변동될 수 있습니다.
                </div>
              </div>
            ) : (
              <div style={{ background: "#fef3c7", padding: "20px", color: "#92400e" }}>
                유사 사례 부족, 직접 문의 필요
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: "24px", background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>유사 사례</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th style={{ textAlign: "left", padding: "12px" }}>날짜</th>
                <th style={{ textAlign: "left", padding: "12px" }}>출발지</th>
                <th style={{ textAlign: "left", padding: "12px" }}>도착지</th>
                <th style={{ textAlign: "left", padding: "12px" }}>차량</th>
                <th style={{ textAlign: "right", padding: "12px" }}>금액</th>
                <th style={{ textAlign: "left", padding: "12px" }}>비고</th>
              </tr>
            </thead>
            <tbody>
              {(searched ? matchedItems : sampleItems.slice(0, 6)).map((item, idx) => (
                <tr key={idx} style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px" }}>{item.date}</td>
                  <td style={{ padding: "12px" }}>{item.from}</td>
                  <td style={{ padding: "12px" }}>{item.to}</td>
                  <td style={{ padding: "12px" }}>{item.vehicle}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>{formatPrice(item.price)}</td>
                  <td style={{ padding: "12px" }}>{item.note}</td>
                </tr>
              ))}

              {searched && matchedItems.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                    조회 조건과 일치하는 유사 사례가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}