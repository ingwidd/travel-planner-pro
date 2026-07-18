import { useContext, useEffect, useState } from 'react';
import { Button, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useTripData } from '../contexts/TripDataContext';
import { AuthContext } from '../components/AuthProvider';

function formatDate(isoDate) {
    if (!isoDate) return "Pending";
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "Invalid Date";

    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
        d.getFullYear()
    ).slice(2)}`;
}

function daysLeft(isoStartDate) {
    const start = new Date(isoStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

// Added onEdit prop to handle card clicks
function TripCard({ trip, onEdit }) {
    const remaining = daysLeft(trip.start_date);
    const isUpcoming = remaining > 0;
    const accent = isUpcoming ? "primary" : "secondary";

    return (
        <div className={`card border-${accent} mb-3 shadow-sm`}>
            <div className="card-body d-flex justify-content-between align-items-center">
                {/* Clickable area for editing */}
                <div 
                    onClick={() => onEdit(trip)} 
                    style={{ cursor: 'pointer', flex: 1 }}
                    title="Click to edit or delete"
                >
                    <div className={`text-${accent}`}>
                        <h5 className={`card-title mb-1 ${isUpcoming ? "fw-bold" : ""}`}>
                            {trip.name} <i className="bi bi-pencil-square ms-1 small opacity-50"></i>
                        </h5>
                        <p className="mb-1 text-dark">{trip.destination}</p>
                        <p className="mb-1 small text-muted">
                            {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                        </p>
                        <p className="mb-0 fw-bold small">
                            {remaining > 0 ? `${remaining} days left` : "Trip completed"}
                        </p>
                    </div>
                </div>

                <div className="d-flex gap-2 ms-3">
                    <Link
                        to={`/diary?tripId=${trip.id}`}
                        className={`btn btn-outline-${accent} btn-sm`}
                        aria-label="View diary"
                    >
                        <i className="bi bi-journal-bookmark-fill"></i>
                    </Link>
                    <Link
                        to={`/todo?tripId=${trip.id}`}
                        className={`btn btn-outline-${accent} btn-sm`}
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
    const { currentUser } = useContext(AuthContext);
    const userId = currentUser?.uid;

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [formData, setFormData] = useState({ name: '', destination: '', startDate: '', endDate: '' });
    
    // NEW: Filter State
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (userId) {
            fetchTrips(userId);
        }
    }, [userId]);

    // NEW: Filtering Logic
    const filteredTrips = trips.filter(trip => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tripEndDate = new Date(trip.end_date);

        if (filter === 'upcoming') {
            return tripEndDate >= today;
        }
        if (filter === 'past') {
            return tripEndDate < today;
        }
        return true;
    });

    const handleOpenEdit = (trip) => {
        setEditingTrip(trip);
        setFormData({
            name: trip.name,
            destination: trip.destination,
            startDate: trip.start_date.split('T')[0],
            endDate: trip.end_date.split('T')[0]
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingTrip) {
                await updateTrip(editingTrip.id, formData);
            } else {
                await saveTrip({ userId, ...formData });
            }
            closeModals();
            fetchTrips(userId);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure? This will delete all diary entries and todos for this trip.")) {
            try {
                await deleteTrip(editingTrip.id);
                closeModals();
                fetchTrips(userId);
            } catch (error) { alert(error.message); }
        }
    };

    const closeModals = () => {
        setShowAddModal(false);
        setEditingTrip(null);
        setFormData({ name: '', destination: '', startDate: '', endDate: '' });
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    
                    {/* Header with Title and Filter */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">Trips</h1>
                        <Form.Select 
                            size="sm" 
                            style={{ width: '130px' }}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Trips</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </Form.Select>
                    </div>

                    {tripsLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                            <TripCard 
                                key={trip.id} 
                                trip={trip} 
                                onEdit={handleOpenEdit} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-5 border rounded bg-light">
                            <p className="text-muted">No {filter !== 'all' ? filter : ''} trips found. Start by adding one!</p>
                        </div>
                    )}

                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            onClick={() => setShowAddModal(true)}
                            variant="outline-primary"
                            className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px', fontSize: '24px', zIndex: 1000 }}
                        >
                            ✚
                        </Button>
                    </div>

                    {/* Shared Modal for Add and Edit */}
                    <Modal show={showAddModal || editingTrip !== null} onHide={closeModals} centered>
                        <Form onSubmit={handleSave}>
                            <Modal.Header closeButton>
                                <Modal.Title>{editingTrip ? 'Edit Trip' : 'New Adventure'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Trip Name</Form.Label>
                                    <Form.Control 
                                        type='text' 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                        required 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Destination</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.destination} 
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })} 
                                        required 
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control 
                                                type="date" 
                                                value={formData.startDate} 
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control 
                                                type="date" 
                                                value={formData.endDate} 
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
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