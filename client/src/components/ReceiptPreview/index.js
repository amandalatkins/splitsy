import React from "react";

function ReceiptPreview(props) {
  // add functionality to show percentage of receipt filled

  console.log(props);

  return (
    <div
      className="col-xs-12 col-md-6 col-lg-4"
      id={props.value.id}
      onClick={() => {
        props.onClick(props.value.id);
      }}
    >
      <div className="receipt-preview">
        <h3>
          {props.value.label}
          <span className="receipt-date">{props.value.date}</span>
        </h3>
        <hr />
        <p className="receipt-total">{props.value.total}</p>

        <table className="w-100">
          <tbody>
            <tr>
              <td className="align-middle receipt-progress">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped bg-orange"
                    role="progressbar"
                    style={{ width: "65%" }}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiptPreview;
