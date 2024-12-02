import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardRow extends Component {
  render() {
    return (
      <tr>
        <td>
          <a
            href={`/board/detail/${this.props._id}`}
            onClick={(e) => {
              e.preventDefault(); // 기본 동작 방지
              window.location.href = `/board/detail/${this.props._id}`; // URL 변경 및 새로고침
            }}
          >
            {this.props.createdAt.substring(0, 10)}
          </a>
        </td>
        <td>
          <a
            href={`/board/detail/${this.props._id}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/board/detail/${this.props._id}`;
            }}
          >
            {this.props.title}
          </a>
        </td>
      </tr>
    );
  }
}

class BoardForm extends Component {
  state = {
    boardList: []
  };

  componentDidMount() {
    this.getBoardList();
  }

  handleWrite = () => {
    const send_param = {
      headers,
      title: "테스트 제목", // 임시 제목
      content: "테스트 내용", // 임시 내용
      _id: $.cookie("login_id"), // 작성자 ID
    };

    axios
      .post(process.env.REACT_APP_LOCAL_BACKEND + "/board/write", send_param)
      .then(() => {
        alert("글 작성 완료");
        this.handlePostWrite(); // 작성 후 목록 새로고침
      })
      .catch((err) => {
        console.log(err);
        alert("글 작성 실패");
      });
  };

  getBoardList = () => {
    const send_param = {
      headers,
      _id: $.cookie("login_id"),
    };
    axios
      .post(process.env.REACT_APP_LOCAL_BACKEND + "/board/getBoardList", send_param)
      .then((returnData) => {
        let boardList;
        if (returnData.data.list.length > 0) {
          const board = returnData.data.list;
          boardList = board.map((item) => (
            <BoardRow
              key={item._id} // MongoDB ID 사용
              _id={item._id}
              createdAt={item.createdAt}
              title={item.title}
            ></BoardRow>
          ));
          this.setState({
            boardList: boardList,
          });
        } else {
          boardList = (
            <tr>
              <td colSpan="2">작성한 게시글이 존재하지 않습니다.</td>
            </tr>
          );
          this.setState({
            boardList: boardList,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
 
  handlePostWrite = () => {
    this.getBoardList(); // 새로고침
  };

  render() {
    const divStyle = {
      margin: 50
    };

    return (
      <div>
        <div style={divStyle}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>날짜</th>
                <th>글 제목</th>
              </tr>
            </thead>
            <tbody>{this.state.boardList}</tbody>
          </Table>
        </div>
        {/* 글 작성 버튼 추가 */}
        <div style={{ margin: "20px 50px" }}>
          <button onClick={this.handleWrite}>글 작성</button>
        </div>
      </div>
    );
  }
}

export default BoardForm;
