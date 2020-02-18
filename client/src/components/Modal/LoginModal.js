import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const LoginModal = props => {
  const { buttonLabel, className } = props;

  const [modal, setModal] = useState(false);

  const login = () => {
    console.log("insert login after passport");
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
            <label for="fname">Userame:</label>
            <br></br>
            <input type="text" id="username"></input>
            <br></br>
            <label for="lname">Password:</label>
            <br></br>
            <input type="text" id="password"></input>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={login}>
            Login{" "}
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LoginModal;
