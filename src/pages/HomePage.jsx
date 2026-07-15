import { Container } from "react-bootstrap";
import CurrencyConverter from '../components/CurrencyConverter';
import dasboardPhoto from '../assets/dashboard_photo.png'

export default function HomePage() {
  return (
    <div>
      <div 
        className="text-center text-white d-flex flex-column justify-content-center align-items-center mb-4"
        style={{ 
          backgroundImage: `url(${dasboardPhoto})`,
          backgroundSize: 'cover',
          height: '320px'
        }}
        fluid
      >
      </div>
      
    </div>
  );
}