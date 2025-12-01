import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Card, CardTitle, CardImg, CardSubtitle, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { fetchallUsers, leaddelete } from "../../features/userApis";
import { MdDelete, MdRefresh } from "react-icons/md";
import { BallTriangle } from "react-loader-spinner";

const ProjectTables = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [deletedUserIDs, setDeletedUserIDs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("bicuserData"));
  const CACHE_KEY = "USERdETAILcACHE";
  const CACHE_EXPIRY_KEY = "userDetailsCacheExpiry";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const getallUsers = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);
      try {
        // Check cache first if not forcing refresh
        if (!forceRefresh) {
          const cachedData = localStorage.getItem(CACHE_KEY);
          const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);

          if (
            cachedData &&
            cacheExpiry &&
            new Date().getTime() < Number(cacheExpiry)
          ) {
            const parsedData = JSON.parse(cachedData);
            setUserDetails(
              parsedData.filter((user) => !deletedUserIDs.includes(user.id))
            );
            setLastUpdated(new Date(Number(cacheExpiry) - CACHE_DURATION));
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data
        const users = await fetchallUsers();
        const filteredUsers = users.filter(
          (user) => !deletedUserIDs.includes(user.id)
        );
        setUserDetails(filteredUsers);
        setLastUpdated(new Date());

        // Update cache
        const expiryTime = new Date().getTime() + CACHE_DURATION;
        localStorage.setItem(CACHE_KEY, JSON.stringify(users));
        localStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString());
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [deletedUserIDs, CACHE_DURATION] // Fixed: Added CACHE_DURATION to deps
  );

  const handleRefresh = () => {
    getallUsers(true); // Force refresh
  };

  // Load deletedUserIDs once
useEffect(() => {
  const storedDeletedIDs = localStorage.getItem("deletedUserIDs");
  if (storedDeletedIDs) {
    setDeletedUserIDs(JSON.parse(storedDeletedIDs));
  }
}, []); // <-- only runs once on mount

// Load user data after deletedUserIDs is set
useEffect(() => {
  if (deletedUserIDs.length >= 0) {
    getallUsers();
  }
}, [getallUsers, deletedUserIDs]);

  

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      try {
        const { data } = await leaddelete(id);
        if (data.success) {
          const updatedDeletedIDs = [...deletedUserIDs, id];
          setDeletedUserIDs(updatedDeletedIDs);
          localStorage.setItem(
            "deletedUserIDs",
            JSON.stringify(updatedDeletedIDs)
          );

          // Also remove from cache
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            const updatedCache = parsedData.filter((user) => user.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
          }

          // Update UI
          setUserDetails((prev) => prev.filter((user) => user.id !== id));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Memoize filtered users for performance
  const filteredUsers = useMemo(
    () =>
      userDetails.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [userDetails, searchTerm]
  );

  return (
    <Card
      style={{ maxHeight: "85vh", overflowY: "auto" }}
      className="rounded-4 scrollable-container"
    >
      <div className="d-flex justify-content-between align-items-center p-3">
        <div>
          <p style={{ fontSize: "25px" }} className="mb-0">
            Agent Listing
          </p>

          {lastUpdated && (
            <small className="text-muted">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </small>
          )}
        </div>
        <Button
          color="success"
          onClick={handleRefresh}
          disabled={isLoading}
          className="d-flex align-items-center gap-2"
        >
          <MdRefresh size={20} />
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>
      <div className="p-3">
        <input
          className="form-control me-2 p-2"
          type="search"
          placeholder="Search Agent Name..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading && (
        <div className="d-flex justify-content-center">
          <BallTriangle
            height={80}
            width={80}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            className="mx-auto"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-center">Agent List Loading...</p>
      ) : (
        filteredUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-3 border d-flex mx-auto justify-content-between align-items-center projectTable"
            style={{
              width: "30rem",
              backgroundColor: "#F9FAFE",
              marginBottom: "20px",
              cursor: "pointer",
            }}
          >
            <div className="d-flex p-1 align-items-center">
              <div className="d-flex gap-4 align-items-center">
                <CardImg
                  className="img-fluid rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                  onClick={() =>
                    navigate(`/bi/userdetails/${user.id}/${user.name}`)
                  }
                  src="https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
                  alt={user.name}
                />
                <div>
                  <CardTitle
                    className="text-capitalize h5"
                    onClick={() =>
                      navigate(`/bi/userdetails/${user.id}/${user.name}`)
                    }
                  >
                    {user.name}
                  </CardTitle>
                  <CardSubtitle className="mb-2 text-muted">
                    Numbers of Forms: {user.evaluationRating?.length || 0}
                  </CardSubtitle>
                </div>
              </div>
            </div>
            {currentUser?.role === "admin" && (
              <MdDelete
                size={30}
                color="red"
                onClick={() => handleDeleteUser(user.id)}
              />
            )}
          </div>
        ))
      )}
    </Card>
  );
};

export default ProjectTables;