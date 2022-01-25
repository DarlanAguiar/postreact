import { useEffect, useState } from "react";
import { deleteData, fetchData, updateData } from "./database/database";
import { BsMic, BsSearch } from "react-icons/bs";
import moment from "moment";
import { TiPlus } from "react-icons/ti";

import CardPostit from "./components/CardPostit";
import Footer from "./components/Footer";
import Header from "./components/Header";

import "./App.css";

function App() {
  const [menu, SetMenu] = useState(false);
  const [infoDB, setInfoDB] = useState([]);
  const [visibleSearch, setVisibleSearch] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [ouvindo, setOuvindo] = useState(false);

  useEffect(() => {
    fetchPostIts();
  }, []);

  const showMenu = () => {
    SetMenu(!menu);
  };

  async function fetchPostIts() {
    const dados = await fetchData();
    setInfoDB(dados);
  }

  const deletePost = (id) => {
    deleteData(id);

    fetchPostIts();
  };

  const editPost = (data) => {
    /* const dataED = new Date();
    const dia = String(dataED.getDate()).padStart(2, "0");
    const mes = String(dataED.getMonth() + 1).padStart(2, "0");
    const ano = dataED.getFullYear();
    const hora = dataED.getHours();
    let minutos = dataED.getMinutes();
    minutos.toString().length === 2
      ? (minutos = minutos.toString())
      : (minutos = `0${minutos}`);

    const dataAtual = `Editado ${dia}/${mes}/${ano} às ${hora}:${minutos}`; */

    const dataAtual = `Editado ${moment().format("DD/MM/YYYY H:mm")}`;

    const updatedData = {
      id: data.id,
      title: data.title,
      message: data.message,
      checkList: data.checkList,
      date: data.date,
      editDate: dataAtual,
    };

    updateData(updatedData);

    fetchPostIts();
  };

  const showSearch = () => {
    setVisibleSearch(!visibleSearch);
  };

  //search to voice:
  let reconhecimento = null;

  let reconhecimentoDeFala =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (reconhecimentoDeFala !== undefined) {
    reconhecimento = new reconhecimentoDeFala();
  }

  const handleMicClick = () => {
    if (reconhecimento !== null) {
      reconhecimento.onstart = () => {
        setOuvindo(true);
      };

      reconhecimento.onend = () => {
        setOuvindo(false);
      };

      reconhecimento.onresult = (e) => {
        setTextSearch(e.results[0][0].transcript);
      };

      reconhecimento.start();
    }
  };

  return (
    <div className="body">
      <Header show={menu} setShow={showMenu} fetchPostIts={fetchPostIts} />

      {infoDB.map((info, id) => (
        <CardPostit
          info={info}
          deletePost={deletePost}
          editPost={editPost}
          textInputSearch={textSearch}
          key={id}
        />
      ))}

      <button className="botao-adicionar" onClick={showMenu}>
        <TiPlus fontSize={30} />
      </button>

      <div
        className="containerSearch"
        style={{ left: visibleSearch ? "3px" : "-132px" }}
      >
        <div className="containerInputMic">
          <input
            type={"search"}
            value={textSearch}
            onChange={(e) => {
              setTextSearch(e.target.value);
            }}
          />
          <BsMic
            fontSize={20}
            width={20}
            style={{ color: ouvindo ? "#126ece" : "black" }}
            onClick={handleMicClick}
          />
        </div>
        <BsSearch
          color="chartreuse"
          fontSize={27}
          onClick={showSearch}
          className={"lupa"}
        />
      </div>

      <Footer />
    </div>
  );
}

export default App;
