import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // BrowserRouter 추가
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

const root = ReactDOM.createRoot(document.querySelector("#container"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Header />
        <Body />
        <Footer /> 
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
