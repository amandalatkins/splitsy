import React from "react";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";
import { useUserAuthContext } from "../../utils/UserAuthState";

function NavBar() {
  // add functionality to show percentage of receipt filled

  const [userAuth, setUserAuth] = useUserAuthContext();

  function handleLogOut() {
    setUserAuth({ type: "logOut" });
  }

  return (
    <nav className="navbar navbar-dark">
      <a className="navbar-brand" href="/home">
        Splitsy
      </a>

      { userAuth.isLoggedIn ?

        <ol className="breadcrumb mr-auto">
          <li className="breadcrumb-item active">
            <a href="/dashboard">{userAuth.user.firstName ? userAuth.user.firstName : userAuth.user.userName}'s Dashboard</a>
          </li>
        </ol>

      : ""  }

      { userAuth.isLoggedIn ?

        <button className="btn btn-sm text-white" onClick={() => handleLogOut()}>Log Out</button>

      :
      <div class="loginButtons">
        <RegisterModal buttonLabel="Register" />
          {/* Register{" "}
        </RegisterModal> */}
        <LoginModal buttonLabel="Login" />
          {/* Login
        </LoginModal> */}
      </div>
      }
    </nav>
  );
}

export default NavBar;
