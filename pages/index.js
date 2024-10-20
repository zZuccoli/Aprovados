import { useEffect, useState } from "react";

export default function Home() {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    // Verifica se já existe um valor no localStorage
    const visitCount = localStorage.getItem("visits");

    if (visitCount) {
      // Se houver, incrementa o valor
      const newCount = parseInt(visitCount, 10) + 1;
      localStorage.setItem("visits", newCount);
      setVisits(newCount);
    } else {
      // Caso não exista, inicializa com 72
      localStorage.setItem("visits", 72);
      setVisits(72);
    }
  }, []);

  return (
    <div>
      <h1>Obrigado por acessar o Aprovados</h1>
      <p>Usuários que acessaram este site: {visits}</p>
    </div>
  );
}
