import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";
import { useUserAuthContext } from '../../utils/UserAuthState';
import moment from "moment";

const PlusReceiptModal = props => {
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
      date: formState.date + " 00:00:00",
      UserId: userAuth.user.id
    };

    API.createReceipt(receipt).then(res => {
      console.log(res);
      window.location.href = "/receipt/" + res.data.id + "/edit";
    });
  };

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <div onClick={toggle}>
      <div className="add-receipt">
        <i className="fas fa-plus"></i>
      </div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Add New Receipt</ModalHeader>
        <ModalBody>
        <form>
              <div className="form-group">
                <label>What's your receipt for?</label>
                <input
                  onChange={handleInputChange}
                  type="text"
                  name="label"
                  placeholder="Coffee at Cafe Grumpy"
                  className="form-control"
                />
              </div>
              <div className="form-group">
              <label>Enter a date for the receipt:</label>
                <input 
                  type="date" 
                  className="form-control"
                  name="date"
                  defaultValue={moment().format('YYYY-MM-DD')}
                  onChange={handleInputChange}
                />
              </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleFormSubmit}>
            Create Receipt{" "}
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PlusReceiptModal;
