import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../utils/ReceiptState";
import API from "../utils/API";
import PayersList from "../components/PayersList";
import ReceiptItem from "../components/ReceiptItem";
import ReceiptItemEdit from "../components/ReceiptItemEdit";
import Breakdown from "../components/Breakdown";
import moment from "moment";

function Receipt(props) {

    const [receiptState, receiptStateDispatch] = useReceiptContext();
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

    function loadReceipt(receiptId) {
        console.log("loading receipt");
        API.getReceiptById(receiptId)
        .then(receipt => {
            console.log(receipt);
            receiptStateDispatch({ type: "loadReceipts", receipts: [receipt.data] })
        })
        .catch(err => console.log(err));
    }

    function saveReceipt() {
        API.updateReceipt(receiptId, { label: receiptLabel.current.value, date: receiptDate.current.value + " 00:00:00" })
        .then(_ => { console.log(_); loadReceipt(receiptId) })
        .catch(err => console.log(err));
        
        props.history.push('/receipt/'+receiptId);
    }

    function toggleAddItem() {
        setAddItem(!addItem);
    }

    function addNewItem() {
        API.createItem({ ReceiptId: receiptId, name: itemName.current.value, price: itemPrice.current.value })
        .then(_ => {
            loadReceipt(receiptId)
            itemName.current.value = "";
            itemPrice.current.value = "";
            toggleAddItem();
        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-12">
                        <div className="dashboard-header w-100 clearfix">
                            
                                { receiptState.receipts.length ?
                                    isEditMode ? 
                                        <form className="form-inline float-left" onSubmit={(e) => e.preventDefault()}>
                                            <div className="form-group">
                                                <input type="text" className="form-control" defaultValue={receiptState.receipts[0].label} placeholder="Label your receipt" ref={receiptLabel}/>
                                            </div>
                                            <div className="form-group">
                                                <input type="date" className="form-control" defaultValue={moment(receiptState.receipts[0].date).format("YYYY-MM-DD")} placeholder="Select date" ref={receiptDate} />
                                            </div>
                                            <span className="badge bg-danger text-white mt-2 ml-2">Edit Mode</span>
                                        </form>
                                    : 
                                    <h3 className="float-left receipt-label">
                                        <span>{receiptState.receipts[0].label}</span>
                                        <span className="badge bg-secondary text-white ml-2">{moment(receiptState.receipts[0].date).format("M/DD/YYYY")}</span>
                                    </h3>
                                : ""}
                            
                            <h3 className="float-right"> 
                                { isEditMode ? 
                                    <button className="btn btn-primary" onClick={() => saveReceipt()}>
                                        <i className="fas fa-save"></i>
                                    </button>
                                    :
                                    <a className="btn btn-secondary" href={`/receipt/${receiptId}/edit`}>
                                        <i className="fas fa-pencil-alt"></i>
                                    </a>
                                }
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

             <div className={ isEditMode ? "container receipt-edit-mode" : "container" }>
                <div className="row">
                    <div className="col-xs-12 col-md-1 col-lg-3 p-0">
                        <PayersList receiptId={receiptId} loadReceipt={loadReceipt} isEditMode={isEditMode}/>
                    </div>
                    <div className="col-xs-12 col-md-11 col-lg-5 p-0">
                        <div className="receipt">
                        <div className="receipt-body">
                            <table className="w-100 table">

                                {isEditMode ? 

                                    <tbody>
                                        {receiptState.receipts.length ? receiptState.receipts[0].Items.map(item => {
                                            return <ReceiptItemEdit key={item.id} item={item} isTotalItem={false} loadReceipt={loadReceipt} />
                                        }) : ""}

                                        {addItem ?
                                            <tr className="receipt-item">
                                                <td className="receipt-item-label text-left">
                                                    <input className="form-control" type="text" ref={itemName}/>
                                                    <p className="mt-2">
                                                        <button className="btn btn-secondary btn-sm mr-1" onClick={() => addNewItem()}>Save</button>
                                                    </p>
                                                </td>
                                                <td className="receipt-item-price text-right"><input className="form-control" type="text" ref={itemPrice}/></td>

                                            </tr>
                                        : "" }

                                        <tr className="receipt-item">
                                            <td className="receipt-item-label text-left"><button className="btn btn-sm btn-secondary" onClick={toggleAddItem}>Add Item</button></td>
                                            <td className="receipt-item-price text-right"></td>
                                        </tr>

                                        {receiptState.receipts.length ? 
                                            <ReceiptItemEdit 
                                                item={{ name: "Subtotal",  price: receiptState.receipts[0].subtotal, id: receiptState.receipts[0].id }}
                                                isTotalItem={true}
                                                loadReceipt={loadReceipt}
                                            />
                                        : ""}
                                        {receiptState.receipts.length ? 
                                            <ReceiptItemEdit 
                                                item={{ name: "Tax", price: receiptState.receipts[0].tax, id: receiptState.receipts[0].id }}
                                                isTotalItem={true}
                                                subTotal={receiptState.receipts[0].subtotal}
                                                loadReceipt={loadReceipt}
                                            />
                                        : ""}
                                        {receiptState.receipts.length ? 
                                            <ReceiptItemEdit 
                                                item={{ name: "Tip", price: receiptState.receipts[0].tip, id: receiptState.receipts[0].id }} 
                                                isTotalItem={true}
                                                subTotal={receiptState.receipts[0].subtotal}
                                                loadReceipt={loadReceipt}
                                            />
                                        : ""}
                                        {receiptState.receipts.length ? 
                                            <ReceiptItemEdit  
                                                item={{ name: "Total", price: receiptState.receipts[0].total, id: receiptState.receipts[0].id }} 
                                                isTotalItem={true}
                                                loadReceipt={loadReceipt}
                                            />
                                        : "<tr><td></td></tr>" }
                                    </tbody>

                                :

                                    <tbody>
                                        {receiptState.receipts.length ? receiptState.receipts[0].Items.map(item => {
                                            return <ReceiptItem key={item.id} item={item} isTotalItem={false}  />
                                        }) : ""}
                                        
                                        {receiptState.receipts.length ? 
                                            <ReceiptItem 
                                                item={{ name: "Subtotal",  price: receiptState.receipts[0].subtotal, receiptId: receiptState.receipts[0].id }}
                                                isTotalItem={true} 
                                            />
                                        : ""}
                                        {receiptState.receipts.length ? 
                                            <ReceiptItem 
                                                item={{ name: "Tax", price: receiptState.receipts[0].tax, id: receiptState.receipts[0].id }}
                                                isTotalItem={true} 
                                                subTotal={receiptState.receipts[0].subtotal}
                                            />
                                        : ""}
                                        {receiptState.receipts.length ? 
                                            <ReceiptItem 
                                                item={{ name: "Tip", price: receiptState.receipts[0].tip, id: receiptState.receipts[0].id }} 
                                                isTotalItem={true}
                                                subTotal={receiptState.receipts[0].subtotal} 
                                            />
                                        : ""}
                                        {receiptState.receipts.length ? 
                                            <ReceiptItem 
                                                item={{ name: "Total", price: receiptState.receipts[0].total, id: receiptState.receipts[0].id }} 
                                                isTotalItem={true} 
                                            />
                                        : "<tr><td></td></tr>" }
                                    </tbody>

                                }


                            </table>
                        </div>
                    </div>
                    </div>
                    <div className="col-xs-12 col-lg-4">
                        <Breakdown receipt={receiptState.receipts[0]} />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Receipt;