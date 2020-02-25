import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../utils/ReceiptState";
import API from "../utils/API";
import PayersList from "../components/PayersList";
import ReceiptItem from "../components/ReceiptItem";
import ReceiptItemEdit from "../components/ReceiptItemEdit";
import Breakdown from "../components/Breakdown";
import moment from "moment";

function Receipt(props) {
  const [receiptState, receiptStateDispatch] = useState({
    currentPayer: null,
    currentItemEdit: null
  });
  const [payerState, payerStateDispatch] = useState({});
  const [itemState, itemStateDispatch] = useState({});

  const receiptId = props.match.params.id;
  const isEditMode = props.match.params.edit;

  const [addItem, setAddItem] = useState(false);

  const itemName = useRef();
  const itemPrice = useRef();

  const receiptLabel = useRef();
  const receiptDate = useRef();

  useEffect(() => {
    loadReceipt(receiptId);
  }, []);

  useEffect(() => {
    if (payerState.payers && itemState.items && receiptState.receipts) {
      if (
        payerState.payers[0] &&
        itemState.items[0] &&
        receiptState.receipts[0]
      ) {
        totalCalculator(
          payerState.payers,
          itemState.items,
          receiptState.receipts
        );
      }
    }
  }, [payerState, itemState]);

  function loadReceipt(receiptId, payerId) {
    console.log("loading receipt");
    API.getReceiptById(receiptId)
      .then(receipt => {
        if (payerId) {
          receiptStateDispatch(prevState => {
            return { ...prevState, receipts: [receipt.data], payerId };
          });
        } else {
          receiptStateDispatch(prevState => {
            return { ...prevState, receipts: [receipt.data] };
          });
        }
      })
      .catch(err => console.log(err));
    loadItems(receiptId);
    loadPayers(receiptId);
  }

  // Arman stuff
  function loadItems(receiptId) {
    API.getItemsForReceipt(receiptId).then(res => {
      itemStateDispatch({
        items: [res.data]
      });
    });
  }

  function loadPayers(receiptId) {
    API.getPayersForReceipt(receiptId).then(res => {
      console.log(res);
      payerStateDispatch({
        payers: [res.data]
      });
    });
  }

  function totalCalculator(payers, items, receipt) {
    for (let k = 0; k < payers[0].length; k++) {
      let total = 0;
      for (let i = 0; i < payers[0][k].Items.length; i++) {
        let toFloat = parseFloat(payers[0][k].Items[i].price);
        let portionPay;
        let counter = 0;

        for (let j = 0; j < items[0].length; j++) {
          if (items[0][j].id === payers[0][k].Items[i].id) {
            counter = items[0][j].Payers.length;
          }
        }

        portionPay =
          (toFloat / counter) * (1 + receipt[0].tax) * (1 + receipt[0].tip);
        total = total + portionPay;
        total = total;
      }
      API.updatePayer(payers[0][k].id, { amountDue: total.toFixed(2) }).then(
        res => {
          payerStateDispatch(prevState => {
            const newState = { ...prevState };
            newState.payers[0][k].amountDue = total.toFixed(2);
            return newState;
          });
        }
      );
    }
  }

  function paid(payer, index) {
    let payerUpdate = {
      paid: true
    };
    if (payer.paid === true) {
      payerUpdate.paid = false;
    }

    API.updatePayer(payer.id, payerUpdate).then(res => {
      payerStateDispatch(prevState => {
        const newState = { ...prevState };
        newState.payers[0][index].paid = !prevState.payers[0][index].paid;
        console.log(newState);
        return newState;
      });
    });
  }
  // enf arman stuff

  // amanda stuff

  // end amanda stuff

  function saveReceipt() {
    var isValid = validateTotals();

    if (isValid[0]) {
      API.updateReceipt(receiptId, {
        label: receiptLabel.current.value,
        date: receiptDate.current.value + " 00:00:00"
      })
        .then(_ => {
          console.log(_);
          loadReceipt(receiptId);
        })
        .catch(err => console.log(err));

      props.history.push("/receipt/" + receiptId);
    } else {
      alert(isValid[1]);
    }
  }

  function validateTotals() {
    let receipt = receiptState.receipts[0];

    var isSubValid = false;
    var isTotValid = false;

    var calcSubtotal = parseFloat(0);
    receipt.Items.forEach(({ price }) => {
      calcSubtotal += parseFloat(price);
    });

    if (calcSubtotal.toFixed(2) === receipt.subtotal.toFixed(2)) {
      isSubValid = true;
    }

    var tax = parseFloat(receipt.subtotal) * parseFloat(receipt.tax);
    var tip = parseFloat(receipt.subtotal) * parseFloat(receipt.tip);

    if (
      parseFloat(receipt.subtotal + tax + tip).toFixed(2) ===
      receipt.total.toFixed(2)
    ) {
      isTotValid = true;
    }

    if (!isTotValid || !isSubValid) {
      var message = "";

      if (!isSubValid) {
        message +=
          "Subtotal does not match items total. Try $" +
          calcSubtotal.toFixed(2) +
          ". \n";
      }

      if (!isTotValid) {
        message +=
          "Total does not match Subtotal + Tax + Tip. Try $" +
          parseFloat(receipt.subtotal + tax + tip).toFixed(2) +
          ".";
      }

      return [false, message];
    } else {
      return [true];
    }
  }

  function toggleAddItem() {
    setAddItem(!addItem);
  }

  function addNewItem() {
    API.createItem({
      ReceiptId: receiptId,
      name: itemName.current.value,
      price: itemPrice.current.value
    })
      .then(_ => {
        loadReceipt(receiptId);
        itemName.current.value = "";
        itemPrice.current.value = "";
        toggleAddItem();
      })
      .catch(err => console.log(err));
  }

  function deleteReceipt() {
    API.deleteReceipt(receiptId)
      .then(_ => props.history.push("/dashboard"))
      .catch(err => console.log(err));
  }

  return (
    <div>
      <div className="container pt-5">
        <div className="row">
          <div className="col-12">
            <div className="dashboard-header w-100 clearfix">
              {receiptState.receipts ? (
                isEditMode ? (
                  <form
                    className="form-inline float-left"
                    onSubmit={e => e.preventDefault()}
                  >
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={receiptState.receipts[0].label}
                        placeholder="Label your receipt"
                        ref={receiptLabel}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={moment(
                          receiptState.receipts[0].date
                        ).format("YYYY-MM-DD")}
                        placeholder="Select date"
                        ref={receiptDate}
                      />
                    </div>
                    <span className="badge bg-danger text-white mt-2 ml-2">
                      Edit Mode
                    </span>
                  </form>
                ) : (
                  <h3 className="float-left receipt-label">
                    <span>{receiptState.receipts[0].label}</span>
                    <span className="badge bg-secondary text-white ml-2">
                      {moment(receiptState.receipts[0].date).format(
                        "M/DD/YYYY"
                      )}
                    </span>
                  </h3>
                )
              ) : (
                ""
              )}

              <h3 className="float-right">
                {isEditMode ? (
                  <span>
                    <button
                      className="btn btn-primary"
                      onClick={() => saveReceipt()}
                    >
                      <i className="fas fa-save"></i>
                    </button>
                  </span>
                ) : (
                  <a
                    className="btn btn-secondary"
                    href={`/receipt/${receiptId}/edit`}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </a>
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className={isEditMode ? "container receipt-edit-mode" : "container"}>
        <div className="row">
          <div className="col-xs-12 col-md-1 col-lg-3 p-0">
            <PayersList
              receiptId={receiptId}
              loadReceipt={loadReceipt}
              isEditMode={isEditMode}
              receipt={receiptState.receipts}
              currentPayer={receiptState.currentPayer}
              currentItemEdit={receiptState.currentItemEdit}
              payers={payerState.payers}
              items={itemState.items}
              receiptState={receiptState}
              receiptStateDispatch={receiptStateDispatch}
            />
          </div>
          <div className="col-xs-12 col-md-11 col-lg-5 p-0">
            <div className="receipt">
              <div className="receipt-body">
                <table className="w-100 table">
                  {isEditMode ? (
                    <tbody>
                      {receiptState.receipts
                        ? receiptState.receipts[0].Items.map(item => {
                            return (
                              <ReceiptItemEdit
                                key={item.id}
                                item={item}
                                isTotalItem={false}
                                loadReceipt={loadReceipt}
                              />
                            );
                          })
                        : ""}

                      {addItem ? (
                        <tr className="receipt-item">
                          <td className="receipt-item-label text-left">
                            <input
                              className="form-control"
                              type="text"
                              ref={itemName}
                            />
                            <p className="mt-2">
                              <button
                                className="btn btn-primary btn-sm mr-1"
                                onClick={() => addNewItem()}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm mr-1"
                                onClick={toggleAddItem}
                              >
                                Cancel
                              </button>
                            </p>
                          </td>
                          <td className="receipt-item-price text-right">
                            <input
                              className="form-control"
                              type="text"
                              ref={itemPrice}
                            />
                          </td>
                        </tr>
                      ) : null}

                      <tr className="receipt-item">
                        <td
                          colSpan="2"
                          className="receipt-item-label text-center"
                        >
                          <button
                            className="btn btn-sm btn-secondary w-50"
                            onClick={toggleAddItem}
                          >
                            Add Item
                          </button>
                        </td>
                      </tr>

                      {receiptState.receipts ? (
                        <ReceiptItemEdit
                          item={{
                            name: "Subtotal",
                            price: receiptState.receipts[0].subtotal,
                            id: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                          loadReceipt={loadReceipt}
                        />
                      ) : null}
                      {receiptState.receipts ? (
                        <ReceiptItemEdit
                          item={{
                            name: "Tax",
                            price: receiptState.receipts[0].tax,
                            id: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                          subTotal={receiptState.receipts[0].subtotal}
                          loadReceipt={loadReceipt}
                        />
                      ) : null}
                      {receiptState.receipts ? (
                        <ReceiptItemEdit
                          item={{
                            name: "Tip",
                            price: receiptState.receipts[0].tip,
                            id: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                          subTotal={receiptState.receipts[0].subtotal}
                          loadReceipt={loadReceipt}
                        />
                      ) : null}
                      {receiptState.receipts ? (
                        <ReceiptItemEdit
                          item={{
                            name: "Total",
                            price: receiptState.receipts[0].total,
                            id: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                          loadReceipt={loadReceipt}
                        />
                      ) : (
                        <tr>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  ) : (
                    <tbody>
                      {receiptState.receipts
                        ? receiptState.receipts[0].Items.map(item => {
                            return (
                              <ReceiptItem
                                key={item.id}
                                item={item}
                                isTotalItem={false}
                                reload={loadReceipt}
                                receiptState={receiptState}
                                receiptStateDispatch={receiptStateDispatch}
                              />
                            );
                          })
                        : null}

                      {receiptState.receipts ? (
                        <ReceiptItem
                          item={{
                            name: "Subtotal",
                            price: receiptState.receipts[0].subtotal,
                            receiptId: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                        />
                      ) : null}
                      {receiptState.receipts ? (
                        <ReceiptItem
                          item={{
                            name: "Tax",
                            price: receiptState.receipts[0].tax,
                            id: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                          subTotal={receiptState.receipts[0].subtotal}
                        />
                      ) : null}
                      {receiptState.receipts ? (
                        <ReceiptItem
                          item={{
                            name: "Tip",
                            price: receiptState.receipts[0].tip,
                            id: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                          subTotal={receiptState.receipts[0].subtotal}
                        />
                      ) : null}
                      {receiptState.receipts ? (
                        <ReceiptItem
                          item={{
                            name: "Total",
                            price: receiptState.receipts[0].total,
                            id: receiptState.receipts[0].id
                          }}
                          isTotalItem={true}
                        />
                      ) : (
                        <tr>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
            {isEditMode ? (
              <button
                className="btn text-danger"
                onClick={() => deleteReceipt()}
              >
                Delete Receipt
              </button>
            ) : null}
          </div>
          <div className="col-xs-12 col-lg-4">
            <Breakdown
              receipt={receiptState.receipts}
              payers={payerState.payers}
              items={itemState.items}
              paid={paid}
              totalCalculator={totalCalculator}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
