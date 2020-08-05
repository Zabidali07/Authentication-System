import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import jwt from "jsonwebtoken";
import Layout from "./Layout";

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  useEffect(() => {
    let token = match.params.token;

    if (token) {
      let { name } = jwt.decode(token);
      setValues((v) => ({ ...v, name, token }));
    }
  }, [match.params.token]);

  const { name, token } = values;

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/account-activation", { token })
      .then((response) => {
        console.log("ACCOUNT ACTIVATED", response);
        setValues({ ...values, show: false });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("ACCOUNT ACTIVATION ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => (
    <div className="text-center">
      <h1 className="p-5"> Hey {name} ready to activate your account </h1>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Activate Button
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {activationLink()}
      </div>
    </Layout>
  );
};

export default Activate;
