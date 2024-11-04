import React from "react";
import Footer from "./containers/Footer/Footer.js";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./containers/Home/Home.js";
import Catalog from "./containers/Catalog/Catalog.js";
import ItemPage from "./containers/ItemPage/ItemPage.js";
import Cart from "./containers/Cart/Cart.js";
import CheckOut from "./containers/CheckOut/CheckOut.js";
import SuccessPage from "./containers/CheckOut/SuccessPage.js";


function App() {

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ItemPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;