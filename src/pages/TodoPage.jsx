import { useState, useEffect } from "react";
import { Container, Button, Modal, Form, Table, Spinner } from "react-bootstrap";
import { useTripData } from "../contexts/TripDataContext";
import { useSearchParams } from "react-router-dom";

export default function TodoPage() {
    const [searchParams] = useSearchParams();
    const tripId = searchParams.get("tripId");

    const [showModal, setShowModal] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    const { todos, fetchTodosByUser, saveTodo, updateTodo, deleteTodo, todosLoading } = useTripData();
    const [editingId, setEditingId] = useState(null);
    
    // Status Filter State
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchTodosByUser(tripId);
    }, [tripId]);

    const handleClose = () => {
        setShowModal(null);
        setTaskDescription('');
        setIsCompleted(false);
        setEditingId(null);
    };

    const handleShowEdit = (todo) => {
        setEditingId(todo.id);
        setTaskDescription(todo.task_description);
        setIsCompleted(todo.is_completed);
        setShowModal('Edit');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateTodo(editingId, {
                    task_description: taskDescription,
                    is_completed: isCompleted
                });
            } else {
                await saveTodo({
                    tripId,
                    task_description: taskDescription,
                    is_completed: isCompleted
                });
            }
            handleClose();
            fetchTodosByUser(tripId);
        } catch (error) { alert(error.message); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this task?")) {
            await deleteTodo(id);
            fetchTodosByUser(tripId);
        }
    };

    // Filter Logic
    const filteredTodos = todos ? todos.filter((todo) => {
        if (statusFilter === 'Pending') return !todo.is_completed;
        if (statusFilter === 'Done') return todo.is_completed;
        return true; // 'All'
    }) : [];

    return (
        <Container className="py-4">
            {/* Header with Title and Filter Dropdown */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">{tripId ? "Trip Tasks" : "All Tasks"}</h2>
                
                <Form.Select 
                    style={{ width: '150px' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Tasks</option>
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                </Form.Select>
            </div>

            {todosLoading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Table hover responsive className="mt-4 shadow-sm bg-white rounded">
                    <thead>
                        <tr>
                            <th>Task Description</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTodos && filteredTodos.length > 0 ? (
                            filteredTodos.map((todo) => (
                                <tr key={todo.id} onClick={() => handleShowEdit(todo)} style={{ cursor: 'pointer' }}>
                                    <td className={todo.is_completed ? 'text-decoration-line-through text-muted' : ''}>
                                        {todo.task_description}
                                    </td>
                                    <td>
                                        <span className={`badge ${todo.is_completed ? 'bg-success' : 'bg-secondary'}`}>
                                            {todo.is_completed ? 'Done' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <Button
                                            variant="link"
                                            className="text-danger p-0 ms-2"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(todo.id); }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-muted py-4">
                                    {statusFilter === 'All' 
                                        ? 'No tasks found.' 
                                        : `No ${statusFilter.toLowerCase()} tasks found.`}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {tripId && (
                <Button
                    onClick={() => setShowModal('Add')}
                    variant="primary"
                    className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', fontSize: '24px', zIndex: 1050 }}
                >
                    ✚
                </Button>
            )}

            <Modal show={showModal !== null} onHide={handleClose} centered>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit Task" : "New Task"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>What needs to be done?</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Mark as completed"
                            checked={isCompleted}
                            onChange={(e) => setIsCompleted(e.target.checked)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Task</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}