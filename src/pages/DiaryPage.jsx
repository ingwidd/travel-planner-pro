import { Container, Card, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useTripData } from "../contexts/TripDataContext";

export default function DiaryPage() {
    const [showModal, setShowModal] = useState(null);
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);

    const tripId = '804bc100-8ba5-4f0b-9d8f-5175416c7f74';

    const { diaryEntries, fetchDiaryEntriesByUser, saveDiaryEntry } = useTripData();

    // 1. Fetch the data when the component loads
    useEffect(() => {
        fetchDiaryEntriesByUser(tripId);
    }, [tripId]);

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
            <h2 className="mb-4">My Diary</h2>

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
                                        {/* Note: date_created from DB */}
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

            <div className="d-flex justify-content-end mt-4">
                <Button
                    variant="outline-primary"
                    className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', fontSize: '24px' }}
                >
                    ✚
                </Button>
            </div>

            {/* Modal for adding Entry */}
            <Modal show={showModal !== null} onHide={handleClose} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Diary Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Caption</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="What happened on this trip?"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Photo</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Entry</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}