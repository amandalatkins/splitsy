import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";

function ReceiptPreview(props) {
  const [barState, setBarState] = useState(0);
  const [receiptState, receiptStateDispatch] = useReceiptContext();

  useEffect(() => {
    if (props.value) {
      getProgess();
    }
  }, [receiptState]);

  function getProgess() {
    API.getPayersForReceipt(props.value.id).then(res => {
      let paid = 0;
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].paid) {
          paid = paid + res.data[i].amountDue;
        }
      }
      let percent = 100 * (paid / props.value.total);
      console.log(percent);
      setBarState(percent);
    });
  }

  console.log(props);

  return (
    <div
      className="col-xs-12 col-md-6 col-lg-4 "
      id={props.value.id}
      onClick={() => {
        props.onClick(props.value.id);
      }}
    >
      <div className="receipt-preview thePreview">
        <h5>
          {props.value.label.substring(0, 20).trim()}
          {props.value.label.length > 20 ? "..." : ""}
          <span className="receipt-date">
            {moment(props.value.date).format("M/DD")}
          </span>
        </h5>

        <hr />
        <p className="receipt-total">${props.value.total.toFixed(2)}</p>

        <table className="w-100">
          <tbody>
            {barState === 100 || barState > 100 ? (
              <tr>
                <td className="align-middle receipt-progress">
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped bg-teal"
                      role="progressbar"
                      style={{
                        width: barState + "%"
                      }}
                      aria-valuenow="80"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </td>
                <td className="align-middle receipt-icon text-teal text-right">
                  <i className="fas fa-check-circle"></i>
                </td>
              </tr>
            ) : (
              <tr>
                <td className="align-middle receipt-progress">
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped bg-orange"
                      role="progressbar"
                      style={{
                        width: barState + "%"
                      }}
                      aria-valuenow="80"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </td>
                <td className="align-middle receipt-icon text-right text-orange">
                  <i className="fas fa-times-circle"></i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiptPreview;
