import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";

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

      // if (itemsState[0]) {
      //   for (let j = 0; j < itemsState[0].length; j++) {
      //     if (itemsState[0][j].Payers) {
      //       for (let k = 0; k < itemsState[0][j].Payers.length; k++) {
      //         if (itemsState[0][j].Payers[k].id === payer.id) {
      //           counter++;
      //         }
      //       }
      //     }
      //   }
      // }
      portionPay = toFloat / counter;
      total = total + portionPay;
    }
    return total;
  }
  // function totalCalculator(payer) {
  //   let total = 0;

  //   for (let i = 0; i < payer.Items.length; i++) {
  //     let toFloat = parseFloat(payer.Items[i].price);
  //     let portionPay;

  //     API.getItemById(payer.Items[i].id).then(res => {
  //       portionPay = toFloat / res.data.Payers.length;

  //       total = total + portionPay;
  //       console.log(total);
  //     });
  //   }
  //   return total;
  // }

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
    });
  }

  return (
    <div className="breakdown h-100">
      <h4 onClick={() => console.log(payersState)}>Breakdown</h4>
      <img src="img/pie.png" className="breakdown-graph mx-auto" />
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
          <tr>
            <td className="text-left">Tot</td>
            <td className="text-right"> yo</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Breakdown;
