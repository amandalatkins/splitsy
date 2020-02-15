import React from "react";

function NavBar() {
  // add functionality to show percentage of receipt filled

  return (
    <nav className="navbar navbar-dark">
        <a className="navbar-brand" href="#">Splitsy</a>

        <ol className="breadcrumb mr-auto">
            <li className="breadcrumb-item active"><a href="/dashboard">Your Dashboard</a></li>
        </ol>

        <ul className="nav">
            <li className="nav-item dropdown">
                <a className="nav-link text-white" href="#" id="navbarDropdown" data-toggle="modal" data-target="#loginModal">
                  Login/Register
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">Log Out</a>
                </div>
              </li>
          </ul>
      </nav>
  );
}

export default NavBar;
