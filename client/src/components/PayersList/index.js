import React, {useState} from "react";
import { useReceiptContext } from "../utils/ReceiptState";

function PayerList(props) {

    const [state, dispatch] = useReceiptContext();

    const [addPayer, setAddPayer] = useState(false);

    function addPayer() {
        setAddPayer(!addPayer);
    }

    <ul class="list-group payer-list">

        {state.receipts[0].Payers.map(payer => {
            <li 
                key={payer.id}
                className={props.currentPayer === payer.id ? "list-group-item selected" : "list-group-selected"} 
                onClick={props.selectPayer}
            >
                {payer.name}
            </li>
        })}

        {addPayer ?
            <li>
                <form onSubmit={savePayer}>
                    <input type="text" name="name" className="form-control" placeholder="Payer Name" />
                    <button type="submit" class="btn btn-sm btn-secondary" onClick={props.savePayer}>Save</button>
                </form>
            </li>
        : "" }

        <li class="list-group-item add-payer">
            <button class="btn btn-secondary" onClick={addPayer}>
                <i class="fas fa-plus" aria-hidden="true"></i> Add Payer
            </button>
        </li>
    </ul>

}

export default PayerList;