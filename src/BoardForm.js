import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;

class BoardRow extends Component {
  render() {
    return (
      <tr>
        <td>
          <a
            href={`/board/detail/${this.props._id}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/board/detail/${this.props._id}`;
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
    boardList: [],
  };

  componentDidMount() {
    this.getBoardList();
  }

  getBoardList = () => {
    const idFromCookie = $.cookie("login_id");

    axios
      .post(
        `${process.env.REACT_APP_LOCAL_BACKEND}/board/getBoardList`,
        { _id: idFromCookie },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((returnData) => {
        let boardList;
        if (returnData.data.list.length > 0) {
          const board = returnData.data.list;
          boardList = board.map((item) => (
            <BoardRow
              key={item._id}
              _id={item._id}
              createdAt={item.createdAt}
              title={item.title}
            />
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
        console.error("게시글 목록 가져오기 실패:", err);
      });
  };

  render() {
    const divStyle = {
      margin: 50,
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
        <div style={{ margin: "20px 50px" }}>
          <button onClick={() => (window.location.href = "/write")}>
            글 작성
          </button>
        </div>
      </div>
    );
  }
}

export default BoardForm;
