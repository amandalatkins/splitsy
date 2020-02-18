import React, { useEffect } from "react";
// import API from "../../utils/API";
import { useReceiptContext } from "../utils/ReceiptState";
import API from "../utils/API";
import ReceiptPreview from "../components/ReceiptPreview";
import NewReceiptModal from "../components/Modal/NewReceiptModal";

const Dashboard = () => {
  const [receiptState, dispatchReceiptState] = useReceiptContext();

  const receiptClick = id => {
    window.location.href = "/receipt/" + id;
    console.log("receipt button works");
  };

  function newReceiptClick() {
    console.log("hit");
    API.createReceipt({}).then(res => {
      console.log(res);
      // window.location.href = "/receipt/" + res.;
    });
  }

  useEffect(() => {
    loadReceipts();
  }, []);

  // get user id from user state i believe, "2" is placeholder
  function loadReceipts() {
    API.getReceiptsForUser(1).then(results => {
      // console.log(results);
      dispatchReceiptState({ type: "loadReceipts", receipts: results.data });
    });
  }

  return (
    // onClick={() => {
    //   newReceiptClick();
    // }}
    <div>
      <div className="container mt-5 clearfix">
        <NewReceiptModal buttonLabel="Add" className="Add">
          Add{" "}
        </NewReceiptModal>
        <div className="dropdown float-right">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Sort
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">
              Date
            </a>
            <a className="dropdown-item" href="#">
              Amount
            </a>
            <a className="dropdown-item" href="#">
              Progress
            </a>
          </div>
        </div>
        <div className="dropdown float-right mr-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Filter
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">
              Paid
            </a>
            <a className="dropdown-item" href="#">
              Unpaid
            </a>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="d-none d-md-block col-md-6 col-lg-4">
            <div className="add-receipt">
              <i className="fas fa-plus"></i>
            </div>
          </div>
          {receiptState.receipts.map(receipt => (
            <ReceiptPreview
              key={receipt.id}
              value={receipt}
              onClick={receiptClick}
            ></ReceiptPreview>
          ))}
        </div>
      </div>

      <div className="modal" tabIndex="-1" role="dialog" id="addReceiptModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add a Receipt</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group my-2">
                  <p>
                    Upload a well-lighted photo of your receipt. Make sure the
                    receipt is laying flat on a flat surface and your photo is
                    as straight on as possible.
                  </p>
                  <input type="file" name="fileToUpload" id="receiptFile" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <a href="receipt.html">
                <button type="button" className="btn btn-primary">
                  Upload File
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
