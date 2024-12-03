import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const BoardDetail = () => {
  const { _id } = useParams(); // useParams로 URL 파라미터 가져오기
  const [board, setBoard] = useState(null);

  useEffect(() => {
    if (_id) {
      getDetail(_id);
    } else {
      window.location.href = "/";
    }
  }, [_id]);

  const getDetail = (_id) => {
    axios
      .get(`${process.env.REACT_APP_DOMAIN_BACKEND}/board/detail/${_id}`)
      .then((returnData) => {
        if (returnData.data.board) {
          setBoard(returnData.data.board);
        } else {
          alert("Failed to look up text details");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error checking text details");
      });
  };

  const deleteBoard = (_id) => {
    const send_param = { _id };
    if (window.confirm("Are you sure you want to delete it?")) {
      axios
        .post(`${process.env.REACT_APP_DOMAIN_BACKEND}/board/delete`, send_param)
        .then(() => {
          alert("Your post has been deleted.");
          window.location.href = "/";
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to delete text");
        });
    }
  };

  if (!board) {
    return <div style={{ margin: 50 }}>Loading...</div>;
  }

  return (
    <div style={{ margin: 50 }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{board.title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              dangerouslySetInnerHTML={{
                __html: board.content,
              }}
            ></td>
          </tr>
        </tbody>
      </Table>
      <div>
        <NavLink
          to={`/boardWrite?title=${encodeURIComponent(board.title)}&content=${encodeURIComponent(board.content)}&_id=${_id}`}
        >
          <Button className="btn-block" style={{ marginBottom: 5 }}>
          Revise your writing
          </Button>
        </NavLink>
        <Button className="btn-block" onClick={() => deleteBoard(_id)}>
          Delete text
        </Button>
      </div>
    </div>
  );
};

export default BoardDetail;
