import React, { useState } from "react";
import { salvarDados } from "../database/database";

import CheckItem from "./CheckItem";

import "./Header.css";

const Header = ({ show, setShow, fetchData }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [noText, setNoText] = useState(false);
  const [checkItem, setCheckItem] = useState("");
  const [listCheckItem, setListCheckItem] = useState([]);

  const formatDate = (date) => {
    var dateFormat = date.split("-").reverse().join("-");
    setDate(dateFormat);
  };

  const checkText = () => {
    if (text.length > 0) {
      addDb();
      fetchData();
      setNoText(false);
    } else {
      setNoText(true);
    }
  };

  const addListCheckItem = () => {
    if(checkItem.length > 0){

      const newCheks = [...listCheckItem, { text: checkItem, check: false }];
  
      setListCheckItem(newCheks);
      setCheckItem("");
    }
    
  };

  /* 
data: "07-01-2022"
dataEdicao: ""
id: 5
listaCheck: Array(3)
0: {texto: 'primeiro check', checado: false}
1: {texto: 'segundo check', checado: false}
2: {texto: 'terceiro check', checado: true}
length: 3
mensagem: "Texto do lembrete"
titulo: "Titulo" */

  const clearFilds = () => {
    setTitle("");
    setText("");
    setDate("");
    setListCheckItem([]);
    setNoText(false);
  };

  const addDb = () => {
    const data = {
      title: title,
      message: text,
      date: date,
      checkList: listCheckItem,
    };

    salvarDados(data);

    clearFilds();

    setShow()
  };

  return (
    <header className="menuContainer" style={{ left: show ? 0 : "-100vw" }}>
      <div className="menuContainer--areaDigitavel">
        <textarea
          rows={1}
          placeholder="Título"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></textarea>

        <textarea
          placeholder="Seu lembrete aqui..."
          style={{ borderColor: noText ? "red" : "" }}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></textarea>
        {noText && <p className="aviso">*Este campo não pode ser vazio</p>}

        <div className="grupo-checar">
          <input
            type="text"
            placeholder="lembrete check box"
            className="checar"
            value={checkItem}
            onChange={(e) => {
              setCheckItem(e.target.value);
            }}
          />
          <button className="botao-incluir" onClick={addListCheckItem}>
            incluir
          </button>
        </div>
        {listCheckItem.map((item, key) => (
          <CheckItem item={item.text} key={key} />
        ))}
        <div className="div-data">
          <label className="label-data" htmlFor="data">
            Data:
          </label>
          <input
            className="data"
            type="date"
            onChange={(e) => {
              formatDate(e.target.value);
            }}
            
          />
        </div>

        <div className="botoes-deslizante">
          <button
            className="botao-cancelar"
            onClick={() => {
              setShow();
              clearFilds();
            }}
          >
            Cancelar
          </button>

          <button
            className="botao-salvar"
            onClick={() => {
              checkText();
              
            }}
          >
            Salvar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
