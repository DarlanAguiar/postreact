import React from "react";

export let bancoDeDados;
let nomeDoBancoDeDados = "dbpostreact";
let nomeDaLista = "listareact";

function criaBancoDeDados() {
  let requisicao = window.indexedDB.open(nomeDoBancoDeDados, 1);

  requisicao.onsuccess = (evento) => {
    bancoDeDados = requisicao.result;

    //console.log("banco de dados criado", evento, bancoDeDados);

    // mostrarCardNaTela();
  };

  requisicao.onupgradeneeded = (evento) => {
    bancoDeDados = evento.target.result;
    if (bancoDeDados.objectStoreNames.contains(nomeDaLista)) {
      return;
    }

    const objetoSalvo = bancoDeDados.createObjectStore(nomeDaLista, {
      keyPath: "id",
      autoIncrement: true,
    });

    objetoSalvo.createIndex("lembretereact", "lembretereact", {
      unique: false,
    });

    //console.log("houve um upgrade", evento)
  };

  requisicao.onerror = (evento) => {
    console.log("hove um erro", evento);
  };
}

export function salvarDados(data) {
  let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");

  let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

  let newItem = {
    title: data.title,
    message: data.message,
    date: data.date,
    checkList: data.checkList,
  };

  listaParaAdicionar.add(newItem);

  /* mostrarCardNaTela(); */
}

export const removeItem = (numberId) => {
  
  let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");

  let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);
  console.log(numberId, typeof numberId);

  //listaParaAdicionar.delete(id);

  //mostrarCardNaTela();
};

criaBancoDeDados();
