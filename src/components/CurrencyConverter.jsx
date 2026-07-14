import { useState, useCallback, useEffect, useRef } from 'react';

export default function CurrencyConverter() {
  const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$'},
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  ];
  
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(''); 
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  const fetchRate = useCallback(async (amt, fromCode, toCode) => {
    if (fromCode === toCode) {
      setResult(Number(amt) || 0);
      setRate(1);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const safeAmount = Number(amt) > 0 ? Number(amt) : 1;
      const fromLower = fromCode.toLowerCase();
      const toLower = toCode.toLowerCase();
      const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2025.8.12/v1/currencies/${fromLower}.json`);
      
      if (!res.ok) throw new Error('Request failed');
      
      const data = await res.json();
      const unitRate = data[fromLower][toLower];

      if (unitRate === undefined) throw new Error('Currency not found');

      setResult(unitRate * safeAmount);
      setRate(unitRate);
      setDate(data.date);
    } catch (error) {
      setError("Could not fetch live rates. Check your connection and try again.");
      console.log(error);
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

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) setAmount(val);
  };

  const formattedResult = result != null ? new Intl.NumberFormat('en-US', {
    maximumFractionDigits: result < 10 ? 4 : 2,
  }).format(result)
  : '-';

  return (
    <div>
      <h2>Currency Converter</h2>
 
      <div>
        <label htmlFor="cc-amount">Amount</label>
        <input
          id="cc-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
        />
      </div>
 
      <div>
        <label htmlFor="cc-from">From</label>
        <select id="cc-from" value={from} onChange={(e) => setFrom(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>
 
      <button type="button" onClick={handleSwap}>
        Swap
      </button>
 
      <div>
        <label htmlFor="cc-to">To</label>
        <select id="cc-to" value={to} onChange={(e) => setTo(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>
 
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>
            {amount} {from} = {formattedResult} {to}
          </p>
        )}
      </div>
 
      {error && <p>{error}</p>}
 
      {rate !== null && !loading && (
        <p>
          1 {from} = {new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rate)} {to}
          {date && ` (updated ${date})`}
        </p>
      )}
    </div>
  );
}