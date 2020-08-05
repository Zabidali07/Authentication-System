import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import jwt from "jsonwebtoken";
import Layout from "./Layout";

const Reset = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    token: "",
    buttonText: "Submit",
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setValues((v) => ({ ...v, name, token }));
    }
  }, [match.params.token]);

  const { name, newPassword, token, buttonText } = values;

  const handleChange = (event) => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });

    axios
      .post("/reset-password", {
        newPassword,
        resetPasswordLink: token,
      })
      .then((response) => {
        console.log("RESET PASSWORD SUCCESS", response);
        toast.message(response.data.message);
        setValues({ ...values, buttonText: "Done" });
      })
      .catch((error) => {
        console.log("RESET PASSWORD ERROR", error);
        toast.error(error);
        setValues({ ...values, buttonText: "Reset Password" });
      });
  };

  const passwordResetForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">New Password</label>
        <input
          type="password"
          placeholder="Type new password"
          value={newPassword}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1> Hey {name} Type the new password </h1>
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default Reset;
