import { ReactComponent as LogoDark } from "../assets/images/logos/bi3.svg";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigation = useNavigate()
  const homeNavigator = () => {
    navigation('/bi/profile')
  }
  return (
    <div onClick={() => homeNavigator()}>
      <LogoDark />
    </div>
  );
};

export default Logo;
