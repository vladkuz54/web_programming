import React from "react";
import Footer from "./containers/Footer/Footer.js";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./containers/Home/Home.js";
import Catalog from "./containers/Catalog/Catalog.js";
import ItemPage from "./containers/ItemPage/ItemPage.js";
import Cart from "./containers/Cart/Cart.js";
import CheckOut from "./containers/CheckOut/CheckOut.js";
import SuccessPage from "./containers/CheckOut/SuccessPage.js";
import Register from "./containers/Register/Register.js";
import Login from "./containers/Login/Login.js";
import PrivateRoute from "./components/PrivateRoute.js";

function App() {

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
          <Route path="/catalog/:id" element={<PrivateRoute><ItemPage /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckOut /></PrivateRoute>} />
          <Route path="/success" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;