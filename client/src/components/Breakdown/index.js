import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";
let Chart = require("chart.js");
let ctx = "myChart";

let payersTotal = 0;

function Breakdown(props) {
  const [payersState, setPayersState] = useState([]);
  const [itemsState, setItemsState] = useState([]);

  const { receipt, payers, items, totalCalculator } = props;

  useEffect(() => {
    if (props.payers && props.items && props.receipt) {
      if (props.payers[0] && props.items[0] && props.receipt[0]) {
        // alterData(props);
        totalCalculator(props.payers, props.items, props.receipt);
      }
    }
  }, [props.payers]);

  function totalPayedCalc() {
    console.log("hi");
    console.log(payers);
    let paid = 0;
    for (let i = 0; i < payers[0].length; i++) {
      if (payers[0][i].paid) {
        paid = paid + parseFloat(payers[0][i].amountDue);
      }
    }
    return parseFloat(paid).toFixed(2);
  }

  // function alterData(props) {
  //   console.log(props);
  //   totalCalculator(props.payers, props.items, props.receipt);
  // }

  // function totalCalculator(payers, items, receipt) {
  //   for (let k = 0; k < payers[0].length; k++) {
  //     let total = 0;
  //     for (let i = 0; i < payers[0][k].Items.length; i++) {
  //       let toFloat = parseFloat(payers[0][k].Items[i].price);
  //       let portionPay;
  //       let counter = 0;

  //       for (let j = 0; j < items[0].length; j++) {
  //         if (items[0][j].id === payers[0][k].Items[i].id) {
  //           counter = items[0][j].Payers.length;
  //         }
  //       }

  //       portionPay =
  //         (toFloat / counter) * (1 + receipt[0].tax) * (1 + receipt[0].tip);
  //       total = total + portionPay;
  //       total = total;
  //     }
  //     API.updatePayer(payers[0][k].id, { amountDue: total.toFixed(2) }).then(
  //       res => {
  //         API.getPayerById(payers[0][k].id).then(res => {
  //           setPayersState(prevState => {
  //             return [...prevState, res.data];
  //           });
  //         });
  //       }
  //     );
  //   }
  //   console.log(payersState);
  // }

  // function paid(payer, index) {
  //   let payerUpdate = {
  //     paid: true
  //   };
  //   if (payer.paid === true) {
  //     payerUpdate.paid = false;
  //   }

  //   API.updatePayer(payer.id, payerUpdate).then(res => {
  //     props.reload(props.receipt.id);
  //   });
  // }

  // function makeChart() {
  //   document.getElementById("myChart").innerHTML = "";

  //   let names = [];
  //   let amountDue = [];
  //   for (let i = 0; i < receiptState.payers[0].length; i++) {
  //     names.push(receiptState.payers[0][i].name);
  //   }
  //   for (let i = 0; i < receiptState.payers[0].length; i++) {
  //     amountDue.push(receiptState.payers[0][i].amountDue);
  //   }

  //   let myPieChart = new Chart(ctx, {
  //     type: "pie",
  //     data: {
  //       datasets: [
  //         {
  //           data: amountDue,
  //           backgroundColor: [
  //             "#f44336",
  //             "#ff9800",
  //             "#2196f3",
  //             "#4caf50",
  //             "#f48fb1",
  //             "#90caf9"
  //           ]
  //         }
  //       ],
  //       labels: names
  //     }
  //   });
  // }

  // // function getPayersNames() {
  // //   let names = [];
  // //   for (let i = 0; i < receiptState.payers[0].length; i++) {
  // //     names.push(receiptState.payers[0][i].name);
  // //   }
  // //   return names;
  // // }

  // // function getPayersAmountDue() {
  // //   let amountDue = [];
  // //   for (let i = 0; i < receiptState.payers[0].length; i++) {
  // //     amountDue.push(receiptState.payers[0][i].amountDue);
  // //   }
  // //   console.log(amountDue);
  // //   return amountDue;
  // // }

  // // function getTotalPayed(payers) {
  // //   let paid = 0;
  // //   if (payers) {
  // //     for (let i = 0; i < payers.length; i++) {
  // //       if (payers[i].paid) {
  // //         paid = paid + parseFloat(payers[i].amountDue);
  // //       }
  // //     }
  // //   }
  // //   return parseFloat(paid).toFixed(2);
  // // }

  return (
    <div className="breakdown h-100">
      <h4>Breakdown</h4>
      {/* <canvas id="myChart" width="400" height="600"></canvas> */}
      <table className="table w-100">
        <tbody>
          {props.payers
            ? props.payers[0].map((payer, index, payers) => {
                return (
                  <tr key={payer.id}>
                    <td className="text-left">
                      {payer.name}{" "}
                      {payer.paid === true ? (
                        <span
                          onClick={() => {
                            props.paid(payer, index);
                          }}
                          className="badge badge-success"
                        >
                          Paid
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            props.paid(payer, index);
                          }}
                          className="badge badge-warning"
                        >
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="text-right">${payer.amountDue}</td>
                  </tr>
                );
              })
            : null}
          <tr>
            <td className="text-left" style={{ fontWeight: "bold" }}>
              Total Paid:
            </td>
            <td className="text-right" style={{ fontWeight: "bold" }}>
              ${props.payers ? totalPayedCalc() : null}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Breakdown;
