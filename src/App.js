import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { bancoDeDados, removeItem } from "./database/database";

import { TiPlus } from "react-icons/ti";
import { useEffect, useState } from "react";
import CardPostit from "./components/CardPostit";

function App() {
  const [menu, SetMenu] = useState(false);

  const [informacoes, setInformacoes] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 50);
  }, []);

  const deslizaMenu = () => {
    SetMenu(!menu);
  };

  //let infof = []

  const createCard = async (dados) => {
    setTimeout(() => {
      setInformacoes(dados);
    }, 80);

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

        dados.push({
          id: id,
          title: title,
          message: text,
          checkList: checkList,
          date: date,
        });

        cursor.continue();
      }
    };
    createCard(dados);
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
    //let numeroId = Number(id);

    const texto = data.text;

    console.log(typeof texto)

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
    });

    fetchData();
  };

  return (
    <div className="body">
      <Header show={menu} setShow={deslizaMenu} fetchData={fetchData} />

      {informacoes.map((info, id) => (
        <div className="postit">
          <CardPostit
            info={info}
            deletePost={deletePost}
            editPost={editPost}
            key={id}
          />
        </div>
      ))}

      <button className="botao-adicionar" onClick={deslizaMenu}>
        <TiPlus fontSize={30} />
      </button>

      <section className="container-cards" id="data-list"></section>
      <Footer />
    </div>
  );
}

export default App;
