import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [visits, setVisits] = useState(0); // Estado para armazenar o número de acessos

  // Faz uma requisição para a API e pega o contador de visitas
  useEffect(() => {
    fetch("/api/counter") // Faz uma requisição para a rota da API de contador
      .then((response) => response.json()) // Converte a resposta para JSON
      .then((data) => {
        setVisits(data.visits); // Atualiza o estado com o número de acessos
      })
      .catch((error) => console.error("Erro ao buscar o contador:", error));
  }, []);

  return (
    <>
      <Head>
        {/* Carrega o CSS da pasta public */}
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <div className="container">
        <h1>Bem-vindo ao meu site!</h1>
        <p>
          Esta página é um exemplo de como integrar HTML, CSS e o contador de
          acessos.
        </p>
        <p>Usuários que acessaram este site: {visits}</p>{" "}
        {/* Exibe o número de acessos */}
      </div>
    </>
  );
}
