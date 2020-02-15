import React, {useState} from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API"

function PayerList(props) {

    const [receiptState, receiptStateDispatch] = useReceiptContext();

    const [addPayer, setAddPayer] = useState(false);

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
        const { name, value } = e.target;
        API.createPayer({ [name]: value, receiptId: props.receiptId })
        .then(_ => props.loadReceipt(props.receiptId))
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
                        <input type="text" name="name" className="form-control" placeholder="Payer Name" />
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