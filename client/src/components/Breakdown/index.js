import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";
var Chart = require("chart.js");
var ctx = "myChart";

const getPayers = async payersList => {
  const finalArray = [];
  for (let i = 0; i < payersList.length; i++) {
    const { data } = await API.getPayerById(payersList[i].id);
    finalArray.push(data);
  }
  return finalArray;
};

function Breakdown(props) {
  const [receiptState, receiptStateDispatch] = useReceiptContext();
  const [payersState, setPayersState] = useState([]);
  const [itemsState, setItemsState] = useState([]);
  const [totalPayedState, setTotalPayedState] = useState(0);

  // useEffect(() => {
  //   if (props.receipt) {
  //     loadBreakdown();
  //   }
  // }, [props.receipt]);

  // useEffect(() => {
  //   if (props.receipt) {
  //     loadItems();
  //     // getTotalPayed();
  //   }
  // }, [receiptState]);

  async function loadBreakdown() {
    let sortedPayers = props.receipt.Payers.sort();
    const payers = await getPayers(sortedPayers);
    setPayersState(payers);

    API.getItemsForReceipt(receiptState.receipts[0].id).then(res => {
      setItemsState(itemsState => {
        return [...itemsState, res.data];
      });
    });
    // loadItems();
    getTotalPayed();
  }

  // function loadItems() {
  //   API.getItemsForReceipt(receiptState.receipts[0].id).then(res => {
  //     receiptStateDispatch({
  //       type: "setItems",
  //       items: [res.data]
  //     });
  //   });
  // }

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

      portionPay = toFloat / counter;
      total = total + portionPay;
    }
    API.updatePayer(payer.id, { amountDue: total });
    // makeChart();
    return total;
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
    // setPayersState(prevState => {
    //   const newState = [...prevState];
    //   newState[index].paid = !prevState[index].paid;
    //   return newState;
    // });
  }

  // function makeChart() {
  //   var myPieChart = new Chart(ctx, {
  //     type: "pie",
  //     data: {
  //       datasets: [
  //         {
  //           data: getPayersAmountDue(),
  //           backgroundColor: [
  //             "red",
  //             "yellow",
  //             "blue",
  //             "green",
  //             "orange",
  //             "cyan"
  //           ]
  //         }
  //       ],
  //       labels: getPayersNames()
  //     }
  //   });
  // }

  // function getPayersNames() {
  //   let names = [];
  //   for (let i = 0; i < payersState.length; i++) {
  //     names.push(payersState[i].name);
  //   }
  //   return names;
  // }

  // function getPayersAmountDue() {
  //   let amountDue = [];
  //   for (let i = 0; i < payersState.length; i++) {
  //     amountDue.push(payersState[i].amountDue);
  //   }
  //   return amountDue;
  // }

  function getTotalPayed() {
    let paid = 0;
    for (let i = 0; i < payersState.length; i++) {
      if (payersState[i].paid) {
        paid = paid + parseInt(payersState[i].amountDue);
      }
    }
    setTotalPayedState(paid);
  }

  return (
    <div className="breakdown h-100">
      <h4 onClick={() => console.log(payersState)}>Breakdown</h4>
      {/* <canvas id="myChart" width="400" height="600"></canvas> */}
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
                  <td className="text-right">{totalCalculator(payer)}</td>
                </tr>
              ))
            : ""}
          <tr>
            <td className="text-left">Total Paid:</td>
            <td className="text-right">{totalPayedState}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Breakdown;
