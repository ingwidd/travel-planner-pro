import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import beachPicnic from '../assets/beach-picnic.png';

export default function AuthPage() {
    const [modalShow, setModalShow] = useState(null);
    const handleShowSignUp = () => setModalShow('Signup');
    const handleShowLogin = () => setModalShow('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) navigate('/home');
    }, [currentUser, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            alert("Sign up successful! You are now logged in.");
            console.log(res.user);
        } catch (error) {
            alert("Sign up failed.")
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert("Login failed: Check your email and password.");
            console.error('Status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            console.error('Full error:', error);
        }
    };

    const handleClose = () => setModalShow(null);

    return (
        <Container fluid className="min-vh-100 overflow-hidden bg-light p-0">
            <Row className="g-0 min-vh-100">
                <Col md={7} className="p-0" style={{ height: '100vh', overflow: 'hidden' }}>
                    <Image
                        src={beachPicnic}
                        alt="Beach picnic preview"
                        fluid
                        className="w-100"
                        style={{ objectFit: 'cover', height: '100%' }}
                    />
                </Col>
                <Col md={5} className="p-4 p-lg-5 d-flex flex-column justify-content-center">
                    <h2 className="fw-bold mb-3">Travel Planner Pro</h2>
                    <p className="text-muted mb-4">
                        Keep your itinerary, to-dos, and diary in one place.
                    </p>
                    <div className="d-grid gap-2">
                        <Button className="rounded-pill btn btn-ocean" size="md" onClick={handleShowSignUp}>
                            Sign Up
                        </Button>
                        <Button className="rounded-pill" size="md" variant="outline-secondary" onClick={handleShowLogin}>
                            Log in
                        </Button>
                    </div>
                </Col>
            </Row>

            <Modal show={modalShow != null} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4 className="mb-4" style={{ fontWeight: 'bold' }}>
                            {modalShow === 'Signup' ? 'Create your account' : 'Log in to your account'}
                        </h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>                   
                    <Form
                        className="d-grid gap-2 px-5"
                        onSubmit={modalShow === 'Signup' ? handleSignUp : handleLogin}
                    >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Enter email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Group>
                        <Button className="rounded-pill btn btn-ocean" type="submit">
                            {modalShow === 'Signup' ? 'Sign up' : 'Log in'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}