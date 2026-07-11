import{
    signInWithPopup,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button, Col, Image, Row, Modal, Form } from 'react-bootstrap';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider'

export default function AuthPage() {
    const loginImage = './assets/beach-picnic.jpg';

    const [modalShow, setModalShow] = useState(null);
    const handleShowSignUp = () => setModalShow("Signup");
    const handleShowLogin = () => setModalShow("Login");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) navigate("/profile");
    }, [currentUser, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                username,
                password
            )
            console.log(res.user);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password)
        } catch (error) {
            console.error("Status:", error.response?.status);
            console.error("Error data:", error.response?.data);
            console.error("Full error:", error);
        }
    };

    const handleClose = () => setModalShow(null);

    return (
        <Row>
            <Col sm={6}>
                <Image src={loginImage} fluid />
            </Col>
            <Col sm={5} className='p-4'>
                <Button className='rounded-pill btn btn-ocean' onClick={handleShowSignUp}>Sign Up</Button> 
                <Button className='rounded pill' variant='outline-secondary' onClick={handleShowLogin}>Log in</Button>
            </Col>

            <Modal
                show={modalShow != null}
                onHide={handleClose}
                centered
            >
                <Modal.Body>
                    <h3 className='mb-4' style={{ fontWeight: "bold" }}>
                        {modalShow === "SignUp" ? "Create your account" : "Log in to your account"}
                    </h3>
                    <Form
                        className='d-grid gap-2 px-5'
                        onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
                    >
                        <Form.Group className='mb-3' controlId='formBasicEmail'>
                            <Form.Control
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                                placeholder='Enter email'
                            />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='formBasicPassword'>
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                placeholder='Password'
                            />
                        </Form.Group>
                        <Button className='rounded-pill btn btn-ocean' type='submit'>
                            {modalShow === "SignUp" ? "Sign up" : "Log in"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    );
}