import React from "react";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";

function NavBar() {
  // add functionality to show percentage of receipt filled

  return (
    <nav className="navbar navbar-dark">
      <a className="navbar-brand" href="/home">
        Splitsy
      </a>

      <ol className="breadcrumb mr-auto">
        <li className="breadcrumb-item active">
          <a href="/dashboard">Your Dashboard</a>
        </li>
      </ol>

        <RegisterModal buttonLabel="Register" className="Register">
          Register{" "}
        </RegisterModal>
        &nbsp;&nbsp;
        <LoginModal buttonLabel="Login" className="Login">
          Login
        </LoginModal>
    </nav>
  );
}

export default NavBar;
