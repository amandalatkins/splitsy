import React, { useEffect } from "react";
import { useReceiptContext } from "../utils/ReceiptState";
import API from "../utils/API";
import PayersList from "../components/PayersList";
import ReceiptItem from "../components/ReceiptItem";
import Breakdown from "../components/Breakdown";

function Receipt(props) {

    const [receiptState, receiptStateDispatch] = useReceiptContext();
    const receiptId = props.match.params.id;

    useEffect(() => {
        console.log('use effect');
        loadReceipt(receiptId);
    }, []);

    function loadReceipt(receiptId) {
        API.getReceiptById(receiptId)
        .then(receipt => {
            receiptStateDispatch({ type: "loadReceipts", receipts: [receipt.data], isEditMode: false })
        })
        .catch(err => console.log(err));
    }

    function toggleEditState() {
        receiptStateDispatch({ type: "toggleEditState" });
    }

    return (
        <div>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-12">
                        <div className="dashboard-header w-100 clearfix">
                            <h3 className="float-left">
                                {receiptState.receipts.length ? receiptState.receipts[0].label + " " + receiptState.receipts[0].date : ""}
                                { receiptState.isEditMode ? <span className="badge bg-danger text-white mt-2 ml-2">Edit Mode</span> : ""}
                            </h3>
                            <h3 className="float-right"> 
                                { receiptState.isEditMode ? 
                                    <button className="btn btn-primary" onClick={() => toggleEditState()}>
                                        <i className="fas fa-save"></i>
                                    </button>
                                    :
                                    <button className="btn btn-secondary" onClick={() => toggleEditState()}>
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>
                                }
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

             <div className={ receiptState.isEditMode ? "container receipt-edit-mode" : "container" }>
                <div className="row">
                    <div className="col-xs-12 col-md-1 col-lg-3 p-0">
                        <PayersList receiptId={receiptId} loadReceipt={loadReceipt} />
                    </div>
                    <div className="col-xs-12 col-md-11 col-lg-5 p-0">
                        <div className="receipt">
                        <div className="receipt-body">
                            <table className="w-100 table">
                                <tbody>
                                    {receiptState.receipts.length ? receiptState.receipts[0].Items.map(item => {
                                        return <ReceiptItem key={item.id} isEditMode={receiptState.isEditMode} item={item} isTotalItem={false}  />
                                    }) : ""}
                                    
                                    {receiptState.receipts.length ? 
                                        <ReceiptItem 
                                            isEditMode={receiptState.isEditMode} 
                                            item={{ name: "Subtotal",  price: receiptState.receipts[0].total, receiptId: receiptState.receipts[0].id }}
                                            isTotalItem={true} 
                                        />
                                    : ""}
                                    {receiptState.receipts.length ? 
                                        <ReceiptItem 
                                            isEditMode={receiptState.isEditMode} 
                                            item={{ name: "Tax", price: receiptState.receipts[0].tax, id: receiptState.receipts[0].id }}
                                            isTotalItem={true} 
                                        />
                                    : ""}
                                    {receiptState.receipts.length ? 
                                        <ReceiptItem 
                                            isEditMode={receiptState.isEditMode} 
                                            item={{ name: "Tip", price: receiptState.receipts[0].total, id: receiptState.receipts[0].id }} 
                                            isTotalItem={true} 
                                        />
                                    : ""}
                                    {receiptState.receipts.length ? 
                                        <ReceiptItem 
                                            isEditMode={receiptState.isEditMode} 
                                            item={{ name: "Total", price: receiptState.receipts[0].total, id: receiptState.receipts[0].id }} 
                                            isTotalItem={true} 
                                        />
                                    : "<tr><td></td></tr>" }
                                </tbody>
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