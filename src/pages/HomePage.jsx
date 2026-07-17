import { Container, Col } from "react-bootstrap";
import CurrencyConverter from '../components/CurrencyConverter';
import dasboardPhoto from '../assets/dashboard_photo.png';
import { useState } from "react";

export default function HomePage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <div
        className="text-center text-white d-flex flex-column justify-content-center align-items-center mb-2"
        style={{
          backgroundImage: `url(${dasboardPhoto})`,
          backgroundSize: 'cover',
          height: '320px'
        }}
        fluid
      >
      </div>

      <div className="container-fluid">
        <div className="row g-4">
          {/* Left column — flight search, 70% width */}
          <div className="col-12 col-lg-8" style={{ flex: '7 1 0%' }}>
            <div className="p-4 rounded-3 h-100">
              <input
                type="text"
                placeholder="Search destinations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '80%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '15px'
                }}
              />

              {/* flight search form goes here */}
            </div>
          </div>

          <div className="col-12 col-lg-4" style={{ flex: '3 1 0%' }}>
            <div className="p-4 rounded-3 h-100" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}