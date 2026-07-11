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
    const [username, setUsername] = useState('');
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
            <Col sm={6} className='p-4'>
                <Button className='rounded-pill btn btn-ocean'>Sign Up</Button> 
            </Col>
        </Row>
    );
}