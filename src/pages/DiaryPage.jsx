import { Container, Card, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useTripData } from "../contexts/TripDataContext";
import { AuthContext } from "../components/AuthProvider";
import { useSearchParams } from "react-router-dom";

export default function DiaryPage() {
    const [searchParams] = useSearchParams();
    const tripId = searchParams.get("tripId");

    const { currentUser } = useContext(AuthContext);
    const userId = currentUser?.uid;

    const [showModal, setShowModal] = useState(null);
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);

    const { diaryEntries, fetchDiaryEntriesByUser, saveDiaryEntry } = useTripData();

    // 1. Fetch the data when the component loads
    useEffect(() => {
        if (userId) {
            fetchDiaryEntriesByUser(tripId, userId);
        }
    }, [tripId, userId]);

    const handleClose = () => setShowModal(null);
    const handleAdd = () => setShowModal('Add');

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Pass as an object to match the Context definition
            await saveDiaryEntry({ tripId, caption, file });
            handleClose();
            setCaption('');
            setFile(null);
            // Refresh the list after saving
            fetchDiaryEntriesByUser(tripId);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">{tripId ? "Trip Diary" : "My Diary"}</h2>

            {/* 2. Use Row and Col for the grid */}
            <Row>
                {diaryEntries && diaryEntries.length > 0 ? (
                    diaryEntries.map((entry) => (
                        // md={4} means 12/4 = 3 columns on medium+ screens
                        <Col key={entry.id} xs={12} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                {entry.photo_url && (
                                    <Card.Img
                                        variant="top"
                                        src={entry.photo_url} // Note: photo_url from DB
                                        style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Text>{entry.caption}</Card.Text>
                                </Card.Body>
                                <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                        {new Date(entry.date_created).toLocaleDateString()}
                                    </small>
                                    <div>
                                        <Button variant="link" size="sm" className="p-0 me-2 text-primary">Edit</Button>
                                        <Button variant="link" size="sm" className="p-0 text-danger">
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p className="text-muted">No diary entries yet.</p>
                    </Col>
                )}
            </Row>

            {tripId && (
                <Button
                    onClick={handleAdd}
                    variant="outline-primary"
                    className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg"
                    style={{ width: '60px', height: '60px', fontSize: '24px' }}
                >✚</Button>
            )}

            <Modal show={showModal !== null} onHide={handleClose} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton><Modal.Title>Add Diary Entry</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption..." required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Save Entry</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}