import React, { useState, useEffect } from "react";
import API from "../utils/API";
import ReceiptPreview from "../components/ReceiptPreview";
import NewReceiptModal from "../components/Modal/NewReceiptModal";
import { useUserAuthContext } from "../utils/UserAuthState";
import DropDown from "../components/Dropdown";

const Dashboard = props => {
  const [receiptState, dispatchReceiptState] = useState({});
  const [userAuth] = useUserAuthContext();
  const [sortState, setSortState] = useState(null);

  // load receipts upon page load
  useEffect(() => {
    loadReceipts();
  }, [sortState]);

  // sorts receipts
  function loadReceipts() {
    if (sortState) {
      API.getReceiptsForUserSort(
        userAuth.user.id,
        sortState.by,
        sortState.type
      ).then(results => {
        dispatchReceiptState({ receipts: results.data });
      });
    } else {
      API.getReceiptsForUser(userAuth.user.id).then(results => {
        dispatchReceiptState({ receipts: results.data });
      });
    }
  }

  return (
    <div>
      <div className="container mt-5 clearfix">
        <div className="row">
          <div className="col-xs-12 col-md-6 text-left">
            {/* <NewReceiptModal buttonLabel="Add Receipt" className="Add" /> */}
            <NewReceiptModal>
              <button className="btn btn-orange">
                <i className="fas fa-plus"></i> Add Receipt
              </button>
            </NewReceiptModal>
          </div>
          <div className="col-xs-12 col-md-6 text-right">
            <div className="dropdown float-right">
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
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
              <DropDown title="Sort" sort={setSortState}></DropDown>
            </div>
          </div>

          <div className="container mt-5">
            <div className="row">
              <div className="d-none d-md-block col-md-6 col-lg-4 ">
                <NewReceiptModal>
                  <div className="add-receipt">
                    <i className="fas fa-plus "></i>
                  </div>
                </NewReceiptModal>
              </div>
              {receiptState.receipts
                ? receiptState.receipts.map(receipt => (
                    <ReceiptPreview
                      key={receipt.id}
                      value={receipt}
                      onClick={() =>
                        props.history.push("/receipt/" + receipt.id)
                      }
                    ></ReceiptPreview>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
