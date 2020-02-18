import React, { useState, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";
import { useUserAuthContext } from '../../utils/UserAuthState';

const LoginModal = props => {
  const { buttonLabel, className } = props;

  const [userAuth, setUserAuth] = useUserAuthContext();

  const [modal, setModal] = useState(false);

  const unInput= useRef();
  const pwInput = useRef();

  const login = () => {
    API.logInUser({
      user_name: unInput.current.value,
      password: pwInput.current.value
    })
    .then(results => {
      if (results.data) {
        setUserAuth({
          type: "logIn",
          user: {
            firstName: results.data.first_name,
            lastName: results.data.last_name,
            userName: results.data.user_name,
            date: Date.now()
          }
        });
        props.history.push('/dashboard');
      }
    })
    .catch(err => console.log(err));
  };
  const toggle = () => {
    setModal(!modal);
  };

  return (
    <div>
      <Button color="danger" onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{className}</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              	<label>Userame:</label>
              	<input type="text" id="username" className="form-control" ref={unInput} />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" id="password" className="form-control" ref={pwInput} />
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
