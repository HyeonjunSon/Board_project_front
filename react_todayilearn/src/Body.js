import React, { Component } from "react";
import LoginForm from "./LoginForm";
import BoardForm from "./BoardForm";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail";
import MypageForm from "./MypageForm";
import {  Routes, Route } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";

class Body extends Component {
  render() {
    const isLoggedIn = $.cookie("login_id");
    return (
      <div>
        <Routes>
          <Route path="/" element={isLoggedIn ? <BoardForm /> : <LoginForm />} />
          <Route path="/mypageForm" element={<MypageForm />} />
          <Route path="/boardWrite" element={<BoardWriteForm />} />
          <Route path="/board/detail/:_id" element={<BoardDetail />} />
        </Routes>
      </div>
    );
  }
}

export default Body;
