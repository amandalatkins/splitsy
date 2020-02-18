import React from "react";
import TheModal from "../Modal/index";

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

      <ul className="nav">
        <li className="nav-item dropdown">
          <TheModal buttonLabel="Sign Up" className="signUp">
            Sign Up
          </TheModal>
        </li>
        <li>
          <TheModal buttonLabel="Login" className="login">
            Login
          </TheModal>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
