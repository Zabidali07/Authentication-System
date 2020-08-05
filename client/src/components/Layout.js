import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../utils/helper";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) return { color: "#0000" };
    else return { color: "#ffff" };
  };

  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="nav-link" style={isActive("/")}>
          Home
        </Link>
      </li>

      {!isAuth() && (
        <div>
          <li className="nav-item">
            <Link to="/signin" className="nav-link" style={isActive("/signin")}>
              Signin
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link" style={isActive("/signup")}>
              Signup
            </Link>
          </li>
        </div>
      )}
      {isAuth() && (
        <div>
          <li className="nav-item">
            <Link
              to="/dashboard"
              className="nav-link"
              style={isActive("/dashboard")}
            >
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() => {
                signout(() => history.push("/"));
              }}
            >
              Signout
            </span>
          </li>
        </div>
      )}
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
