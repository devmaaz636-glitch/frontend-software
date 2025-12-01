import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import ReactAudioPlayer from "react-audio-player";
const AgentCalls = () => {
  return (
    <div className="p-3">
      <Card>
        <CardBody>
          <CardTitle tag={"h5"} className="fw-bold">
            Agent Calls
          </CardTitle>
          <div className="d-flex flex-column justify-content-center align-items-center gap-3 mt-3">
            <ReactAudioPlayer src="my_audio_file.ogg" autoPlay controls />
            <ReactAudioPlayer src="my_audio_file.ogg" autoPlay controls />
            <ReactAudioPlayer src="my_audio_file.ogg" autoPlay controls />
            <ReactAudioPlayer src="my_audio_file.ogg" autoPlay controls />
          </div>
        </CardBody>
      </Card>
      {/* <div class="d-grid gap-2 d-md-flex justify-content-md-end">
  <Button className="btn btn-outline-success me-md-2"onClick={Nav}> Evaluation</Button>
  <Button className="btn btn-outline-danger me-md-2"onClick={Escalation}> Escalation</Button>

</div> */}
    </div>
  );
};

export default AgentCalls;
