import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./Header.css";
import logo from "../../components/image/logo.png";
import Navigation from "../Navigation/Navigation.js";
import { removeToken, getToken, getUserInfo } from "../../utils/auth.js";
import { clearCart } from "../../Redux/CartSlice.js";
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getToken();
      if (token) {
        try {
          const userInfo = await getUserInfo(token);
          setUserInfo(userInfo);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleSignOut = async () => {
    const token = getToken();
    if (token) {
      try {
        const cartItems = JSON.parse(localStorage.getItem(`cartItems_${token}`)) || [];

        for (const item of cartItems) {
          await axios.patch('/api/update-stock', {
            id: item.id,
            color: item.color,
            amount: item.quantity
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }

        localStorage.removeItem(`cartItems_${token}`);
        removeToken();
        dispatch(clearCart());
        navigate('/register');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  return (
    <header className="header">    
      <img className="logo" src={logo} />
      <div className="aaa">
        <Navigation />
        <div className="user-info">
          <span>{userInfo.username} ({userInfo.email})</span>
        </div>
        <div className="sign_out-button">
          <button className="sign_out" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    </header>
  );
}

export default Header;