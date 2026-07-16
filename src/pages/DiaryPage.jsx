import { Container, Card, Modal, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useTripData } from "../contexts/TripDataContext";

export default function DiaryPage() {
    const [showModal, setShowModal] = useState(null);
    const [caption, setCaption] = useState('');
    const { diaryEntries, saveDiaryEntry } = useTripData();
    const [file, setFile] = useState(null);

    const handleClose = () => setShowModal(null);
    const handleAdd = () => setShowModal('Add');

    const handleSave = async (e) => {
        e.preventDefault();
        saveDiaryEntry(caption, file);
        handleClose();
        setCaption('');
        setFile(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <Container>
        <div className="mb-4 my-4">
            <h2>My Diary</h2>

            <Container>
                <div className="row" style={{ margin: "0 5px" }}>
                    {diaryEntries && diaryEntries.length > 0 ? (diaryEntries.map((entry) => (
                        <div key={entry.id} className="col-md-4 mb-3">
                            <Card className="h-100 shadow-sm">
                                {entry.photoUrl && (
                                    <Card.Img
                                        variant='top'
                                        src={entry.photoUrl}
                                        style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Text>{entry.caption}</Card.Text>
                                    <small className="text-muted">
                                        {new Date(entry.createdAt).toLocaleDateString()}
                                    </small>
                                </Card.Body>
                                <Card.Footer className="bg-white">
                                    <Button 
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No diary entries yet.</p>
                )}
                </div>

                <Button 
                    variant="outline-secondary"
                    onClick={handleAdd}
                    className="position-fixed bottom-0 end-0 m-4 z-3 rounded-circle shadow-lg"
                    style={{ width: '55px', height: '55px', padding: '0' }}
                >
                    ✚
                </Button>
            </Container>
        </div>

        <Modal show={showModal !== null} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Diary Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSave}>
                    <Form.Group className="mb-3">
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Add a caption..."
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="cardImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit">Save</Button>
            </Modal.Footer>
        </Modal>
        </Container>
    );
}
