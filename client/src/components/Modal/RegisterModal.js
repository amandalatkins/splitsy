import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";

const RegisterModal = props => {
  const { buttonLabel, className } = props;

  const [modal, setModal] = useState(false);
  const firstName = useInput("");
  const lastName = useInput("");
  const username = useInput("");
  const password = useInput("");

  const handleSubmit = () => {
    const form = {
      favoriteThing: favoriteThing.value,
      comment: comment.value,
      feeling: feeling.value,
      rating: rating.value
    };
    console.log(form);
  };

  const register = () => {
    console.log("works");
    API.createUser();
    toggle();
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
            <label for="fname">First name:</label>
            <br></br>
            <input type="text" id="firstName"></input>
            <br></br>
            <label for="fname">Last name:</label>
            <br></br>
            <input type="text" id="lastName"></input>
            <br></br>
            <label for="fname">Desired userame:</label>
            <br></br>
            <input type="text" id="username"></input>
            <br></br>
            <label for="lname">Password:</label>
            <br></br>
            <input type="text" id="password"></input>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={register}>
            Register{" "}
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RegisterModal;
