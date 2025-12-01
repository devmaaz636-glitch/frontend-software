import React, { useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate, useParams } from "react-router-dom";
import { fetchuserbyid } from "../features/userApis";
import { Button } from "reactstrap";


const SkeletonBox = ({ height = 200 }) => (
  <div style={{ background: "#e0e0e0", borderRadius: "8px", height, width: "100%" }} />
);

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const CACHE_KEY = `userDetails_${id}`;

  const getUser = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          setUserDetails(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }
      }

      const { data } = await fetchuserbyid(id);
      if (data.success) {
        setUserDetails(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } else {
        console.error("Error fetching user data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, CACHE_KEY]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const [graphOptions, setGraphOptions] = useState(null);
  const [userGraph, setUserGraph] = useState(null);

  useEffect(() => {
    if (userDetails?.user?.evaluationRating) {
      const setupCharts = () => {
        const ratings = userDetails.user.evaluationRating
          .map((r) => Number(r?.rating))
          .filter((r) => !isNaN(r));

        setGraphOptions({
          series: [{ name: "Ratings", data: ratings }],
          options: {
            chart: { height: 350, type: "line", zoom: { enabled: true } },
            dataLabels: { enabled: false },
            stroke: { curve: "straight" },
            title: { text: "Evaluated User Ratings", align: "left" },
            grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
            xaxis: {
              labels: { show: false },
              categories: userDetails.user.evaluationRating.map((_, i) => `Day ${i + 1}`),
            },
          },
        });

        setUserGraph({
          series: [
            Number(userDetails.counts?.good || 0),
            Number(userDetails.counts?.average || 0),
            Number(userDetails.counts?.bad || 0),
          ],
          options: {
            chart: { height: 350, type: "radialBar" },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: { fontSize: "22px" },
                  value: { fontSize: "16px" },
                  total: {
                    show: true,
                    label: "Total",
                    formatter: () => Number(userDetails.counts?.total || 0),
                  },
                },
              },
            },
            labels: ["Good", "Average", "Bad"],
          },
        });
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(setupCharts);
      } else {
        setTimeout(setupCharts, 100); // fallback
      }
    }
  }, [userDetails]);

  const handlerViewData = (name) => {
    navigate(`/bi/data/${id}/${name}`);
  };

  return (
    <div className="d-flex container flex-column gap-4" style={{ width: "100%" }}>
      {isLoading ? (
        <>
          <SkeletonBox height={60} />
          <SkeletonBox height={350} />
          <SkeletonBox height={350} />
        </>
      ) : (
        <>
          <div className="d-flex justify-content-center gap-3">
            <Button onClick={() => handlerViewData(userDetails?.user?.name)}>View All Data</Button>
            <Button color="primary" onClick={() => getUser(true)}>Refresh</Button>
          </div>

          {userGraph ? (
            <div className="rounded" style={{ backgroundColor: "#fff" }}>
              <ReactApexChart
                options={userGraph.options}
                series={userGraph.series}
                type="radialBar"
                height={350}
              />
            </div>
          ) : (
            <SkeletonBox height={350} />
          )}

          <div className="rounded p-3" style={{ backgroundColor: "#fff" }}>
            {graphOptions ? (
              <ReactApexChart
                options={graphOptions.options}
                series={graphOptions.series}
                type="area"
                height={350}
              />
            ) : (
              <SkeletonBox height={350} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
