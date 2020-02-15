import React, { useEffect, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";

function ReceiptItem(props) {

    const [receiptState, receiptStateDispatch] = useReceiptContext();

    const { item, isTotalItem } = props;

    function addPayer() {
        if (receiptState.currentPayer) {
            API.addItemToPayer(receiptState.currentPayer, item.id)
            .then(newPayer => console.log("Added current payer"))
            .catch(err => console.log(err));
        } else {
            console.log("No payer selected");
        }
    }

    return (
        <tr className={isTotalItem ? "receipt-item receipt-tally" : "receipt-item"} onClick={() => addPayer() }>
            <td className="receipt-item-label">
                {item.name === "Total" ?
                    <h4>{item.name}</h4>
                :
                    <p>{item.name}</p>
                }
            </td>
            <td className="receipt-item-price text-right">
                {item.name === "Total" ?
                    <h4>${item.price}</h4>
                :
                    <p>${item.price}</p>
                }
                
            </td>
        </tr>
    );
    

}

export default ReceiptItem;