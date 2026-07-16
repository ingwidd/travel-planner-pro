import { Container, Col } from "react-bootstrap";
import CurrencyConverter from '../components/CurrencyConverter';
import dasboardPhoto from '../assets/dashboard_photo.png'

export default function HomePage() {
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
            <div className="p-4 rounded-3 h-100" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3>
                Search Flights
              </h3>
              {/* flight search form goes here */}
            </div>
          </div>

          <div className="col-12 col-lg-4" style={{ flex: '3 1 0%' }}>
            <div className="p-4 rounded-3 h-100" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-hi)' }}>
                Shortcuts
              </h3>
              {/* shortcut components go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}