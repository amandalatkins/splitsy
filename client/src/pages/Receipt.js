import React, { useEffect, useState } from "react";
import { useReceiptContext } from "../utils/ReceiptState";

function Receipt(props) {

    const [state, dispatch] = useReceiptContext();

    const receiptId = props.match.params.id;

    useEffect(() => {
        loadReceipt();
        loadPayers();
    }, []);

    function loadReceipt() {
        API.getReceiptById(receiptId)
        then(receipt => dispatch({ type: "loadReceipts", receipts: receipt.data, isEditMode: false }))
        .catch(err => console.log(err));
    }

    function toggleEditState() {
        dispatch({ type: "toggleEditState" });
    }

    function savePayer(e) {
        const { name, value } = e.target;
        API.addPayer({ [name]: value, receiptId })
        .then(_ => loadReceipt())
        .catch(err => console.log(err));
    }

    return (
        <div>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-12">
                        <div className="dashboard-header w-100 clearfix">
                            <h3 className="float-left">
                                {state.receipts[0].name + " " + state.receipts[0].date}
                                { editState ? <span class="badge bg-danger text-white mt-2 ml-2">Edit Mode</span> : ""}
                            </h3>
                            <h3 className="float-right"> 
                                { state.isEditMode ? 
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

            <div class={ state.isEditMode ? "container receipt-edit-mode" : "container" }>
                <div class="row">
                    <div class="col-xs-12 col-md-1 col-lg-3 p-0">
                        <PayersList savePayer={savePayer}/>
                    </div>
                    <div class="col-xs-12 col-md-11 col-lg-5 p-0">
                        <div class="receipt">
                        <div class="receipt-body">
                            <table class="w-100 table">
                                <tbody>
                                    {state.receipts[0].Items.map(item => {
                                        <ReceiptItem key={item.id} isEditMode={state.isEditMode} item={item} isTotalItem={false}  />
                                    })}
                                    
                                    <ReceiptItem 
                                        isEditMode={state.isEditMode} 
                                        item={{ name: "Subtotal",  price: state.receipts[0].total, receiptId: state.receipts[0].id }}
                                        isTotalItem={true} 
                                    />
                                    <ReceiptItem 
                                        isEditMode={state.isEditMode} 
                                        item={{ name: "Tax", price: state.receipts[0].tax, id=item.id }}
                                        isTotalItem={true} 
                                    />
                                    <ReceiptItem 
                                        isEditMode={state.isEditMode} 
                                        item={{ name: "Tip", price: state.receipts[0].total, id=item.id }} 
                                        isTotalItem={true} 
                                    />

                                    <ReceiptItem 
                                        isEditMode={state.isEditMode} 
                                        item={{ name: "Total", price: state.receipts[0].total, id=item.id }} 
                                        isTotalItem={true} 
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                    <div class="col-xs-12 col-lg-4">
                        <Breakdown receipt={state.receipts[0]} />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Receipt;