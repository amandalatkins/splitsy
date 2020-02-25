import React, { useState, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";
import { useUserAuthContext } from "../../utils/UserAuthState";

const LoginModal = props => {
  const { buttonLabel, className } = props;

  const [userAuth, setUserAuth] = useUserAuthContext();

  const [modal, setModal] = useState(false);

  const unInput = useRef();
  const pwInput = useRef();

  const login = () => {
    API.logInUser({
      user_name: unInput.current.value,
      password: pwInput.current.value
    })
      .then(results => {
        if (results.data) {
          console.log(results.data);
          setUserAuth({
            type: "logIn",
            user: {
              id: results.data.id,
              firstName: results.data.first_name,
              lastName: results.data.last_name,
              userName: results.data.user_name,
              date: Date.now()
            }
          });
          window.location.href = "/dashboard";
        }
      })
      .catch(err => console.log(err));
  };
  const toggle = () => {
    setModal(!modal);
  };

  return (
    <div>
      {buttonLabel === "Register" ? (
        <Button className="bg-orange border-orange text-white" onClick={toggle}>
          {buttonLabel}
        </Button>
      ) : (
        <Button className="bg-teal border-teal text-white" onClick={toggle}>
          {buttonLabel}
        </Button>
      )}
      <Modal isOpen={modal} toggle={toggle} className={buttonLabel}>
        <ModalHeader toggle={toggle}>{buttonLabel}</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label>Userame:</label>
              <input
                type="text"
                id="username"
                className="form-control"
                ref={unInput}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                id="password"
                className="form-control"
                ref={pwInput}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>{" "}
          <Button color="primary" onClick={login}>
            Login{" "}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LoginModal;
