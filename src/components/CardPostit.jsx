import React, { useState } from "react";
import Texts from "./Texts";

import "./CardPostit.css";
import CheckBoxList from "./CheckBoxList";

const CardPostit = ({ info, deletePost, editPost }) => {
  const [invalidDate, setInvalidDate] = useState(false);

  let dados = {
    checkList: info.checkList,
    date: info.date,
    id: info.id,
    message: info.message,
    title: info.title,
  };

  const validateDate = (date) => {
    let expressao = new RegExp(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
      "g"
    );

    if (expressao.test(date)) {
      dados.date = date;
      setInvalidDate(false);
      editPost(dados);
    } else {
      setInvalidDate(true);
    }
  };

  if (info.editDate) {
    console.log(info.editDate);
  }

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
        style={{ color: invalidDate ? "chartreuse" : "#fff" }}
        onBlur={(e) => {
          validateDate(e.target.textContent);
        }}
      >
        {info.date}
      </p>
      {invalidDate && (
        <p className="validDate">Data inválida, formato aceito (01-01-2001)</p>
      )}
      {info.editDate && <p className="editDate">{info.editDate}</p>}
    </div>
  );
};

export default CardPostit;
