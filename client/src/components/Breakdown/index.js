import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";

function Breakdown(props) {
  const [receiptState, receiptStateDispatch] = useReceiptContext();
  const [payersState, setPayersState] = useState([]);

  useEffect(() => {
    if (props.receipt) {
      loadBreakdown();
    }
  }, [receiptState]);

  function loadBreakdown() {
    for (let i = 0; i < props.receipt.Payers.length; i++) {
      API.getPayerById(props.receipt.Payers[i].id).then(res => {
        console.log(res.data);
        setPayersState(payersState => {
          return [...payersState, res.data];
        });
      });
    }
  }

  function totalCalculator(payer) {
    let total = 0;
    for (let i = 0; i < payer.Items.length; i++) {
      total = total + parseInt(payer.Items[i].price);
    }
    return total;
  }

  function paid(payer) {
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
              <td className="text-left">{payer.name}</td>
              <td className="text-right">
                {totalCalculator(payer)}
                <i
                  className="fas fa-times-circle text-red"
                  onClick={() => {
                    paid(payer);
                  }}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Breakdown;
