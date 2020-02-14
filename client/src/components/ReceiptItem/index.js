import React, { useEffect, useState } from "react";
import { useReceiptContext } from "../utils/ReceiptState";

function ReceiptItem(props) {

    const [state, dispatch] = useReceiptContext();

    // const { item, isTotalItem } = props;

    const [itemEditState, setItemEditState] = useState(false);

    // function toggleItemEditState() {
    //     setItemEditState(!itemEditState);
    // }

    return (
        <tr><td></td></tr>
        // <tr className="receipt-item">
        // { state.isEditMode ? (
            
        //         <td className="receipt-item-label text-left"><input type="text" className="form-control" value="Salad"/>
        //             <p className="mt-2">
        //                 <button className="btn btn-secondary btn-sm mr-1">Save</button>
        //                 <button className="btn btn-danger btn-sm">Remove</button>
        //             </p>
        //             </td>
        //         <td className="receipt-item-price text-right"><input type="text" className="form-control" value="$14.99"/></td>
        //     </tr>
        //  ) : (
        //     <td className="receipt-item-label text-left">
        //         <p>Burger</p>
        //         <!-- <span className="badge bg-red text-white">Amanda</span> -->
        //     </td>
        //     <td className="receipt-item-price text-right">$13.99</td>
        
        //  )}

    );

}

export default ReceiptItem;