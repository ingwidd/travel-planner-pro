import { useContext, useEffect, useState } from 'react';
import { Button, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useTripData } from '../contexts/TripDataContext';
import { AuthContext } from '../components/AuthProvider';

function formatDate(isoDate) {
    if (!isoDate) return "Pending"; // Return a placeholder if date is missing
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "Invalid Date"; // Check if date is valid

    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
        d.getFullYear()
    ).slice(2)}`;
}

function daysLeft(isoStartDate) {
    const start = new Date(isoStartDate);
    const today = new Date();
    const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

function TripCard({ trip }) {
    const remaining = daysLeft(trip.start_date);
    const isUpcoming = remaining > 0;
    const accent = isUpcoming ? "primary" : "secondary";

    return (
        <div className={`card border-${accent} mb-3`}>
            <div className="card-body d-flex justify-content-between align-items-center">
                <div className={`text-${accent}`}>
                    <h5 className={`card-title mb-1 ${isUpcoming ? "fw-bold" : ""}`}>{trip.name}</h5>
                    <p className="mb-1">{trip.destination}</p>
                    <p className="mb-1">
                        {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                    </p>
                    <p className="mb-0 fw-bold">Days left: {remaining}</p>
                </div>

                <div className="d-flex gap-2">
                    <Link
                        to={`/diary?tripId=${trip.id}`}
                        className={`btn btn-outline-${accent}`}
                        aria-label="View diary"
                    >
                        <i className="bi bi-journal-bookmark-fill"></i>
                    </Link>
                    <Link
                        to={`/todo?tripId=${trip.id}`}
                        className={`btn btn-outline-${accent}`}
                        aria-label="View to-dos"
                    >
                        <i className="bi bi-list-check"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function TripsPage() {
    const { trips, fetchTrips, tripsLoading, saveTrip, updateTrip, deleteTrip } = useTripData();
    const [name, setName] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { currentUser } = useContext(AuthContext);
    const userId = currentUser?.uid;

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);

    const [formData, setFormData] = useState({ name: '', destination: '', startDate: '', endDate: '' });

    const [filter, setFilter] = useState('all');

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingTrip) {
                await updateTrip(editingTrip.id, formData);
            }
            else {
                await saveTrip({ userId, ...formData });
            }
            closeModals();
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        if (userId) {
            fetchTrips(userId);
        }
    }, [userId]);

    const handleOpenEdit = (trip) => {
        setEditingTrip(trip);
        setFormData({
            name: trip.name,
            destination: trip.destination,
            startDate: trip.start_date.split('T')[0],
            endDate: trip.end_date.split('T')[0]
        })
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure? This will delete all diary entries and todos for this trip.")) {
            try {
                await deleteTrip(editingTrip.id);
                closeModals();
            } catch (error) { alert(error.message); }
        }
    };

    const closeModals = () => {
        setShowAddModal(false);
        setEditingTrip(null);
        setFormData({ name: '', destination: '', startDate: '', endDate: '' });
    };

    const filteredTrips = trips.filter(trip => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tripEndDate = new Date(trip.end_date);

        if (filter === 'upcoming') {
            // Include trips that haven't ended yet
            return tripEndDate >= today;
        }
        if (filter === 'past') {
            // Include trips that are strictly in the past
            return tripEndDate < today;
        }
        return true; // 'all'
    });

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <h1 className="mb-4">Trips</h1>

                    {tripsLoading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                    ) : trips.map((trip) => (
                        <div key={trip.id} className={`card border-${daysLeft(trip.start_date) > 0 ? 'primary' : 'secondary'} mb-3 shadow-sm`}>
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5
                                        className="card-title mb-1 text-primary"
                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => handleOpenEdit(trip)}
                                    >
                                        {trip.name}
                                    </h5>
                                    <p className="mb-1">{trip.destination}</p>
                                    <p className="mb-0 small text-muted">{formatDate(trip.start_date)} — {formatDate(trip.end_date)}</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Link to={`/diary?tripId=${trip.id}`} className="btn btn-outline-primary btn-sm"><i className="bi bi-journal-bookmark-fill"></i></Link>
                                    <Link to={`/todo?tripId=${trip.id}`} className="btn btn-outline-primary btn-sm"><i className="bi bi-list-check"></i></Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            onClick={() => setShowAddModal(true)}
                            variant="outline-primary"
                            className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px', fontSize: '24px' }}
                        >
                            ✚
                        </Button>
                    </div>

                    <Modal show={showAddModal || editingTrip !== null} onHide={closeModals} centered>
                        <Form onSubmit={handleSave}>
                            <Modal.Header closeButton>
                                <Modal.Title>{editingTrip ? 'Edit Trip' : 'New Adventure'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Trip Name</Form.Label>
                                    <Form.Control type='text' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Destination</Form.Label>
                                    <Form.Control type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required />
                                </Form.Group>
                                <Row>
                                    <Col><Form.Label>Start</Form.Label><Form.Control type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required /></Col>
                                    <Col><Form.Label>End</Form.Label><Form.Control type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required /></Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer className="d-flex justify-content-between">
                                {editingTrip ? (
                                    <Button variant="danger" onClick={handleDelete}>Delete Trip</Button>
                                ) : <div />}
                                <div>
                                    <Button variant="secondary" onClick={closeModals} className="me-2">Cancel</Button>
                                    <Button variant="primary" type="submit">Save</Button>
                                </div>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
}