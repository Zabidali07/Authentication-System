import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuth } from "../utils/helper";

const PublicRoute = ({ component: Component, restricted, ...res }) => {
  return (
    <Route
      {...res}
      render={(props) =>
        isAuth() && restricted ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
