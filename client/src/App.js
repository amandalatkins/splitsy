import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ReceiptProvider } from "./utils/ReceiptState";
import { UserAuthProvider } from "./utils/UserAuthState";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Receipt from "./pages/Receipt";
import NoMatch from "./pages/NoMatch";

import NavBar from "./components/NavBar";
// import Footer from "./components/Footer";

function App() {
  return (
	  <UserAuthProvider>
		<ReceiptProvider >
			<Router>
				<div>
				<NavBar />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/home" component={Home} />
					<PrivateRoute path="/dashboard" component={Dashboard} />
					<PrivateRoute exact path="/receipt/:id" component={Receipt} />
					<PrivateRoute exact path="/receipt/:id/:edit" component={Receipt} />
					<Route component={NoMatch} />
				</Switch>
				{/* <Footer /> */}
				</div>
			</Router>
    	</ReceiptProvider>
	</UserAuthProvider>
  );
}

export default App;
