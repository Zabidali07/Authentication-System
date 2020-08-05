import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import Activate from "../components/Activate";
import Dashboard from "../components/Dashboard";
import Home from "../components/Home";
import Reset from "../components/Reset";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import Forgot from "../components/Forgot";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute path="/" exact component={Home} />
        <PublicRoute restricted path="/signin" exact component={Signin} />
        <PublicRoute restricted path="/signup" exact component={Signup} />

        <PublicRoute
          restricted
          path="/auth/password/forgot"
          exact
          component={Forgot}
        />

        <PublicRoute
          restricted
          path="/auth/activate/:token"
          exact
          component={Activate}
        />

        <PublicRoute
          restricted
          path="/auth/password/reset/:token"
          exact
          component={Reset}
        />

        <PrivateRoute path="/dashboard" exact component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
