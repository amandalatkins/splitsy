import React, {useState} from "react";
import { useReceiptContext } from "../../utils/ReceiptState";

function PayerList(props) {

    const [state, dispatch] = useReceiptContext();

    const [addPayer, setAddPayer] = useState(false);

    function toggleAddPayer() {
        setAddPayer(!addPayer);
    }

    return (

        <ul className="list-group payer-list">

            {state.receipts.length ? state.receipts[0].Payers.map(payer => {
                return <li 
                    key={payer.id}
                    className={props.currentPayer === payer.id ? "list-group-item selected" : "list-group-selected"} 
                    onClick={props.selectPayer}
                >
                    {payer.name}
                </li>
            }) : ""}

            {addPayer ?
                <li>
                    <form onSubmit={props.savePayer}>
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