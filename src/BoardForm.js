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
        `${process.env.REACT_APP_DOMAIN_BACKEND}/board/getBoardList`,
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
              <td colSpan="2">The post you created does not exist.</td>
            </tr>
          );
          this.setState({
            boardList: boardList,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to get a list of posts:", err);
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
                <th>date</th>
                <th>The title of the article</th>
              </tr>
            </thead>
            <tbody>{this.state.boardList}</tbody>
          </Table>
        </div>
        <div style={{ margin: "20px 50px" }}>
          <button onClick={() => (window.location.href = "/write")}>
          Writing
          </button>
        </div>
      </div>
    );
  }
}

export default BoardForm;
