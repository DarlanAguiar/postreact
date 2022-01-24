import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { getBD } from "./database/database";
import { BsMic, BsSearch } from "react-icons/bs";

import { TiPlus } from "react-icons/ti";
import { useEffect, useState } from "react";
import CardPostit from "./components/CardPostit";

function App() {
  const [menu, SetMenu] = useState(false);
  const [infoDB, setInfoDB] = useState([]);
  const [bancoDeDados, setBancoDeDados] = useState(null);
  const [visibleSearch, setVisibleSearch] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [ouvindo, setOuvindo] = useState(false)
  

  useEffect(() => {
    const initializeBD = async () => {
      setBancoDeDados(await getBD());
    };
    initializeBD();
  }, []);

  useEffect(() => {
    if (bancoDeDados) {
      fetchData();
    }
  }, [bancoDeDados]);

  const showMenu = () => {
    SetMenu(!menu);
  };

  //let infof = []

  const createCard = (dados) => {
    console.log("Chamou 1", dados, infoDB);
    // setTimeout(() => {
    console.log("Chamou 2", dados, infoDB);
    setInfoDB(dados);
    console.log("Chamou 3", dados, infoDB);
    // }, 110);
    console.log("Chamou 4", dados, infoDB);

    /* const info = [
      ...infoPostit,
      { id: id, title: title, message: text, date: date, checkList: checkList, },
    ]; */

    //setInfoPostit(info);
  };

  function fetchData() {
    var dados = [];

    let nomeDaLista = "listareact";

    let objetoGuardado = bancoDeDados
      .transaction(nomeDaLista)
      .objectStore(nomeDaLista);

    objetoGuardado.openCursor().onsuccess = (evento) => {
      const cursor = evento.target.result;

      if (cursor) {
        const title = cursor.value.title;
        const text = cursor.value.message;
        const checkList = cursor.value.checkList;
        const date = cursor.value.date;
        const id = cursor.value.id;
        const editDate = cursor.value.editDate;

        dados.push({
          id: id,
          title: title,
          message: text,
          checkList: checkList,
          date: date,
          editDate: editDate,
        });

        cursor.continue();
      } else {
        createCard(dados);
        // resolve(dados);
      }
    };
  }

  const deletePost = (id) => {
    let nomeDaLista = "listareact";
    let localParaAdicionar = bancoDeDados.transaction(
      [nomeDaLista],
      "readwrite"
    );
    let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

    listaParaAdicionar.delete(id);
    fetchData();
  };

  const editPost = (data) => {
    let nomeDaLista = "listareact";

    const dataED = new Date();
    const dia = String(dataED.getDate()).padStart(2, "0");
    const mes = String(dataED.getMonth() + 1).padStart(2, "0");
    const ano = dataED.getFullYear();
    const hora = dataED.getHours();
    let minutos = dataED.getMinutes();
    minutos.toString().length === 2
      ? (minutos = minutos.toString())
      : (minutos = `0${minutos}`);

    const dataAtual = `Editado ${dia}/${mes}/${ano} às ${hora}:${minutos}`;

    let localParaAdicionar = bancoDeDados.transaction(
      [nomeDaLista],
      "readwrite"
    );

    let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

    listaParaAdicionar.put({
      id: data.id,
      title: data.title,
      message: data.message,
      checkList: data.checkList,
      date: data.date,
      editDate: dataAtual,
    });

    fetchData();
  };

  console.log(" Tentou renderizar ", infoDB);

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
      {/* <div>{JSON.stringify(infoDB)}</div> */}
      <Header show={menu} setShow={showMenu} fetchData={fetchData} />

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
          <BsMic fontSize={20} width={20} style={{ color: ouvindo ? "#126ece" : "black" }} onClick={handleMicClick}/>
        </div>
        <BsSearch color="chartreuse" fontSize={27} onClick={showSearch} className={"lupa"} />
      </div>

      <Footer />
    </div>
  );
}

export default App;
