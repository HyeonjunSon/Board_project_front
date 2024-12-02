import React, { useState, useRef, useEffect } from "react";
import { CKEditor } from "ckeditor4-react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// Axios 기본 설정
axios.defaults.withCredentials = true;

const BoardWriteForm = () => {
  const [data, setData] = useState(""); // CKEditor 데이터 상태 관리
  const boardTitleRef = useRef(null); // 제목 입력 Ref
  const location = useLocation();
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 URL 쿼리 파라미터에서 title과 content를 가져옴
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const title = searchParams.get("title");
    const content = searchParams.get("content");

    if (title && content) {
      if (boardTitleRef.current) boardTitleRef.current.value = title;
      setData(content);
    }
  }, [location.search]);

  const writeBoard = async () => {
    const boardTitle = boardTitleRef.current?.value;
    const boardContent = data;

    if (!boardTitle || !boardContent) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const idFromCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)login_id\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    const send_param = {
      _id: idFromCookie,
      title: boardTitle,
      content: boardContent,
    };

    try {
      const returnData = await axios.post(
        `${process.env.REACT_APP_LOCAL_BACKEND}/board/write`,
        send_param,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("서버 응답 데이터: ", returnData.data); // 서버 응답 확인
      if (returnData.data.message) {
        alert(returnData.data.message);
        navigate("/");
        window.location.reload();
      } else {
        alert("글 저장 실패");
      }
    } catch (err) {
      console.error("Axios 요청 에러: ", err);
      alert("서버와의 통신 중 문제가 발생했습니다.");
    }
  };

  const onEditorChange = (evt) => {
    setData(evt.editor.getData());
  };

  return (
    <div style={{ margin: "50px" }}>
      <h2>글쓰기</h2>
      <Form.Control
        type="text"
        placeholder="제목을 입력하세요"
        style={{ marginBottom: "10px" }}
        ref={boardTitleRef}
      />
      <div style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
        <CKEditor
          initData={data || "<p>여기에 글을 작성하세요...</p>"}
          config={{
            height: 300,
            toolbar: [
              ["Bold", "Italic", "Underline"],
              ["NumberedList", "BulletedList"],
              ["Link", "Unlink", "Undo", "Redo"]
            ],
          }}
          onChange={onEditorChange}
        />
      </div>
      <Button onClick={writeBoard} style={{ marginTop: "10px" }}>
        저장하기
      </Button>
    </div>
  );
};

export default BoardWriteForm;
