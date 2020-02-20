import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";
import { useUserAuthContext } from '../../utils/UserAuthState';
import moment from "moment";

const NewReceiptModal = props => {
  const { buttonLabel, className } = props;

  const [modal, setModal] = useState(false);

  const [formState, setFormState] = useState({
    label: ""
  });

  const [userAuth] = useUserAuthContext();

  const fileUpload = useRef();

  useEffect(() => {
    setFormState({ ...formState, date: moment().format('YYYY-MM-DD') });
  }, [])

  const handleInputChange = event => {
    let { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = event => {
    event.preventDefault();

    console.log("form submitted");

    console.log(formState);

    if (formState.receiptImage) {

      console.log(formState.receiptImage);

      var formData = new FormData();

      formData.append('label',formState.label);
      formData.append('date', formState.date);
      formData.append('receiptImage',formState.receiptImage);

      API.createReceiptImage(formData)
      .then(results => console.log(results))
      .catch(err => console.log(err));

    } else {

      let receipt = {
        label: formState.label,
        date: formState.date + " 00:00:00",
        UserId: userAuth.user.id
      };

      API.createReceipt(receipt).then(res => {
        window.location.href = "/receipt/" + res.data.id + "/edit";
      });

    }
  };

  function handleFileUploadChange(e) {
    setFormState({ ...formState, receiptImage: e.target.files[0]});
  }

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <div>
      <Button className="btn bg-orange border-orange text-white" onClick={toggle}>
      <i className="fas fa-plus"></i> {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Add New Receipt</ModalHeader>
        <ModalBody>
          <form id="newReceipt" onSubmit={handleFormSubmit}>
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
              <div className="form-group">
                <label>Select a file to upload:</label>
                <input 
                  type="file" 
                  className="form-control"
                  name="receiptImage"
                  onChange={handleFileUploadChange}
                />
              </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" form="newReceipt">
            Create Receipt{" "}
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default NewReceiptModal;
