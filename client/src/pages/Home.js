import React from "react";
import RegisterModal from "../components/Modal/RegisterModal";

const Home = () => {
  function registerClick() {
    // prompt model for sign up
    console.log("register button works");
  }

  return (
    <div>
      <div className="container mt-5 clearfix">
        <div className="row">
          <div className="col-12 text-center px-5">
            <h1 className="display-4">
              Welcome to <em>Splitsy</em>
            </h1>
            <p className="lead my-3">
              Splity is a web app that allows a user to easily divide up a
              recipt by simply uploading an image. <br />
              Why waste time trying to do complicated math, let us do the work
              for you!
            </p>
            <div>
              <div>Insert Gif</div>
              <RegisterModal buttonLabel="Register Now!" className="Register">
                Register Now!
              </RegisterModal>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabIndex="-1" role="dialog" id="loginModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register or Login</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="alert alert-danger" role="alert">
                  This is what an error message looks like.
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-light mr-2">Login</button>
              <button className="btn btn-primary bg-orange border-orange">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
