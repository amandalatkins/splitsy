import React, { useEffect } from "react";
// import API from "../../utils/API";
import { useReceiptContext } from "../utils/ReceiptState";
import API from "../utils/API";
import ReceiptPreview from "../components/ReceiptPreview";
import NewReceiptModal from "../components/Modal/NewReceiptModal";
import { useUserAuthContext } from '../utils/UserAuthState';
import moment from "moment";

const Dashboard = (props) => {
  const [receiptState, dispatchReceiptState] = useReceiptContext();
  const [userAuth] = useUserAuthContext();

  // const receiptClick = id => {
  //   console.log("receipt button works");
  // };

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
    API.getReceiptsForUser(userAuth.user.id).then(results => {
      dispatchReceiptState({ type: "loadReceipts", receipts: results.data });
    });
  }

  return (
    <div>
      <div className="container mt-5 clearfix">
        <div className="row">
          <div className="col-xs-12 col-md-6 text-left">
            <NewReceiptModal buttonLabel="Add Receipt" className="Add"/>
          </div>
          <div className="col-xs-12 col-md-6 text-right">
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
                  onClick={() => props.history.push('/receipt/'+receipt.id)}
                ></ReceiptPreview>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
