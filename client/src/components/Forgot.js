import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Layout from "./Layout";

const BTN_LABELS = "Request password reset link";
const Forgot = (history) => {
  const [formInputs, setFormInputs] = useState({
    email: "",
    buttonText: BTN_LABELS,
  });

  const { email, buttonText } = formInputs;

  const handleChanege = (event) => {
    setFormInputs({ ...formInputs, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormInputs({ ...formInputs, buttonText: "Submitting" });

    axios
      .post("/forgot-password", { email })
      .then((response) => {
        console.log("LINK SENT TO MAIL", response);
        toast.success(response.data.message);
        setFormInputs({
          ...formInputs,
          email: "",
          buttonText: BTN_LABELS,
        });
      })
      .catch((error) => {
        console.log("FORGOT PASSWORD ERROR", error.response.data);
        toast.error(error.response.data.error);

        setFormInputs({ ...formInputs, buttonText: BTN_LABELS });
      });
  };

  const passwordForgotForm = () => (
    <form>
      <div className="form-group ">
        <label className="text-muted">Email</label>
        <input
          name="email"
          value={email}
          type="email"
          onChange={handleChanege}
          className="form-control"
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {" "}
          {buttonText}{" "}
        </button>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Forgot Password</h1>
        {passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default Forgot;
