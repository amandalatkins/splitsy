import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ReceiptProvider } from "./utils/ReceiptState";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Receipt from "./pages/Receipt";
import NoMatch from "./pages/NoMatch";

// import Nav from "./components/Nav";
// import Footer from "./components/Footer";

function App() {
  return (
    <ReceiptProvider >
      <Router>
        <div>
          {/* <Nav /> */}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/receipt/:id" component={Receipt} />
            <Route component={NoMatch} />
          </Switch>
          {/* <Footer /> */}
        </div>
      </Router>
    </ReceiptProvider>
  );
}

export default App;
