import React, { useEffect, useState, useRef } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";
import { is } from "bluebird";

function ReceiptItemEdit(props) {
  const { receiptState } = props;

  const [editItem, setEditItem] = useState(false);

  const { item, isTotalItem, loadReceipt, subTotal } = props;

  const itemName = useRef();
  const itemPrice = useRef();

  function updateItem() {
    API.updateItem(item.id, {
      name: itemName.current.value,
      price: itemPrice.current.value
    })
      .then(_ => loadAndReset(item.ReceiptId))
      .catch(err => console.log(err));
  }

  function removeItem() {
    API.deleteItem(item.id)
      .then(_ => loadReceipt(item.ReceiptId))
      .catch(err => console.log(err));
  }

  function updateTotalItem(type) {
    var newPrice;
    if (type === "Total" || type === "Subtotal") {
      newPrice = itemPrice.current.value;
    } else {
      newPrice = (
        parseFloat(itemPrice.current.value) / parseFloat(subTotal)
      ).toFixed(5);
    }
    API.updateReceipt(item.id, { [type.toLowerCase()]: newPrice })
      .then(_ => loadAndReset(item.id))
      .catch(err => console.log(err));
  }

  function onlyAllowNumbers(e) {
    var allowed = "1234567890.";
    if (e.keyCode !== 8 && !allowed.includes(e.key)) {
      e.preventDefault();
    }
  }

  function loadAndReset(id) {
    loadReceipt(id);
    setEditItem(false);
  }

  function autoCalculate(type) {
    var receipt = receiptState.receipts[0];

    switch (type) {
      case "Total":
        var tax = parseFloat(receipt.subtotal) * parseFloat(receipt.tax);
        var tip = parseFloat(receipt.subtotal) * parseFloat(receipt.tip);
        return (itemPrice.current.value = parseFloat(
          receipt.subtotal + tax + tip
        ).toFixed(2));
      case "Subtotal":
        var calcSubtotal = parseFloat(0);
        receipt.Items.forEach(({ price }) => {
          calcSubtotal += parseFloat(price);
        });
        itemPrice.current.value = calcSubtotal;
      default:
        return "Not an option.";
    }
  }

  return (
    <tr
      className={isTotalItem ? "receipt-item receipt-tally" : "receipt-item"}
      onClick={() => setEditItem(true)}
    >
      <td className="receipt-item-label">
        {!editItem ? (
          item.name === "Total" ? (
            <h4>{item.name}</h4>
          ) : (
            <p>{item.name}</p>
          )
        ) : (
          <div>
            {!isTotalItem ? (
              <input
                type="text"
                className="form-control"
                defaultValue={item.name}
                ref={itemName}
              />
            ) : item.name === "Total" ? (
              <h4>{item.name}</h4>
            ) : (
              <p>{item.name}</p>
            )}

            {!isTotalItem ? (
              <p className="mt-2">
                <button
                  className="btn btn-orange btn-sm mr-1"
                  onClick={() => updateItem()}
                >
                  <i class="fas fa-save"></i>&nbsp;
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => removeItem()}
                >
                  <i class="fas fa-times"></i>&nbsp;
                  Remove
                </button>
              </p>
            ) : (
              <p className="mt-2"></p>
            )}
          </div>
        )}
      </td>
      <td className="receipt-item-price text-right">
        {!editItem ? (
          item.name === "Total" ? (
            <h4>${item.price.toFixed(2)}</h4>
          ) : item.name === "Tax" || item.name === "Tip" ? (
            <p>${(item.price * subTotal).toFixed(2)}</p>
          ) : (
            <p>${item.price.toFixed(2)}</p>
          )
        ) : (
          <div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control"
                defaultValue={
                  item.name === "Tax" || item.name === "Tip"
                    ? (item.price * subTotal).toFixed(2)
                    : item.price.toFixed(2)
                }
                ref={itemPrice}
                onKeyDown={e => onlyAllowNumbers(e)}
              />
            </div>
            {item.name === "Total" || item.name === "Subtotal" ? (
              <button
                className="btn btn-sm btn-secondary mr-1"
                onClick={() => autoCalculate(item.name)}
                title={"Automatically calculate the " + item.name.toLowerCase()}
              >
                <i className="fas fa-calculator"></i>
              </button>
            ) : (
              ""
            )}
            {isTotalItem ? (
              <button
                className="btn btn-orange btn-sm"
                onClick={() => updateTotalItem(item.name)}
              >
                <i class="fas fa-save"></i>&nbsp;
                Save
              </button>
            ) : null}
          </div>
        )}
      </td>
    </tr>
  );
}

export default ReceiptItemEdit;
