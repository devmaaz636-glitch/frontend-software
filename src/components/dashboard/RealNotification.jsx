import moment from "moment";
import React, { useState, useMemo } from "react";
import { Card, CardTitle, Button } from "reactstrap";
import Spinner from 'react-bootstrap/Spinner';

const RealNotification = ({ notifications, limit = 5 }) => {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const formattedTime = useMemo(() => {
    return (item) => moment(item.lastActive).format("MMMM Do YYYY, h:mm a");
  }, []);

  const handleShowMore = () => {
    setIsLoading(true);
    // Simulate loading delay (replace with actual API call if needed)
    setTimeout(() => {
      setShowAll(!showAll);
      setIsLoading(false);
    }, 500);
  };

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, limit);

  return (
    <>
      {notifications.length > 0 ? (
        <Card
          style={{
            maxHeight: "35vh",
            overflowY: "auto",
          }}
          className="rounded-4 scrollable-container border shadow-sm"
        >
          <CardTitle style={{
            fontSize:"25px"
          }} className="p-3 text-2xl ">
            User Activity Log
          </CardTitle>
          <ul className="list-group list-group-flush">
            {displayedNotifications.map((item) => (
              <li
                key={item.id || item.userName + item.lastActive}
                className="list-group-item"
              >
                <div className="fw-bold text-capitalize">
                  {item.userName} {item.description}
                </div>
                <div className="text-sm">{formattedTime(item)}</div>
              </li>
            ))}
          </ul>
          {notifications.length > limit && (
            <div className="text-center p-2">
              {isLoading ? (
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Button color="primary" size="sm" onClick={handleShowMore}>
                  {showAll ? "See Less" : "See More"}
                </Button>
              )}
            </div>
          )}
        </Card>
      ) : null}
    </>
  );
};

export default RealNotification;
