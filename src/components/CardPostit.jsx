import React from "react";
import Texts from "./Texts";

import "./CardPostit.css";
import CheckBoxList from "./CheckBoxList";

const CardPostit = ({ info, deletePost, editPost }) => {
  let dados = {
    checkList: info.checkList,
    date: info.date,
    id: info.id,
    message: info.message,
    title: info.title,
  };

  return (
    <div className="card">
      <Texts
        data={info}
        deletePost={deletePost}
        editPost={editPost}
        dataEdit={dados}
      />
      <CheckBoxList data={info} editPost={editPost} />
      <p
        className="date"
        contentEditable
        onBlur={(e) => {
          dados.date = e.target.textContent;
          //console.log(dados);
          editPost(dados);
        }}
      >
        {info.date}
      </p>
    </div>
  );
};

export default CardPostit;
