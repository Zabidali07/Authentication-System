import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Layout from "./Layout";

const Signup = () => {
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { name, email, password, buttonText } = formInputs;

  const handleChange = (event) => {
    setFormInputs({
      ...formInputs,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormInputs({
      ...formInputs,
      buttonText: "Submitting",
    });

    axios
      .post("/signup", {
        name,
        email,
        password,
      })
      .then((res) => {
        console.log("SIGNED UP SUCCESS !!" + res);

        setFormInputs({
          name: "",
          email: "",
          password: "",
          buttonText: "Submit",
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        if (err && err.response && err.response.data)
          toast.error(err.response.data.error);

        setFormInputs({
          ...formInputs,
          buttonText: "Submit",
        });
      });
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted"> Name </label>
        <input
          name="name"
          value={name}
          type="text"
          onChange={handleChange}
          className="form-control"
        />
      </div>

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
        <h1 className="p-5 text-centre">Signup</h1>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
