import { useState, useCallback, useEffect, useRef } from "react";

export default function CurrencyConverter() {
  const CURRENCIES = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
    { code: "THB", name: "Thai Baht" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "ZAR", name: "South African Rand" },
  ];

  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("MYR");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  const fetchRate = useCallback(async (amt, fromCode, toCode) => {
    // FIX: Set result to 0 immediately if amount is 0 or empty
    if (!amt || Number(amt) === 0) {
      setResult(0);
      setError(null);
      setLoading(false);
      return;
    }

    if (fromCode === toCode) {
      setResult(Number(amt));
      setRate(1);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fromLower = fromCode.toLowerCase();
      const toLower = toCode.toLowerCase();
      
      const res = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromLower}.json`
      );

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      const unitRate = data[fromLower][toLower];

      if (unitRate === undefined) throw new Error("Currency not found");

      setResult(unitRate * Number(amt));
      setRate(unitRate);
      setDate(data.date);
    } catch (error) {
      setError("Could not fetch live rates. Check your connection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchRate(amount, from, to);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [amount, from, to, fetchRate]);

  const handleConvert = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchRate(amount, from, to);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setAmount("");
    setFrom("MYR");
    setTo("USD");
    setResult(null);
    setRate(null);
    setDate(null);
    setError(null);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    // Allows numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(val)) setAmount(val);
  };

  const formattedResult =
    result !== null
      ? new Intl.NumberFormat("en-US", {
          maximumFractionDigits: result < 10 && result !== 0 ? 4 : 2,
        }).format(result)
      : "";

  return (
    <div className="card border-primary h-100 p-4 shadow-sm">
      <h4 className="text-center text-primary mb-4">Currency Converter</h4>

      {/* Amount Input */}
      <div className="d-flex justify-content-between align-items-center border-bottom border-primary pb-2 mb-2">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
          className="form-control form-control-plaintext fs-3 text-primary fw-bold"
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="form-select form-select-sm border-primary text-primary w-auto"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>
      </div>

      {/* Result Output */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          value={loading ? "..." : formattedResult}
          readOnly
          placeholder="0"
          className="form-control form-control-plaintext fs-3 text-primary fw-bold"
        />
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="form-select form-select-sm border-primary text-primary w-auto"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="d-grid gap-2 d-md-flex justify-content-center mb-3">
        <button type="button" onClick={handleConvert} className="btn btn-primary px-4">
          Convert
        </button>
        <button
          type="button"
          onClick={handleSwap}
          className="btn btn-outline-primary"
          title="Swap currencies"
        >
          ⇄
        </button>
        <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
          Reset
        </button>
      </div>

      {/* Live Rate Information */}
      {error && <p className="text-danger small text-center mb-1">{error}</p>}
      {rate !== null && !loading && !error && (
        <div className="text-center">
          <p className="text-muted small mb-0">
            1 {from} = {new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(rate)} {to}
          </p>
          {date && <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Rates updated: {date}</p>}
        </div>
      )}
    </div>
  );
}