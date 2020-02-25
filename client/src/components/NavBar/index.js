import React, { useState, useEffect } from "react";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";
import { useReceiptContext } from "../../utils/ReceiptState";
import { useUserAuthContext } from "../../utils/UserAuthState";
import moment from "moment";
import API from "../../utils/API";

function NavBar() {
  const [userAuth, setUserAuth] = useUserAuthContext();
  const [receiptState, setReceiptState] = useState();

  function handleLogOut() {
    setUserAuth({ type: "logOut" });
  }

  // useEffect(() => {
  //   loadReceiptId();
  // }, []);

  // function loadReceiptId() {
  //   const splitUrl = window.location.pathname.split("/");
  //   console.log(splitUrl);
  //   const receiptId = splitUrl[2];
  //   API.getReceiptById(receiptId).then(res => {
  //     setReceiptState(res.data);
  //   });
  // }

  return (
    <nav className="navbar navbar-dark">
      <a className="navbar-brand" href="/home">
        Splitsy
      </a>

      {userAuth.isLoggedIn ? (
        window.location.pathname === "/dashboard" ? (
          <ol className="breadcrumb mr-auto">
            <li className="breadcrumb-item active">
              <a href="/dashboard">
                {userAuth.user.firstName
                  ? userAuth.user.firstName
                  : userAuth.user.userName}
                's Dashboard
              </a>
            </li>
          </ol>
        ) : (
          <ol className="breadcrumb mr-auto">
            <li className="breadcrumb-item">
              <a href="/dashboard">
                {userAuth.user.firstName
                  ? userAuth.user.firstName
                  : userAuth.user.userName}
                's Dashboard
              </a>
            </li>
            {/* <li className="breadcrumb-item active">
              <a href="/dashboard" onClick={e => e.preventDefault()}>
                {receiptState
                  ? receiptState.label +
                    " " +
                    moment(receiptState.date).format("M/DD")
                  : ""}
              </a>
            </li> */}
          </ol>
        )
      ) : (
        ""
      )}

      {userAuth.isLoggedIn ? (
        <button
          className="btn btn-sm text-white"
          onClick={() => handleLogOut()}
        >
          Log Out
        </button>
      ) : (
        <div className="loginButtons">
          <RegisterModal buttonLabel="Register" />
          {/* Register{" "}
        </RegisterModal> */}
          <LoginModal buttonLabel="Login" />
          {/* Login
        </LoginModal> */}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
