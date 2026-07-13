import React, { useState, useMemo } from "react";
import { SwapIcon, RefreshIcon } from "./Icons";

// Static fallback rates (relative to USD). Replace `RATES` with a live fetch, e.g.:
//
//   useEffect(() => {
//     fetch("https://api.exchangerate.host/latest?base=USD")
//       .then((r) => r.json())
//       .then((data) => setRates(data.rates));
//   }, []);
//
// and swap the useState below for that fetched value.
const RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157.3,
  ARS: 1285,
  CLP: 940,
  AUD: 1.51,
  CAD: 1.36,
};

const CURRENCY_LABELS = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  ARS: "Argentine Peso",
  CLP: "Chilean Peso",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("ARS");

  const result = useMemo(() => {
    const numeric = parseFloat(amount);
    if (isNaN(numeric)) return null;
    const usdValue = numeric / RATES[from];
    return usdValue * RATES[to];
  }, [amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const selectStyle = {
    fontFamily: "var(--font-mono)",
    background: "var(--color-card-soft)",
    color: "var(--color-text-hi)",
    border: `1px solid var(--color-border)`,
    fontSize: "0.85rem",
  };

  return (
    <div
      className="position-relative rounded-4 p-4 h-100"
      style={{ background: "var(--color-card)", border: `1px solid var(--color-border)` }}
    >
      <div
        className="position-absolute top-0 start-0 end-0 rounded-top-4"
        style={{ height: "3px", background: "var(--color-currency)" }}
      />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-hi)",
            fontWeight: 600,
            fontSize: "1.3rem",
          }}
        >
          Currency Converter
        </h2>
        <RefreshIcon size={15} color={"var(--color-text-low)"} />
      </div>

      <label
        className="d-block mb-1"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", fontSize: "0.7rem", letterSpacing: "0.06em" }}
      >
        AMOUNT
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="form-control mb-3"
        style={{
          fontFamily: "var(--font-mono)",
          background: "var(--color-card-soft)",
          color: "var(--color-text-hi)",
          border: `1px solid var(--color-border)`,
        }}
      />

      <div className="d-flex align-items-end gap-2 mb-3">
        <div className="flex-grow-1">
          <label
            className="d-block mb-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", fontSize: "0.7rem", letterSpacing: "0.06em" }}
          >
            FROM
          </label>
          <select
            className="form-select"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={selectStyle}
          >
            {Object.keys(RATES).map((code) => (
              <option key={code} value={code}>
                {code} — {CURRENCY_LABELS[code]}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center mb-1"
          style={{
            width: "36px",
            height: "36px",
            background: "var(--color-card-soft)",
            border: `1px solid var(--color-border)`,
            flexShrink: 0,
          }}
          aria-label="Swap currencies"
        >
          <SwapIcon size={15} color={"var(--color-currency)"} />
        </button>

        <div className="flex-grow-1">
          <label
            className="d-block mb-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", fontSize: "0.7rem", letterSpacing: "0.06em" }}
          >
            TO
          </label>
          <select
            className="form-select"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={selectStyle}
          >
            {Object.keys(RATES).map((code) => (
              <option key={code} value={code}>
                {code} — {CURRENCY_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="rounded-3 p-3 text-center"
        style={{ background: "var(--color-card-soft)", border: `1px solid var(--color-border)` }}
      >
        <div
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", fontSize: "0.7rem", letterSpacing: "0.06em" }}
        >
          {amount || 0} {from} =
        </div>
        <div
          style={{ fontFamily: "var(--font-display)", color: "var(--color-currency)", fontWeight: 600, fontSize: "1.6rem" }}
        >
          {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}{" "}
          <span style={{ fontSize: "1rem", color: "var(--color-text-mid)" }}>{to}</span>
        </div>
      </div>

      <p
        className="mt-2 mb-0"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-text-low)", fontSize: "0.7rem" }}
      >
        Rates are static placeholders — connect a live exchange-rate API for production use.
      </p>
    </div>
  );
}