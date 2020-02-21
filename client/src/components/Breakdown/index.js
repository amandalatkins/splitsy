import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";
var Chart = require("chart.js");
var ctx = "myChart";

function Breakdown(props) {
  const [receiptState, receiptStateDispatch] = useReceiptContext();
  // const [payersState, setPayersState] = useState([]);
  // const [itemsState, setItemsState] = useState([]);
  const [totalPayedState, setTotalPayedState] = useState(0);

  useEffect(() => {
    if (receiptState.payers[0]) {
      makeChart();
      getTotalPayed();
    }
  }, [receiptState]);

  function totalCalculator(payer) {
    let total = 0;
    for (let i = 0; i < payer.Items.length; i++) {
      let toFloat = parseFloat(payer.Items[i].price);
      let portionPay;
      let counter = 0;

      if (receiptState.items[0]) {
        for (let j = 0; j < receiptState.items[0].length; j++) {
          if (receiptState.items[0][j].id === payer.Items[i].id) {
            counter = receiptState.items[0][j].Payers.length;
          }
        }
      }

      portionPay =
        (toFloat / counter) *
        (1 + receiptState.receipts[0].tax) *
        (1 + receiptState.receipts[0].tip);
      total = total + portionPay;
      total = total;
    }
    API.updatePayer(payer.id, { amountDue: total.toFixed(2) }).then(res => {});
    return total.toFixed(2);
  }

  function paid(payer, index) {
    let payerUpdate = {
      paid: true
    };
    if (payer.paid === true) {
      payerUpdate.paid = false;
    }

    API.updatePayer(payer.id, payerUpdate).then(res => {
      props.reload(props.receipt.id);
    });
  }

  function makeChart() {
    document.getElementById("myChart").innerHTML = "";

    let names = [];
    let amountDue = [];
    for (let i = 0; i < receiptState.payers[0].length; i++) {
      names.push(receiptState.payers[0][i].name);
    }
    for (let i = 0; i < receiptState.payers[0].length; i++) {
      amountDue.push(receiptState.payers[0][i].amountDue);
    }

    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [
          {
            data: amountDue,
            backgroundColor: [
              "red",
              "yellow",
              "blue",
              "green",
              "orange",
              "cyan"
            ]
          }
        ],
        labels: names
      }
    });
  }

  // function getPayersNames() {
  //   let names = [];
  //   for (let i = 0; i < receiptState.payers[0].length; i++) {
  //     names.push(receiptState.payers[0][i].name);
  //   }
  //   return names;
  // }

  // function getPayersAmountDue() {
  //   let amountDue = [];
  //   for (let i = 0; i < receiptState.payers[0].length; i++) {
  //     amountDue.push(receiptState.payers[0][i].amountDue);
  //   }
  //   console.log(amountDue);
  //   return amountDue;
  // }

  function getTotalPayed() {
    let paid = 0;
    if (receiptState.payers[0]) {
      for (let i = 0; i < receiptState.payers[0].length; i++) {
        if (receiptState.payers[0][i].paid) {
          paid = paid + parseFloat(receiptState.payers[0][i].amountDue);
        }
      }
    }
    console.log(paid);
    setTotalPayedState(parseFloat(paid).toFixed(2));
    // return parseFloat(paid).toFixed(2);
  }

  return (
    <div className="breakdown h-100">
      <h4>Breakdown</h4>
      <canvas id="myChart" width="400" height="600"></canvas>
      <table className="table w-100">
        <tbody>
          {receiptState.payers[0]
            ? receiptState.payers[0].map((payer, index) => (
                <tr key={payer.id}>
                  <td className="text-left">
                    {payer.name}{" "}
                    {payer.paid === true ? (
                      <span
                        onClick={() => {
                          paid(payer, index);
                        }}
                        className="badge badge-success"
                      >
                        Paid
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          paid(payer, index);
                        }}
                        className="badge badge-warning"
                      >
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="text-right">${totalCalculator(payer)}</td>
                </tr>
              ))
            : ""}
          <tr>
            <td className="text-left" style={{ fontWeight: "bold" }}>
              Total Paid:
            </td>
            <td className="text-right" style={{ fontWeight: "bold" }}>
              ${totalPayedState}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Breakdown;
