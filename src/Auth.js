import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
const cookie = new Cookies();

const Auth = ({ children }) => {
  const nav = useNavigate();
  let token = cookie.get("bictoken");
  if (token) {
    return token ? children : nav("/");
  }
  return nav("/");
};

export default Auth;
