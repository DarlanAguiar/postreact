export let bancoDeDados;
let bancoDeDadosInicializado = false;
let nomeDoBancoDeDados = "dbpostreact";
let nomeDaLista = "listareact";

export async function getBD() {
  if (!bancoDeDadosInicializado) {
    await criaBancoDeDados();
  }
  return bancoDeDados;
}

function criaBancoDeDados() {
  bancoDeDadosInicializado = true;
  return new Promise((resolve,reject) => {
    let requisicao = window.indexedDB.open(nomeDoBancoDeDados, 2);

    requisicao.onsuccess = (evento) => {
      bancoDeDados = requisicao.result;
      console.log("banco de dados criado", evento, bancoDeDados);
      resolve();
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
      reject();
    };

  });
}

export function salvarDados(data) {
  let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");

  let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

  let newItem = {
    title: data.title,
    message: data.message,
    date: data.date,
    checkList: data.checkList,
    editDate: "",
  };

  listaParaAdicionar.add(newItem);
}
