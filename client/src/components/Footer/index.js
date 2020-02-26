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
    <footer className="text-white">
        <a href="https://github.com/amandalatkins/splitsy">View on Github</a>
        <br/>
        <small>Designed and developed by <a href="https://github.com/namrataffy" target="_blank">Arman Riahi</a> and <a href="https://github.com/amandalatkins" target="_blank">Amanda Atkins</a>.</small>
    </footer>
  );
}

export default Footer;
