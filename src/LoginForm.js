import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha"; // 변경된 부분
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

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
      alert("이메일 주소를 입력해주세요.");
      this.joinEmail.focus();
      return;
    } else if (!joinEmail.match(regExp)) {
      alert("이메일 형식에 맞게 입력해주세요.");
      this.joinEmail.value = "";
      this.joinEmail.focus();
      return;
    } else if (!joinName) {
      alert("이름을 입력해주세요.");
      this.joinName.focus();
      return;
    } else if (!joinPw) {
      alert("비밀번호를 입력해주세요.");
      this.joinPw.focus();
      return;
    } else if (!joinPw.match(regExp2)) {
      alert("비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");
      this.joinPw.value = "";
      this.joinPw.focus();
      return;
    }

    const send_param = {
      headers,
      email: this.joinEmail.value,
      name: this.joinName.value,
      password: this.joinPw.value,
    };

    axios
      .post("http://localhost:8080/member/join", send_param)
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
          alert("회원가입 실패");
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
      alert("이메일 주소를 입력해주세요.");
      this.loginEmail.focus();
      return;
    } else if (!loginPw) {
      alert("비밀번호를 입력해주세요.");
      this.loginPw.focus();
      return;
    }

    const send_param = {
      headers,
      email: this.loginEmail.value,
      password: this.loginPw.value,
    };

    axios
      .post("http://localhost:8080/member/login", send_param)
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
          회원가입
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
          로그인
        </Button>
      </Form>
    );
  }
}

export default LoginForm;
