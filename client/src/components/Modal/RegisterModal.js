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
			
			<div className="row">
				<div className="col-xs-12 col-md-6">
					<div className="form-group">
						<label>First name:</label>
						<input
							onChange={handleInputChange}
							type="text"
							id="firstName"
							value={formState.value}
							className="form-control"
						/>
					</div>
				</div>
				<div className="col-xs-12 col-md-6">
					<div className="form-group">
						<label>Last name:</label>
						<input
							type="text"
							id="lastName"
							value={formState.value}
							onChange={handleInputChange}
							className="form-control"
						/>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col-xs-12 col-md-6">
					<div className="form-group">
						<label>Userame:</label>
						<input
							type="text"
							id="username"
							value={formState.value}
							onChange={handleInputChange}
							className="form-control"
						/>
					</div>
				</div>
				<div className="col-xs-12 col-md-6">
					<div className="form-group">
						<label>Password:</label>
						<input
							type="password"
							id="password"
							value={formState.value}
							onChange={handleInputChange}
							className="form-control"
						/>
					</div>
				</div>
			</div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>{" "}
		  <Button color="primary" onClick={handleFormSubmit}>
            Register{" "}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RegisterModal;
