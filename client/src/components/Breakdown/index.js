import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";
var Chart = require("chart.js");
var ctx = "myChart";

function Breakdown(props) {
  const [receiptState, receiptStateDispatch] = useReceiptContext();
  const [payersState, setPayersState] = useState([]);
  const [itemsState, setItemsState] = useState([]);

  useEffect(() => {
    if (props.receipt) {
      loadBreakdown();
    }
  }, [receiptState]);

  function loadBreakdown() {
    setPayersState([]);
    for (let i = 0; i < props.receipt.Payers.length; i++) {
      API.getPayerById(props.receipt.Payers[i].id).then(res => {
        console.log(res.data);
        setPayersState(payersState => {
          return [...payersState, res.data];
        });
      });
    }
    loadItems();
  }

  function loadItems() {
    setItemsState([]);
    API.getItemsForReceipt(receiptState.receipts[0].id).then(res => {
      console.log(res.data);
      setItemsState(itemsState => {
        return [...itemsState, res.data];
      });
    });
  }

  function totalCalculator(payer) {
    console.log(itemsState);
    let total = 0;

    for (let i = 0; i < payer.Items.length; i++) {
      let toFloat = parseFloat(payer.Items[i].price);
      let portionPay;
      let counter = 0;

      if (itemsState[0]) {
        for (let j = 0; j < itemsState[0].length; j++) {
          if (itemsState[0][j].id === payer.Items[i].id) {
            counter = itemsState[0][j].Payers.length;
            console.log(counter);
          }
        }
      }

      portionPay = toFloat / counter;
      total = total + portionPay;
    }
    API.updatePayer(payer.id, { amountDue: total });
    makeChart();
    return total;
  }

  function paid(payer) {
    props.reload(props.receipt.id);

    let payerUpdate = {
      paid: true
    };
    if (payer.paid === true) {
      payerUpdate.paid = false;
    }

    API.updatePayer(payer.id, payerUpdate).then(res => {
      console.log("worked");
      console.log(payersState);
    });
  }

  function makeChart() {
    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [
          {
            data: getPayersAmountDue(),
            backgroundColor: ["red", "yellow", "blue", "green"]
          }
        ],
        labels: getPayersNames()
      }
    });
  }

  function getPayersNames() {
    let names = [];
    for (let i = 0; i < payersState.length; i++) {
      names.push(payersState[i].name);
    }
    return names;
  }

  function getPayersAmountDue() {
    let amountDue = [];
    for (let i = 0; i < payersState.length; i++) {
      amountDue.push(payersState[i].amountDue);
    }
    return amountDue;
  }

  return (
    <div className="breakdown h-100">
      <h4 onClick={() => console.log(payersState)}>Breakdown</h4>
      <canvas id="myChart" width="400" height="400"></canvas>
      <table className="table w-100">
        <tbody>
          {payersState.map(payer => (
            <tr key={payer.id}>
              <td className="text-left">
                {payer.name}{" "}
                {payer.paid === true ? (
                  <span
                    onClick={() => {
                      paid(payer);
                    }}
                    class="badge badge-success"
                  >
                    Paid
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      paid(payer);
                    }}
                    class="badge badge-warning"
                  >
                    Not Paid
                  </span>
                )}
              </td>
              <td className="text-right">{totalCalculator(payer)}</td>
            </tr>
          ))}
          {/* <tr>
            <td className="text-left">Tot</td>
            <td className="text-right"> yo</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
}
export default Breakdown;
