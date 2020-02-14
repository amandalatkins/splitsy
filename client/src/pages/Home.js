import React, { useReducer, useRef, useEffect } from "react";

const Home = () => {
  return (
    <div>
      <div className="container mt-5 clearfix">
        <div className="row">
          <div className="col-12 text-center px-5">
            <h1 className="display-4">
              Welcome to <em>Splitsy</em>
            </h1>
            <p className="lead my-3">
              Splity does this and this and this. Nullam nulla eros, ultricies
              sit amet, nonummy id, imperdiet feugiat, pede. <br />
              Nullam nulla eros, ultricies sit amet, nonummy id.
            </p>
            <p>
              <div style="background-color: #777; width: 100%; height: 500px; display:inline-block"></div>
              <button
                className="btn btn-lg btn-success my-3  bg-orange border-orange"
                data-toggle="modal"
                data-target="#loginModal"
              >
                Register Now!
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="modal" tabindex="-1" role="dialog" id="loginModal">
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
