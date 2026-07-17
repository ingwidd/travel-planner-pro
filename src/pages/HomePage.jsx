import { Col, Button, Spinner, Row, Card, Form, Pagination } from "react-bootstrap";
import CurrencyConverter from '../components/CurrencyConverter';
import dasboardPhoto from '../assets/dashboard_photo.png';
import { useState } from "react";

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const BASE_URL = "http://localhost:3000";

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (query.length < 3) return;

    setLoading(true);
    setError(null);
    setActivities([]);
    setCurrentPage(1);

    try {
      // 1. Get Coordinates for the city name
      const locRes = await fetch(`${BASE_URL}/locations?keyword=${query}`);
      const locData = await locRes.json();

      if (!locRes.ok || !locData.data || locData.data.length === 0) {
        throw new Error("Destination not found.");
      }

      const { latitude, longitude } = locData.data[0].geoCode;
      console.log("Found coordinates:", latitude, longitude);

      // 2. Get Activities using those coordinates
      const actRes = await fetch(`${BASE_URL}/activities?latitude=${latitude}&longitude=${longitude}`);
      const actData = await actRes.json();

      if (!actRes.ok) throw new Error("Could not find activities for this area.");

      setActivities(actData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll back up to results
  };

  return (
    <div>
      <div
        className="text-center text-white d-flex flex-column justify-content-center align-items-center mb-2"
        style={{
          backgroundImage: `url(${dasboardPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '320px'
        }}
      >
      </div>

      <div className="container-fluid">
        <div className="row g-4">
          {/* Left column — flight search, 70% width */}
          <div className="col-12 col-lg-8" style={{ flex: '7 1 0%' }}>
            <br />
            <div className="p-4 rounded-3 h-100 bg-white shadow-sm border">
              <Form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    width: '88%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    marginBottom: '15px'
                  }}
                />
                <Button variant="primary" type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
                  {loading ? <Spinner size="sm" /> : <i className="bi bi-search"></i>} Search
                </Button>
              </Form>

              {error && <p className="text-danger">{error}</p>}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Recommended Activities</h4>
                {activities.length > 0 && (
                  <small className="text-muted">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, activities.length)} of {activities.length}
                  </small>
                )}
              </div>

              <Row>
                {currentItems.length > 0 ? (
                  currentItems.map((act) => (
                    <Col md={6} key={act.id} className="mb-4">
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="fs-6 mb-0">{act.name}</Card.Title>
                            <span className="badge bg-light text-dark border ms-2" style={{ fontSize: '10px' }}>{act.category}</span>
                          </div>
                          <Card.Text className="text-muted small flex-grow-1">
                            Local attraction near your destination. Explore history, culture, and architecture.
                          </Card.Text>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mt-3 w-100"
                            href={act.website || `https://www.google.com/search?q=${encodeURIComponent(act.name)}`}
                            target="_blank"
                          >
                            Learn More
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  !loading && <p className="text-muted text-center py-5">Enter a city to discover activities.</p>
                )}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <Pagination className="mb-0 shadow-sm">
                    {/* Left Arrow - Disabled on Page 1 */}
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3"
                    />

                    {/* Optional: Add a small page indicator between arrows for better UX */}
                    <div className="px-4 text-muted small fw-bold">
                      {currentPage} / {totalPages}
                    </div>

                    {/* Right Arrow - Disabled on Last Page */}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3"
                    />
                  </Pagination>
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-4" style={{ flex: '3 1 0%' }}>
            <div className="p-4 rounded-3 h-100" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}