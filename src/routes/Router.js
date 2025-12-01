import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../Auth.js";
import MarketingForm from "../layouts/MarketingForm.jsx";
import EditEvaluation from "../components/dashboard/EditEvaluation.jsx";
import EditEscalations from "../components/dashboard/EditEscalations.jsx";

const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const Login = lazy(() => import("../layouts/Login.js"));
const AgentProfile = lazy(() => import("../layouts/AgentProfile.jsx"));
const AgentForm = lazy(() => import("../layouts/AgentForm.jsx"));
const EscalationForm = lazy(() => import("../layouts/EscalationForm.jsx"));
const UserDetails = lazy(() => import("../layouts/UserDetails.jsx"));
const AgentReport = lazy(() => import("../layouts/AgentReport.jsx"));
const ViewUserAllData = lazy(() => import("../layouts/ViewUserAllData.jsx"));
const AllEscalations = lazy(() =>
  import("../components/dashboard/AllEscalations.jsx")
);
const EscalationDetails = lazy(() =>
  import("../components/dashboard/EscalationDetails.jsx")
);

const ThemeRoutes = [
  {
    path: "/bi",
    element: <FullLayout />,
    children: [
      {
        path: "/bi/profile",
        exact: true,
        errorElement: <div>Something went wrong!</div>,
        element: (
          <Auth>
            <AgentProfile />
          </Auth>
        ),
      },
      {
        path: "/bi/agentform",
        exact: true,
        errorElement: <div>Something went wrong!</div>,
        element: (
          <Auth>
            <AgentForm />
          </Auth>
        ),
      },
      {
        path: "/bi/ppcform",
        exact: true,
        errorElement: <div>Something went wrong!</div>,
        element: (
          <Auth>
            <MarketingForm/>
            
          </Auth>
        ),
      },
      {
        path: "/bi/escalationform",
        exact: true,
        errorElement: <div>Something went wrong!</div>,
        element: (
          <Auth>
            <EscalationForm />
          </Auth>
        ),
      },
      {
        path: "/bi/userdetails/:id/:name",
        exact: true,
        errorElement: <div>Something went wrong!</div>,
        element: (
          <Auth>
            <UserDetails />
          </Auth>
        ),
      },
      {
        path: "/bi/agentReport/:name",
        exact: true,
        errorElement: <div>Something went wrong!</div>,
        element: (
          <Auth>
            <AgentReport />
          </Auth>
        ),
      },
      {
        path: "/bi/data/:id/:name",
        exact: true,
        errorElement: <div>Something went wrong!</div>,
        element: (
          <Auth>
            <ViewUserAllData />
          </Auth>
        ),
      },
      {
        path: "/bi/escalations",
        element: <AllEscalations />,
      },
      {
        path: "/bi/escalations/details",
        element: <EscalationDetails />,
      },
      {
        path: "/bi/edit-evaluation/:id",
        element: <EditEvaluation />
      },
      {
        path: "/bi/edit-escalations/:id",
        element: <EditEscalations />
      }
    ],
  },
  {
    path: "/",
    element: <Login />,
    children: [
      { path: "/", exact: true, element: <Navigate to="/login" /> },
      { path: "/login", exact: true, element: <Login /> },
    ],
  },
];

export default ThemeRoutes;