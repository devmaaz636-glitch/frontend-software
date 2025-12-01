import React, { useState, useEffect } from "react";
import { Col, Row, Button, ButtonGroup } from "reactstrap";
import UserData from "./UserData";
import { Container } from "react-bootstrap";
import FilterCardEscalations from "./FilterCardEscalations";
import FilterCardEvaluations from "./FilterCardEvaluations";
import FilterCardMarketing from "./FilterCardMarketing";

const ViewUserAllData = () => {
  const [activeFilter, setActiveFilter] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const filters = [
    { id: 'evaluations', label: 'Evaluations Reports', component: <FilterCardEvaluations /> },
    { id: 'escalations', label: 'Escalations Reports', component: <FilterCardEscalations /> },
    { id: 'marketing', label: 'Marketing Reports', component: <FilterCardMarketing /> }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      <Row className="g-0 flex-grow-1">
        {/* Sidebar with new color scheme */}
        <Col 
          xl={2} 
          lg={3} 
          md={4} 
          className="p-3 sidebar-bg border-end h-100"
          style={{
            position: "sticky",
            top: 0,
            overflowY: "auto"
          }}
        >
          <div className="d-flex flex-column gap-3 h-100">
            <h5 className="sidebar-title mb-3">Generate Reports</h5>
            
            <ButtonGroup vertical className="mb-3 w-100">
              {filters.map(filter => (
                <Button
                  key={filter.id}
                  color=""
                  className={`text-start filter-button ${
                    activeFilter === filter.id ? 'filter-button-active' : ''
                  }`}
                  onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </ButtonGroup>
            
            {activeFilter && (
              <div className="filter-card-container flex-grow-1">
                {filters.find(f => f.id === activeFilter)?.component}
                <Button 
                  color="link" 
                  className="mt-2 close-button"
                  onClick={() => setActiveFilter(null)}
                >
                  Close Filter
                </Button>
              </div>
            )}
          </div>
        </Col>

        {/* Main Content Area */}
        <Col 
          xl={10} 
          lg={9} 
          md={8} 
          className="p-4 h-100 content-bg"
          style={{
            overflowY: "auto"
          }}
        >
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <UserData />
          )}
        </Col>
      </Row>

      {/* Add this to your CSS file or style tag */}
      <style jsx>{`
        .sidebar-bg {
          background-color: #2c3e50;
        }
        .sidebar-title {
          color: #ecf0f1;
          font-weight: 500;
        }
        .filter-button {
          background-color: #34495e;
          color:rgb(255, 255, 255);
          border: 1px solid #3d566e;
          transition: all 0.3s ease;
          margin-bottom: 5px;
        }
        .filter-button:hover {
          background-color: #3d566e;
          color: #ecf0f1;
        }
        .filter-button-active {
          background-color: #3498db;
          color: white;
          border-color: #2980b9;
        }
        .close-button {
          color: #e74c3c !important;
        }
        .close-button:hover {
          color: #c0392b !important;
          text-decoration: none;
        }
        .content-bg {
          background-color: #f5f7fa;
        }
      `}</style>
    </Container>
  );
};

export default ViewUserAllData;