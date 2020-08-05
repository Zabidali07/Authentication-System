import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Layout from "./Layout";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [fileUpload, setFileUpload] = useState();

  //on handleUpload i mam just setting the state
  const handleUpload = useCallback((event) => {
    setFileUpload(event.target.files[0]);
  }, []);

  // on onupload i am uploading to databse.
  // if anything related to media i.e images, files..
  // we end up using FormData() , in post man also we
  //have specified form-data
  // inside form data  ia m appending image
  const onUpload = useCallback(() => {
    const data = new FormData();
    data.append("myImage", fileUpload);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("files/image-upload", data, config)
      .then((res) => {
        console.log("IMAGE UPLOAD SUCCESS", res);
      })
      .catch((err) => {
        if (err && err.response && err.response.data)
          toast.error(err.response.data.error);
      });
  });
  const makeApiCall = useCallback(() => {
    axios
      .get("users/list-users")
      .then((res) => {
        console.log("FETCH USER SUCCESS", res);

        setUsers(res.data.result);
      })
      .catch((err) => {
        if (err && err.response && err.response.data)
          toast.error(err.response.data.error);
      });
  }, []);

  useEffect(() => {
    makeApiCall();
  }, [makeApiCall]);

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        <ul>
          {!users.length ? (
            <li>No users have signed up</li>
          ) : (
            users.map((user) => <li key={user._id}> {user.name} </li>)
          )}
        </ul>
        <button className="btn btn-primary" onClick={makeApiCall}>
          Make API Call
        </button>
        <form>
          <input type="file" name="image" onChange={handleUpload} />
          <button onClick={onUpload}>Submit</button>
        </form>
      </div>
    </Layout>
  );
};
export default Dashboard;
