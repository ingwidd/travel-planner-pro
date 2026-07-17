import { useState } from "react";
import { Container, Button, Modal, Form, Table, ButtonGroup } from "react-bootstrap";
import { useTripData } from "../contexts/TripDataContext";

export default function TodoPage() {
    const [showModal, setShowModal] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const { todos, setTodos } = useTripData();
    const [editingId, setEditingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');

    const handleClose = () => {
        setShowModal(null);
        setTaskDescription('');
        setIsCompleted(false);
        setEditingId(null);
    };
    const handleAdd = () => setShowModal('Add');

    const handleEdit = (todo) => {
        setEditingId(todo.id);
        setTaskDescription(todo.description);
        setIsCompleted(todo.completed);
        setShowModal('Edit');
    };

    function addTodo(event) {
        event.preventDefault();

        const newTodo = {
            id: Date.now(),
            description: taskDescription,
            completed: isCompleted,
            createdAt: new Date().toISOString()
        };

        setTodos([...todos, newTodo]);

        setTaskDescription('');
        setIsCompleted(false);
        handleClose();
    }

    function editTodo(event) {
        event.preventDefault();
        const updatedTodos = todos.map(todo =>
            todo.id === editingId ? { ...todo, description: taskDescription, completed: isCompleted } : todo
        );
        setTodos(updatedTodos)
        handleClose();
    }

    function deleteTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    function getFilteredTodos() {
        let filtered = todos;

        // Filter by status
        if (statusFilter === 'Done') {
            filtered = filtered.filter(todo => todo.completed);
        } else if (statusFilter === 'Pending') {
            filtered = filtered.filter(todo => !todo.completed);
        }

        // Filter by date
        if (dateFilter !== 'All') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStart = today.toISOString();

            if (dateFilter === 'Today') {
                filtered = filtered.filter(todo => todo.createdAt >= todayStart);
            } else if (dateFilter === 'This Week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                filtered = filtered.filter(todo => new Date(todo.createdAt) >= weekAgo);
            } else if (dateFilter === 'This Month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                filtered = filtered.filter(todo => new Date(todo.createdAt) >= monthAgo);
            }
        }

        return filtered;
    }

    const filteredTodos = getFilteredTodos();

    return (
        <Container>
            <div className="mb-4 my-4">
                <h2>My ToDos</h2>

                {/* Filter Controls */}
                <div className="mb-3 mt-4">
                    <div className="mb-3">
                        <label className="fw-bold me-2">Status:</label>
                        <ButtonGroup>
                            <Button
                                variant={statusFilter === 'All' ? 'secondary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setStatusFilter('All')}
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'Pending' ? 'secondary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setStatusFilter('Pending')}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={statusFilter === 'Done' ? 'success' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setStatusFilter('Done')}
                            >
                                Done
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div>
                        <label className="fw-bold me-2">Date:</label>
                        <ButtonGroup>
                            <Button
                                variant={dateFilter === 'All' ? 'secondary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setDateFilter('All')}
                            >
                                All
                            </Button>
                            <Button
                                variant={dateFilter === 'Today' ? 'secondary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setDateFilter('Today')}
                            >
                                Today
                            </Button>
                            <Button
                                variant={dateFilter === 'This Week' ? 'secondary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setDateFilter('This Week')}
                            >
                                This Week
                            </Button>
                            <Button
                                variant={dateFilter === 'This Month' ? 'secondary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setDateFilter('This Month')}
                            >
                                This Month
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>

                {filteredTodos.length > 0 ? (
                    <Table hover responsive className="mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>Task</th>
                                <th style={{ width: '120px' }}>Status</th>
                                <th style={{ width: '100px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTodos.map((todo) => (
                                <tr
                                    key={todo.id}
                                    onClick={() => handleEdit(todo)}
                                    style={{ cursor: 'pointer' }}
                                    className={todo.completed ? 'table-success' : ''}
                                >
                                    <td>
                                        <span>
                                            {todo.description}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${todo.completed ? 'bg-success' : 'bg-secondary'}`}>
                                            {todo.completed ? 'Done' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteTodo(todo.id);
                                            }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p className="text-muted mt-3">
                        {todos.length === 0 ? 'No todos yet. Click the ✚ button to add one!' : 'No todos match your filters.'}
                    </p>
                )}
            </div>
            <div className="d-flex justify-content-end mt-4">
                <Button
                    variant="outline-primary"
                    className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', fontSize: '24px' }}
                >
                    ✚
                </Button>
            </div>
            <Modal show={showModal !== null} onHide={handleClose} centered>
                <Modal.Header closeButton className="bg-light-subtle">
                    <Modal.Title>
                        <h4 style={{ fontWeight: 'bold' }}>
                            {showModal === 'Edit' ? 'Edit Task' : "What's next?"}
                        </h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-secondary-subtle">
                    <Form
                        className="d-grid gap-2 px-5"
                        onSubmit={showModal === 'Edit' ? editTodo : addTodo}
                    >
                        <Form.Group className="mb-3" controlId="taskDescription">
                            <Form.Control
                                onChange={(e) => setTaskDescription(e.target.value)}
                                value={taskDescription}
                                as="textarea"
                                rows={2}
                                required
                            />
                        </Form.Group>
                        <Form.Check
                            type="checkbox"
                            id="isCompleted"
                            label="Mission accomplished 😉"
                            checked={isCompleted}
                            onChange={(e) => setIsCompleted(e.target.checked)}
                            className="mb-3"
                        />
                        <Button className="rounded-pill btn btn-ocean" type="submit">
                            {showModal === 'Edit' ? 'Update' : 'Submit'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
