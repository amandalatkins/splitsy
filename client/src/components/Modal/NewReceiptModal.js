import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import API from "../../utils/API";
import { useUserAuthContext } from "../../utils/UserAuthState";
import moment from "moment";

const PlusReceiptModal = props => {
  const { className, children } = props;

  const [modal, setModal] = useState(false);

  const [formState, setFormState] = useState({
    label: ""
  });

  const [uploadingState, setUploadingState] = useState({
    isUploading: false,
    message: ""
  });

  const [userAuth] = useUserAuthContext();

  const fileUpload = useRef();

  useEffect(() => {
    setFormState({ ...formState, date: moment().format("YYYY-MM-DD") });
  }, []);

  const handleInputChange = event => {
    let { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = event => {
    event.preventDefault();

    let receipt = {
      label: formState.label,
      date: formState.date + " 00:00:00",
      UserId: userAuth.user.id
    };

    if (formState.receiptImage) {
      setUploadingState({
        isUploading: true,
        message: "Uploading your receipt..."
      });

      var formData = new FormData();

      formData.append("label", formState.label);
      formData.append("date", formState.date);
      formData.append("receiptImage", formState.receiptImage);

      API.uploadImage(formData)
        .then(imgResults => {
          setUploadingState({
            isUploading: true,
            message: "Scanning your receipt..."
          });

          const { imageUrl } = imgResults.data;

          API.ocrImage({ imageUrl })
            .then(ocrResults => {
              if (!ocrResults.data.error) {
                console.log(ocrResults.data);
                setUploadingState({
                  isUploading: true,
                  message: "Creating your receipt..."
                });

                API.parseOcrData({ text: ocrResults.data[0].ParsedText })

                  .then(parseResults => {
                    if (!parseResults.data.error) {
                      API.createReceipt(receipt).then(res => {
                        console.log("Created Receipt with items");

                        var receiptId = res.data.id;
                        var receiptItems = parseResults.data;

                        var receiptSubtotal = 0;

                        receiptItems.forEach((item, index) => {
                          if (item.name.toLowerCase().includes("subtotal")) {
                            receiptSubtotal = item.price;
                            API.updateReceipt(receiptId, {
                              subtotal: item.price
                            })
                              .then(done => console.log(done))
                              .catch(err => console.log(err));
                          } else if (
                            item.name.toLowerCase().includes("total")
                          ) {
                            API.updateReceipt(receiptId, { total: item.price })
                              .then(done => console.log(done))
                              .catch(err => console.log(err));
                          } else if (item.name.toLowerCase().includes("tax")) {
                            if (receiptSubtotal !== 0) {
                              API.updateReceipt(receiptId, {
                                tax: parseFloat(
                                  item.price / receiptSubtotal
                                ).toFixed(5)
                              })
                                .then(done => console.log(done))
                                .catch(err => console.log(err));
                            }
                          } else {
                            API.createItem({ ReceiptId: receiptId, ...item })
                              .then(done => console.log(done))
                              .catch(err => console.log(err));
                          }
                          console.log(index + " = " + receiptItems.length - 1);
                          if (index === receiptItems.length - 1) {
                            window.location.href =
                              "/receipt/" + receiptId + "/edit";
                          }
                        });
                      });
                    } else {
                      setUploadingState({
                        isUploading: true,
                        message:
                          "Unable to read your receipt. Creating blank receipt..."
                      });
                      API.createReceipt(receipt).then(res => {
                        window.location.href = "/receipt/" + res.data.id + "/edit";
                      });
                    }
                  })
                  .catch(err => console.log(err));
              } else {
                setUploadingState({
                  isUploading: true,
                  message:
                    "Unable to import your receipt. Creating blank receipt..."
                });
                API.createReceipt(receipt).then(res => {
                  window.location.href = "/receipt/" + res.data.id + "/edit";
                });
              }

              // API.parseOcr
              console.log(ocrResults);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    } else {
      API.createReceipt(receipt).then(res => {
        window.location.href = "/receipt/" + res.data.id + "/edit";
      });
    }
  };

  function handleFileUploadChange(e) {
    setFormState({ ...formState, receiptImage: e.target.files[0] });
  }

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <div onClick={toggle}>
      {children}
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
                defaultValue={moment().format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Upload a receipt (optional):</label>
              <input
                type="file"
                className="form-control"
                name="receiptImage"
                style={{paddingBottom: "35px"}}
                onChange={handleFileUploadChange}
              />
              <small>
                Some items may not be detected. Be sure to check your receipt
                after upload!
              </small>
            </div>
            <div
              className={
                uploadingState.isUploading ? "alert alert-primary" : "d-none"
              }
              role="alert"
            >
              <div
                className="spinner-border spinner-border-sm mr-1"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
              {uploadingState.message}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" form="newReceipt" className="btn-orange">
            Create Receipt{" "}
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PlusReceiptModal;