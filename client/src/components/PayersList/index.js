import React, {useState, useRef} from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API"

function PayerList(props) {

    const [receiptState, receiptStateDispatch] = useReceiptContext();

    const [addPayer, setAddPayer] = useState(false);

    const nameInput = useRef();

    function toggleAddPayer() {
        setAddPayer(!addPayer);
    }

    function selectPayer(id) {
        console.log("setting payer");
        if (id === receiptState.currentPayer) {
            receiptStateDispatch({ type: "setCurrentPayer", payerId: null });
        } else {
            receiptStateDispatch({ type: "setCurrentPayer", payerId: id });
        }
    }

    function savePayer(e) {
        e.preventDefault();
        API.createPayer({ name: nameInput.current.value, ReceiptId: props.receiptId })
        .then(newPayer => {
            console.log(newPayer);
            receiptStateDispatch({ type: "loadSingleReceipt", receipts: receiptState.receipts })
        })
        .catch(err => console.log(err));
    }

    return (

        <ul className="list-group payer-list">

            {receiptState.receipts.length ? receiptState.receipts[0].Payers.map(payer => {
                return <li 
                    key={payer.id}
                    className={receiptState.currentPayer === payer.id ? "list-group-item selected" : "list-group-item"} 
                    onClick={() => selectPayer(payer.id)}
                >
                    {payer.name}
                </li>
            }) : ""}

            {addPayer ?
                <li className="list-group-item">
                    <form onSubmit={savePayer}>
                        <input type="text" name="name" className="form-control" placeholder="Payer Name" ref={nameInput}/>
                        <button type="submit" className="btn btn-sm btn-secondary">Save</button>
                    </form>
                </li>
            : "" }

            <li className="list-group-item add-payer">
                <button className="btn btn-secondary" onClick={toggleAddPayer}>
                    <i className="fas fa-plus" aria-hidden="true"></i> Add Payer
                </button>
            </li>

        </ul>

    );

}

export default PayerList;