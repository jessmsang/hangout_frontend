import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../../contexts/UserContext";

function ProtectedRoute({ children, anonymous = false }) {
  const location = useLocation();
  const from = location.state?.from || "/";
  const { isLoggedIn, isAuthenticating } = useContext(UserContext);

  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  if (!isLoggedIn && !isAuthenticating) {
    return <Navigate to="/" state={{ from: location, openLoginModal: true }} />;
  }

  return children;
}

export default ProtectedRoute;
