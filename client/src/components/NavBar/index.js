import React from "react";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";
import { useReceiptContext } from "../../utils/ReceiptState";
import { useUserAuthContext } from "../../utils/UserAuthState";
import moment from "moment";

function NavBar() {
  // add functionality to show percentage of receipt filled

  const [receiptState] = useReceiptContext();

  const [userAuth, setUserAuth] = useUserAuthContext();

  function handleLogOut() {
    setUserAuth({ type: "logOut" });
  }

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
            <li className="breadcrumb-item active">
              <a href="/dashboard" onClick={e => e.preventDefault()}>
                {receiptState.receipts.length
                  ? receiptState.receipts[0].label +
                    " " +
                    moment(receiptState.receipts[0].date).format("M/DD")
                  : ""}
              </a>
            </li>
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
