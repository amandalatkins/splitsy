import React, { useEffect, useState, useRef } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";
import { is } from "bluebird";

function ReceiptItemEdit(props) {

    // const [receiptState, receiptStateDispatch] = useReceiptContext();

    const [editItem, setEditItem] = useState(false);

    const { item, isTotalItem, loadReceipt, subTotal } = props;

    const itemName = useRef();
    const itemPrice = useRef();

    // useEffect(()=>{
    //     loadItem();
    // },[]);

    function updateItem() {
        API.updateItem(item.id, { name: itemName.current.value, price: itemPrice.current.value })
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
            newPrice = (parseFloat(itemPrice.current.value)  / parseFloat(subTotal)).toFixed(5);
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
                        {!isTotalItem ?
                            <input type="text" className="form-control" defaultValue={item.name} ref={itemName}/>
                        : 
                            item.name === "Total" ?
                                <h4>{item.name}</h4>
                            :
                                <p>{item.name}</p>
                        }
                            
                            {!isTotalItem ?
                                <p className="mt-2">
                                    <button className="btn btn-secondary btn-sm mr-1" onClick={() => updateItem()}>Save</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => removeItem()}>Remove</button>
                                </p>
                            : 
                                <p className="mt-2">
                                    <button className="btn btn-secondary btn-sm mr-1" onClick={() => updateTotalItem(item.name)}>Save</button>
                                </p>
                            }
                    </div>
                }

            </td>
            <td className="receipt-item-price text-right">
                {!editItem ? 
                    item.name === "Total" ?
                        <h4>${item.price.toFixed(2)}</h4>
                    :
                        item.name === "Tax" || item.name === "Tip" ?
                            <p>${(item.price*subTotal).toFixed(2)}</p>
                        :
                            <p>${item.price.toFixed(2)}</p>
                    
                :
                    <div>
                        <input type="text" className="form-control" defaultValue={item.name === "Tax" || item.name === "Tip" ? (item.price*subTotal).toFixed(2) : item.price.toFixed(2)} ref={itemPrice} onKeyDown={(e) => onlyAllowNumbers(e) }/>
                    </div>
                }

                
                
            </td>
        </tr>
    );
    

}

export default ReceiptItemEdit;