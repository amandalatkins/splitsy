import React, { createContext, useReducer, useContext } from "react";

const UserAuthContext = createContext();
const { Provider } = UserAuthContext;

const reducer = (state, action) => {
    switch (action.type) {
        case "activeUser":
          return {
            isLoggedIn: true,
            user: action.user
          }
        case "logIn":
          localStorage.setItem('splitsyUser', JSON.stringify(action.user));
          return {
              isLoggedIn: true,
              user: action.user
          }
        case "logOut":
          localStorage.removeItem('splitsyUser');
          return {
            isLoggedIn: false,
            user: {}
          }
        default:
          throw new Error(`Invalid action type: ${action.type}`);
        }
}

var defaultState = {
  isLoggedIn: false,
  user: {}
}

if (localStorage.getItem('splitsyUser')) {

  var user = JSON.parse(localStorage.getItem('splitsyUser'));

  defaultState = {
    isLoggedIn: true,
    user
  }

}

const UserAuthProvider = ({ value = {} , ...props }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);
    return <Provider value={[state, dispatch]} {...props} />
}

const useUserAuthContext = () => {
    return useContext(UserAuthContext);
}

export { UserAuthProvider, useUserAuthContext };