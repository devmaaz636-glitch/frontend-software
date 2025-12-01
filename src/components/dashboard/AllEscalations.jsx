import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getescalationsratingsApi } from "../../features/userApis";
import Chart from "react-apexcharts";
import { EscalationsContext } from "../../context/EscalationsContext";

const AllEscalations = () => {
  const { filteredEscalations, setFilteredEscalations } =
    useContext(EscalationsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { filter = "" } = useParams();

  const filterEscalations = useCallback(
    (escalations, normalizedFilter) => {
      if (normalizedFilter) {
        const filtered = escalations.filter(
          (escalation) =>
            escalation.userrating &&
            escalation.userrating.toLowerCase() === normalizedFilter
        );
        setFilteredEscalations(filtered);
      } else {
        setFilteredEscalations(escalations);
      }
    },
    [setFilteredEscalations]
  );

  const fetchAllEscalations = useCallback(async () => {
    try {
      setIsLoading(true);
      const normalizedFilter = filter.toLowerCase();
      const response = await getescalationsratingsApi(normalizedFilter);

      if (response && response.data && response.data.escalations) {
        filterEscalations(response.data.escalations, normalizedFilter);
      } else {
        setError("No escalations found");
      }
    } catch (error) {
      console.error("Error fetching escalations:", error);
      setError("Error fetching escalations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [filter, filterEscalations]);

  useEffect(() => {
    fetchAllEscalations();
  }, [fetchAllEscalations]);

  const prepareChartData = (escalations) => {
    const ratings = { bad: 0, average: 0, good: 0 };

    escalations.forEach((escalation) => {
      const rating = escalation.userrating?.toLowerCase();
      if (ratings[rating] !== undefined) {
        ratings[rating] += 1;
      }
    });

    const total = ratings.bad + ratings.average + ratings.good;

    return {
      series: [
        {
          name: "Escalations",
          data: [ratings.bad, ratings.average, ratings.good],
        },
      ],
      xaxis: { categories: ["Bad", "Average", "Good"] },
      percentages: {
        bad: total ? ((ratings.bad / total) * 100).toFixed(2) : 0,
        average: total ? ((ratings.average / total) * 100).toFixed(2) : 0,
        good: total ? ((ratings.good / total) * 100).toFixed(2) : 0,
      },
    };
  };

  const handleBarClick = (rating) => {
    navigate(`/bi/escalations/details?filter=${rating}`, {
      state: { filteredEscalations },
    });
  };

  const chartData = prepareChartData(filteredEscalations);
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const rating =
            chartData.xaxis.categories[config.dataPointIndex].toLowerCase();
          handleBarClick(rating);
        },
      },
    },
    colors: ["#C9190B", "#F0AB00", "#23511E"],
    xaxis: { categories: chartData.xaxis.categories },
    yaxis: { title: { text: "Number of Escalations" } },
    plotOptions: { bar: { distributed: true } },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value, { seriesIndex, dataPointIndex, w }) {
          const category =
            chartData.xaxis.categories[dataPointIndex].toLowerCase();

          const percentage = chartData.percentages[category];
          return `${value} (${percentage}%)`;
        },
      },
    },
  };

  return (
    <div>
      <h1>
        Escalations Rating -{" "}
        {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "All"}
      </h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : filteredEscalations.length === 0 ? (
        <p>No escalations found</p>
      ) : (
        <>
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="bar"
            height={300}
          />
        </>
      )}
    </div>
  );
};

export default AllEscalations;
