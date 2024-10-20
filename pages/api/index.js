// pages/api/counter.js

let visits = 72; // Inicializa o contador

export default function handler(req, res) {
  // Incrementa o contador de acessos
  visits += 1;

  // Retorna o número de acessos como resposta
  res.status(200).json({ visits });
}
