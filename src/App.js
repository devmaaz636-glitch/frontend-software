import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { Toaster } from "react-hot-toast";
const App = () => {
  const routing = useRoutes(Themeroutes);
  // console.log("test deployment");
  return (
    <div className="dark">
      {routing}
      <Toaster position="top-center" reverseOrder={false} />
      <link href="./output.css" rel="stylesheet"></link>
    </div>
  );
};

export default App;
