import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";
import { useUserAuthContext } from '../../utils/UserAuthState';

const NewReceiptModal = props => {
  const { buttonLabel, className } = props;

  const [modal, setModal] = useState(false);

  const [formState, setFormState] = useState({
    label: ""
  });

  const [userAuth] = useUserAuthContext();

  const handleInputChange = event => {
    let variable = event.target.id;
    setFormState({ ...formState, [variable]: event.target.value });
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    let receipt = {
      label: formState.label,
      UserId: userAuth.user.id
    };

    API.createReceipt(receipt).then(res => {
      window.location.href = "/receipt/" + res.data.id + "/edit";
    });
  };

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <div>
      <Button className="btn bg-orange border-orange text-white" onClick={toggle}>
      <i class="fas fa-plus"></i> {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{className}</ModalHeader>
        <ModalBody>
          <form>
            <label for="fname">Label:</label>
            <br></br>
            <input
              onChange={handleInputChange}
              type="text"
              id="label"
              value={formState.value}
            ></input>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleFormSubmit}>
            Create Receipt{" "}
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default NewReceiptModal;
