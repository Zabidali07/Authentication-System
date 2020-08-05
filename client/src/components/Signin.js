import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { authenticate, isAuth } from "../utils/helper";
import Layout from "./Layout";

const Signin = ({ history }) => {
  const [formInputs, setFormInputs] = useState({
    password: "",
    email: "",
    buttonText: "Submit",
  });

  const { password, email, buttonText } = formInputs;

  const handleChange = (event) => {
    setFormInputs({
      ...formInputs,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormInputs({ ...formInputs, buttonText: "Submitting" });

    axios
      .post("/signin", {
        email,
        password,
      })
      .then((res) => {
        console.log("SIGNED UP SUCCESS " + res);

        authenticate(res, () => {
          setFormInputs({
            ...formInputs,
            password: "",
            email: "",
            buttonText: "Submitted",
          });

          isAuth() ? history.push("/dashboard") : history.push("/signin");
        });
      })
      .catch((err) => {
        console.log(err, "zabid");
        if (err && err.response && err.response.data)
          return toast.error(err.response.data.error);

        setFormInputs({ ...formInputs, buttonText: "Submit" });
      });
  };

  const signinForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          name="email"
          value={email}
          type="email"
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          name="password"
          value={password}
          type="password"
          onChange={handleChange}
          className="form-control"
        />
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Signin</h1>
        {signinForm()}
        <br />
        <Link
          to="/auth/password/forgot"
          className="btn btn-sm btn-outline-danger"
        >
          Forgot Password
        </Link>
      </div>
    </Layout>
  );
};

export default Signin;
