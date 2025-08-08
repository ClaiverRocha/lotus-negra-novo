import React, { useState, useEffect } from "react";

export default function Carousel({ imagens, intervalo = 3000 }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagens.length);
    }, intervalo);
    return () => clearInterval(timer);
  }, [imagens.length, intervalo]);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <img
        src={imagens[indice]}
        alt={`Slide ${indice + 1}`}
        style={{
          width: "80%",
          height: "auto",
          borderRadius: "8px",
          display: "block",
          margin: "0 auto",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}
