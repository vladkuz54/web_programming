import React from "react";
import Footer from "./containers/Footer/Footer.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./containers/Home/Home.js";
import Catalog from "./containers/Catalog/Catalog.js";
import ItemPage from "./containers/ItemPage/ItemPage.js";
import Cart from "./containers/Cart/Cart.js";
import CheckOut from "./containers/CheckOut/CheckOut.js";
import SuccessPage from "./containers/CheckOut/SuccessPage.js";
import Register from "./containers/Register/Register.js";
import Login from "./containers/Login/Login.js";

function App() {

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ItemPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;