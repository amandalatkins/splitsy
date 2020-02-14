import React, { createContext, useReducer, useContext } from "react";

const UserContext = createContext();
const { Provider } = UserContext;

const reducer = (state, action) => {
    switch (action.type) {
        case "loadUser":
          return {
              ...state,
              users: action.user
          }
        default:
          throw new Error(`Invalid action type: ${action.type}`);
        }
}

const UserProvider = ({ value = [] , ...props }) => {
    const [state, dispatch] = useReducer(reducer, { users: value });
    return <Provider value={[state, dispatch]} {...props} />
}

const useUserContext = () => {
    return useContext(UserContext);
}

export { UserProvider, useUserContext };