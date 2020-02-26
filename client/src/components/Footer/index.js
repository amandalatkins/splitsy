import React, { useState, useEffect } from "react";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";
import { useReceiptContext } from "../../utils/ReceiptState";
import { useUserAuthContext } from "../../utils/UserAuthState";
import moment from "moment";
import API from "../../utils/API";

function Footer() {
  const [userAuth, setUserAuth] = useUserAuthContext();
  const [receiptState, setReceiptState] = useState();

  function handleLogOut() {
    setUserAuth({ type: "logOut" });
  }

  return (
    <footer className="mt-auto">
        <a href="https://github.com/amandalatkins/splitsy" className="text-white">View on Github</a>
    </footer>
  );
}

export default Footer;
