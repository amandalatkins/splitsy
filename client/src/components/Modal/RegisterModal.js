import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";

const RegisterModal = props => {
  const { buttonLabel, className } = props;

  const [modal, setModal] = useState(false);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  });

  const handleInputChange = event => {
    let variable = event.target.id;
    setFormState({ ...formState, [variable]: event.target.value });
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    let user = {
      user_name: formState.username,
      password: formState.password,
      first_name: formState.firstName,
      last_name: formState.lastName
    };
    console.log(user);

    API.createUser(user).then(res => {
      console.log(res);
    });
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
            <input
              onChange={handleInputChange}
              type="text"
              id="firstName"
              value={formState.value}
            ></input>
            <br></br>
            <label for="fname">Last name:</label>
            <br></br>
            <input
              type="text"
              id="lastName"
              value={formState.value}
              onChange={handleInputChange}
            ></input>
            <br></br>
            <label for="fname">Desired userame:</label>
            <br></br>
            <input
              type="text"
              id="username"
              value={formState.value}
              onChange={handleInputChange}
            ></input>
            <br></br>
            <label for="lname">Password:</label>
            <br></br>
            <input
              type="text"
              id="password"
              value={formState.value}
              onChange={handleInputChange}
            ></input>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleFormSubmit}>
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
