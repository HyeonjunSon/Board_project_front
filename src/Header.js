import React, { Component } from "react";
import { Navbar, Button, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class Header extends Component {
    state = {
      buttonDisplay: "none"
    };
  
    componentDidMount() {
      if ($.cookie("login_id")) {
        this.setState({
          buttonDisplay: "block"
        });
      } else {
        this.setState({
          buttonDisplay: "none"
        });
      }
    }
  
    logout = () => {
      axios
        .get(`${process.env.REACT_APP_DOMAIN_BACKEND}/member/login`, {
          headers
        })
        .then(returnData => {
          if (returnData.data.message) {
            $.removeCookie("login_id");
            alert("You're logged out!");
            window.location.href = "/";
          }
        });
    };
    render() {
      const buttonStyle = {
        margin: "0px 5px 0px 10px",
        display: this.state.buttonDisplay
      };
  
      return (
        <div>
          <Navbar>
            <Navbar.Brand href="/">Today I Learned</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              {/* <NavLink to="/mypage">
                <Button style={buttonStyle} variant="primary">
                  회원정보 수정
                </Button>
              </NavLink> */}
              <NavLink to="/">
                <Button style={buttonStyle} variant="primary">
                List of writings
                </Button>
              </NavLink>
              <NavLink to="/boardWrite">
                <Button style={buttonStyle} variant="primary">
                Writing
                </Button>
              </NavLink>
              <Button style={buttonStyle} onClick={this.logout} variant="primary">
              Sign out
              </Button>
            </Navbar.Collapse>
          </Navbar>
          <Image src="/img/main.png" fluid />
        </div>
      );
    }
  }
  
  export default Header;
