import React, { useEffect, useState, useRef } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";

function ReceiptItemEdit(props) {

    // const [receiptState, receiptStateDispatch] = useReceiptContext();

    const [editItem, setEditItem] = useState(false);

    const { item, isTotalItem, loadReceipt } = props;

    const itemName = useRef();
    const itemPrice = useRef();

    // useEffect(()=>{
    //     loadItem();
    // },[]);

    function updateItem() {
        API.updateItem(item.id, { name: itemName.current.value, price: itemPrice.current.value })
        .then(_ => {
            loadReceipt(item.ReceiptId)
            setEditItem(false);
        })
        .catch(err => console.log(err));
    }

    function removeItem() {
        API.deleteItem(item.id)
        .then(_ => loadReceipt(item.ReceiptId))
        .catch(err => console.log(err));
    }

    return (
        <tr className={isTotalItem ? "receipt-item receipt-tally" : "receipt-item"} onClick={() => setEditItem(true)}>
            <td className="receipt-item-label">
                {!editItem ? 
                    item.name === "Total" ?
                        <h4>{item.name}</h4>
                    :
                        <p>{item.name}</p>
                :
                    <div>
                        <input type="text" className="form-control" defaultValue={item.name} ref={itemName}/>
                        <p className="mt-2">
                            <button className="btn btn-secondary btn-sm mr-1" onClick={() => updateItem()}>Save</button>
                            <button className="btn btn-danger btn-sm" onClick={() => removeItem()}>Remove</button>
                        </p>
                    </div>
                }

            </td>
            <td className="receipt-item-price text-right">
                {!editItem ? 
                    item.name === "Total" ?
                        <h4>${item.price}</h4>
                    :
                        <p>${item.price}</p>
                    
                :
                    <div>
                        <input type="text" className="form-control" defaultValue={item.price} ref={itemPrice}/>
                    </div>
                }

                
                
            </td>
        </tr>
    );
    

}

export default ReceiptItemEdit;