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
            <div className="form-group">
              	<label>Userame:</label>
              	<input type="text" id="username" className="form-control"/>
            </div>
			<div className="form-group">
				<label>Password:</label>
				<input type="text" id="password" className="form-control"></input>
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
