import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../utils/helper";

const PrivateRouter = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default PrivateRouter;
