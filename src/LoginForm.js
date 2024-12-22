import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha"; // 변경된 부분
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";

axios.defaults.withCredentials = true;

class LoginForm extends Component {
  recaptchaRef = React.createRef(); // 새로운 recaptchaRef 추가

  join = () => {
    const joinEmail = this.joinEmail.value;
    const joinName = this.joinName.value;
    const joinPw = this.joinPw.value;
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const regExp2 = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
  
    if (!joinEmail) {
      alert("Please enter your email address.");
      this.joinEmail.focus();
      return;
    } else if (!joinEmail.match(regExp)) {
      alert("Please enter it according to the email format.");
      this.joinEmail.value = "";
      this.joinEmail.focus();
      return;
    } else if (!joinName) {
      alert("Please enter your name.");
      this.joinName.focus();
      return;
    } else if (!joinPw) {
      alert("Please enter your password.");
      this.joinPw.focus();
      return;
    } else if (!joinPw.match(regExp2)) {
      alert("Please enter the password as 8 to 16 digits including numbers, letters, and special characters.");
      this.joinPw.value = "";
      this.joinPw.focus();
      return;
    }

    const send_param = {
      email: this.joinEmail.value,
      name: this.joinName.value,
      password: this.joinPw.value,
    };

    axios
      .post(`${process.env.REACT_APP_DOMAIN_BACKEND}/member/Join`, send_param)
      .then((returnData) => {
        if (returnData.data.message) {
          alert(returnData.data.message);
          if (returnData.data.dupYn === "1") {
            this.joinEmail.value = "";
            this.joinEmail.focus();
          } else {
            this.joinEmail.value = "";
            this.joinName.value = "";
            this.joinPw.value = "";
          }
        } else {
          alert("Failed to sign up");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  login = () => {
    const loginEmail = this.loginEmail.value;
    const loginPw = this.loginPw.value;

    if (!loginEmail) {
      alert("Please enter your email address.");
      this.loginEmail.focus();
      return;
    } else if (!loginPw) {
      alert("Please enter your password..");
      this.loginPw.focus();
      return;
    }

    const send_param = {
      email: this.loginEmail.value,
      password: this.loginPw.value,
    };

    axios
      .post(`${process.env.REACT_APP_DOMAIN_BACKEND}/member/login`, send_param,
      {
        headers: {
          "Content-Type": "application/json", // 요청 데이터 형식 명시
        },
        withCredentials: true, // CORS로 쿠키를 주고받기 위한 설정
      }
    )
      .then((returnData) => {
        if (returnData.data.message) {
          $.cookie("login_id", returnData.data._id, { expires: 1 });
          $.cookie("login_email", returnData.data.email, { expires: 1 });
          alert(returnData.data.message);
          window.location.reload();
        } else {
          alert(returnData.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onRecaptchaChange = (value) => {
    console.log("Captcha value:", value); // 토큰을 로그로 확인

    // 서버로 토큰을 전송 (예시)
    fetch("/verify-recaptcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recaptchaToken: value, // 토큰 사용
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
      })
      .catch((error) => {
        console.error("Error verifying reCAPTCHA:", error);
      });
  };

  render() {
    const formStyle = {
      margin: 50,
    };
    const buttonStyle = {
      marginTop: 10,
    };

    return (
      <Form style={formStyle}>
        <Form.Group controlId="joinFormEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            maxLength="100"
            ref={(ref) => (this.joinEmail = ref)}
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="joinFormName">
          <Form.Label>name</Form.Label>
          <Form.Control
            type="text"
            maxLength="20"
            ref={(ref) => (this.joinName = ref)}
            placeholder="name"
          />
        </Form.Group>

        <Form.Group controlId="joinFormPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            maxLength="64"
            ref={(ref) => (this.joinPw = ref)}
            placeholder="Password"
          />
        </Form.Group>

        <Button
          style={buttonStyle}
          onClick={this.join}
          variant="primary"
          type="button"
          className="btn-block"
        >
          Sign up
        </Button>

        <Form.Group controlId="loginFormEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            maxLength="100"
            ref={(ref) => (this.loginEmail = ref)}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group controlId="loginFormPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            maxLength="20"
            ref={(ref) => (this.loginPw = ref)}
            placeholder="Password"
          />
        </Form.Group>

        {/* ReCaptcha 변경 */}
        <ReCAPTCHA
          sitekey="6LfGieAUAAAAAJSOoqXS5VQdT_e5AH8u0n2e1PDb"
          onChange={this.onRecaptchaChange}
        />

        <Button
          style={buttonStyle}
          onClick={this.login}
          variant="primary"
          type="button"
          className="btn-block"
        >
          Login
        </Button>
      </Form>
    );
  }
}

export default LoginForm;
