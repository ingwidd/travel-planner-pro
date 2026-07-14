import { getAuth } from 'firebase/auth';
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../components/AuthProvider";
import { Container } from "react-bootstrap";

export default function HomePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    navigate('/login');
  }

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <>
      <Container>
        <h1>hello</h1>
      </Container>
    </>
  );
}