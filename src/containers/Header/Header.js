import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../components/image/logo.png";
import Navigation from "../Navigation/Navigation.js";
import { removeToken } from "../../utils/auth.js";

function Header() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.filter(user => user.email !== currentUser.email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem(`cart_${currentUser.email}`);
      localStorage.removeItem('currentUser');
      removeToken();
      navigate('/register');
    }
  };

  return (
    <header className="header">    
      <img className="logo" src={logo} />
      <div className="aaa">
        <Navigation />
        <div className="sign_out-button">
          <button className="sign_out" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    </header>
  );
}

export default Header;