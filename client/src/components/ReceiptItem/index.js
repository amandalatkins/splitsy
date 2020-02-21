import React, { useEffect, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";

function ReceiptItem(props) {
  const [receiptState, receiptStateDispatch] = useReceiptContext();

  const [payersState, setPayersState] = useState([{ id: null, name: null }]);

  const { item, isTotalItem, subTotal } = props;

  useEffect(() => {
    loadItem();
  }, []);

  function loadItem() {
    if (!isTotalItem) {
      API.getItemById(item.id)
        .then(results => {
          setPayersState(results.data.Payers);
          props.reload(receiptState.receipts[0].id);
        })
        .catch(err => console.log(err));
    }
  }

  function togglePayer() {
    if (receiptState.currentPayer) {
      if (payersState.some(payer => payer.id === receiptState.currentPayer)) {
        removePayer();
      } else {
        addPayer();
      }
    } else {
      console.log("Must select payer");
    }
  }

  function addPayer() {
    if (receiptState.currentPayer) {
      API.addItemToPayer(receiptState.currentPayer, item.id)
        .then(_ => {
          loadItem();
          // props.reload(receiptState.receipts[0].id);
        })
        .catch(err => console.log(err));
    } else {
      console.log("No payer selected");
    }
  }

  function removePayer() {
    API.removeItemToPayer(receiptState.currentPayer, item.id)
      .then(_ => {
        loadItem();
        // props.reload(receiptState.receipts[0].id);
      })
      .catch(err => console.log(err));
  }

  return (
    <tr
      className={isTotalItem ? "receipt-item receipt-tally" : "receipt-item"}
      onClick={isTotalItem ? () => {} : () => togglePayer()}
    >
      <td className="receipt-item-label">
        {item.name === "Total" ? <h4>{item.name}</h4> : <p>{item.name}</p>}
        {payersState.map(payer => {
          return (
            <span
              key={payer.id}
              className={
                receiptState.currentPayer === payer.id
                  ? "badge bg-orange text-white"
                  : "badge bg-secondary text-white"
              }
            >
              {payer.name}
            </span>
          );
        })}
      </td>
      <td className="receipt-item-price text-right">
        {item.name === "Total" ? (
          <h4>${item.price.toFixed(2)}</h4>
        ) : item.name === "Tax" || item.name === "Tip" ? (
          <p>${(item.price * subTotal).toFixed(2)}</p>
        ) : (
          <p>${item.price.toFixed(2)}</p>
        )}
      </td>
    </tr>
  );
}

export default ReceiptItem;
