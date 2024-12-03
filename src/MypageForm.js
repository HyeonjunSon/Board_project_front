import React from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;

const MypageForm = () => {
  const divStyle = {
    margin: 50
  };
  const marginBottom = {
    marginBottom: 5
  };
  return (
    <>
      <div style={divStyle}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>email</Form.Label>
          <Form.Control type="email" disabled value={$.cookie("login_email")} />
          <Form.Label>name</Form.Label>
          <Form.Control type="text" placeholder="Enter email" />
          <Form.Label>password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
          <Form.Label>new password</Form.Label>
          <Form.Control type="password" placeholder="Enter New Password" />
          <Form.Label>new password check</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter New Password Check"
          />
        </Form.Group>
        <Button variant="primary" className="btn-block" style={marginBottom}>
        Modifying membership information
        </Button>
        <Button variant="primary" className="btn-block">
        Membership Withdrawal
        </Button>
      </div>
    </>
  );
};

export default MypageForm;
