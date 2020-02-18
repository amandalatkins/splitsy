import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserAuthContext } from '../utils/UserAuthState';

function PrivateRoute({ component: Component, ...rest }) {

  const [userAuth] = useUserAuthContext();
  
  return(
    <Route {...rest} render={props => (

      userAuth.isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
      
    )}
    />
  );
}

export default PrivateRoute;