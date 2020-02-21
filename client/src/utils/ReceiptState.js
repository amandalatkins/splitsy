import React, { createContext, useReducer, useContext } from "react";

const ReceiptContext = createContext();
const { Provider } = ReceiptContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "loadReceipts":
      return {
        ...state,
        receipts: action.receipts
      };
    case "loadReceiptsAndPayer":
      return {
        ...state,
        currentPayer: action.payerId,
        receipts: action.receipts
      };
    case "setCurrentPayer":
      return {
        ...state,
        currentPayer: action.payerId
      };
    case "setItems":
      return {
        ...state,
        items: action.items
      };
    case "setPayers":
      return {
        ...state,
        payers: action.payers
      };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

const defaultState = {
  currentPayer: null,
  currentItemEdit: null,
  receipts: [],
  items: [],
  payers: []
};

const ReceiptProvider = ({ value = defaultState, ...props }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <Provider value={[state, dispatch]} {...props} />;
};

const useReceiptContext = () => {
  return useContext(ReceiptContext);
};

export { ReceiptProvider, useReceiptContext };
