import { Col, Row } from "reactstrap";
// import SalesChart from "../components/dashboard/SalesChart";
// import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";
import Models from "./ui/Model";

const Starter = () => {
  return (
    <div>
      <Row>
        <Col
          lg="12"
          className="d-flex justify-content-end align-item-center mb-2"
        >
          <Models />
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <ProjectTables />
        </Col>
      </Row>
    </div>
  );
};

export default Starter;
