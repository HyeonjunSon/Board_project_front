import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

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
      .get(`http://localhost:8080/board/detail/${_id}`, { headers })
      .then((returnData) => {
        if (returnData.data.board) {
          setBoard(returnData.data.board);
        } else {
          alert("글 상세 조회 실패");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("글 상세 조회 중 오류 발생");
      });
  };

  const deleteBoard = (_id) => {
    const send_param = { headers, _id };
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .post("http://localhost:8080/board/delete", send_param)
        .then(() => {
          alert("게시글이 삭제 되었습니다.");
          window.location.href = "/";
        })
        .catch((err) => {
          console.log(err);
          alert("글 삭제 실패");
        });
    }
  };

  if (!board) {
    return <div style={{ margin: 50 }}>로딩 중...</div>;
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
          to={{
            pathname: "/boardWrite",
            search: `?title=${encodeURIComponent(board.title)}&content=${encodeURIComponent(board.content)}&_id=${_id}`,
          }}
        >
          <Button className="btn-block" style={{ marginBottom: 5 }}>
            글 수정
          </Button>
        </NavLink>
        <Button className="btn-block" onClick={() => deleteBoard(_id)}>
          글 삭제
        </Button>
      </div>
    </div>
  );
};

export default BoardDetail;
