import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";

const NewReceiptModal = props => {
  const { buttonLabel, className } = props;

  const [modal, setModal] = useState(false);

  const [formState, setFormState] = useState({
    label: ""
  });

  const handleInputChange = event => {
    let variable = event.target.id;
    setFormState({ ...formState, [variable]: event.target.value });
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    let receipt = {
      label: formState.label
    };
    console.log(receipt);

    API.createReceipt(receipt).then(res => {
      console.log(res);
      window.location.href = "/receipt/" + res.data.id + "/edit";
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
