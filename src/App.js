import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import {
    FaUser,
    FaSignOutAlt,
    FaShoppingCart,
    FaFilePdf,
    FaTrash,
    FaLock,
    FaInstagram,
    FaWhatsapp,
} from "react-icons/fa";
import backgroundImage from "./assets/background.png";

import Carousel from "./components/Carousel";

// Importa as imagens
import Camisa2 from "./assets/Imagem do background.png";
import Camisa3 from "./assets/Imagem do background2.png";
import Camisa4 from "./assets/Imagem do background3.png";
import Camisa5 from "./assets/Imagem do background4.png";
import Camisa6 from "./assets/Imagem do background5.png";
import Camisa7 from "./assets/Imagem do background6.png";
import Camisa8 from "./assets/Imagem do background7.png";
import Camisa9 from "./assets/Imagem do background8.png";
  
// Tenta carregar imagens dinamicamente
const loadImage = (index) => {
  try {
    return require(`./assets/Camisa${index}.png`);
  } catch (error) {
    return "https://via.placeholder.com/300x150?text=Produto+em+breve";
  }
};

const products = Array.from({ length: 8 }, (_, i) => {
    const index = i + 1;
    const image = loadImage(index);
    const nomesOficiais = ["Fake Queen", "Bunny Killer", "Lotus Negra", "Fall King", "Lord", "Black", "Beserk", "Broken"];

    const isPlaceholder = typeof image === "string" && image.includes("placeholder");

    return {
        id: index,
        name: isPlaceholder ? "Produto em breve" : nomesOficiais[i] || `Camisa ${index}`,
        price: isPlaceholder ? 0 : 100.00,
        image,
        available: !isPlaceholder,
    };
});

export default function App() {
    
    const [cart, setCart] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [showUserBox, setShowUserBox] = useState(false); // <-- Adicionado para evitar erro semelhante
const [showMsg, setShowMsg] = useState(false);
  const handleClick = () => {
    window.scrollBy({
      top: 20000, // desce 20000px
      behavior: "smooth", // scroll suave
    });
  } 
    const whatsappNumber = "557498013532";
    const whatsappMessage = encodeURIComponent("Olá, gostaria de enviar meu orçamento");

    // Ref para armazenar inputs de quantidade
    const quantityRefs = useRef({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);
    // Detecta se é mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    const handleAuth = async () => {
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            alert("Erro: " + error.message);
        }
    };

    const handleLogout = () => signOut(auth);

    const addToCart = (product, quantity) => {
  const qty = Math.max(1, parseInt(quantity) || 1);

  setCart((prev) => {
    const existingIndex = prev.findIndex((item) => item.id === product.id);
    if (existingIndex >= 0) {
      const updated = [...prev];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + qty,
      };
      return updated;
    } else {
      return [...prev, { ...product, quantity: qty }];
    }
  });

  const inputEl = quantityRefs.current[product.id];
  if (inputEl) inputEl.value = 1;
    setShowMsg(true);
  setTimeout(() => setShowMsg(false), 2500);
};


    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateCartQuantity = (productId, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Orçamento", 10, 10);
        doc.text(`Email: ${user.email}`, 10, 20);
        let y = 30;
        cart.forEach((item) => {
            doc.text(
                `${item.name} - ${item.quantity} x R$${item.price.toFixed(2)} = R$${(item.quantity * item.price).toFixed(2)}`,
                10,
                y
            );
            y += 10;
        });
        const total = cart.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );
        doc.text(`Total: R$${total.toFixed(2)}`, 10, y);
        doc.save("orcamento.pdf");
        setShowWhatsappModal(true);
    };

    if (!user) {
        return (
            <div className="login-container">
                {/* Lado esquerdo */}
                <div className="login-left">
                    <h1 className="font-lobster">L◉tus Negra Street</h1>
                    <p>
                        Faça seu orçamento de camisetas oversized personalizadas
                        com estilo e qualidade!
                    </p>
                    <div className="social-icons">
                        <a
                            href="https://www.instagram.com/lotus_negra_street"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={28} />
                        </a>
                        <a
                            href="https://wa.me/557498013532"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                        >
                            <FaWhatsapp size={28} />
                        </a>
                    </div>
                </div>

                {/* Lado direito */}
                <div className="login-right">
                    <h2>Login</h2>
                    <p>Entre com seus dados para continuar</p>

                    <div className="flex items-center w-full max-w-sm mb-4 border border-gray-700 rounded-lg bg-[#222] focus-within:ring-2 focus-within:ring-purple-600">
                        <div className="px-3 text-gray-400">
                            <FaUser />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none rounded-r-lg"
                        />
                    </div>

                    <div className="flex items-center w-full max-w-sm mb-6 border border-gray-700 rounded-lg bg-[#222] focus-within:ring-2 focus-within:ring-purple-600">
                        <div className="px-3 text-gray-400">
                            <FaLock />
                        </div>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none rounded-r-lg"
                        />
                    </div>

                    <button
                        onClick={handleAuth}
                        className="w-full max-w-sm bg-purple-700 hover:bg-purple-800 transition text-white py-3 rounded-lg font-semibold"
                    >
                        {isRegistering ? "Cadastrar" : "Entrar"}
                    </button>

                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="toggle-button"
                    >
                        {isRegistering
                            ? "Já tem conta? Faça login"
                            : "Não tem conta? Cadastre-se"}
                    </button>
                </div>
            </div>
        );
    }

    return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOPO */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 32px",
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
          fontWeight: "600",
          fontSize: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Esquerda: OVERSIZED com retângulo */}
        <div
          style={{
            border: "2px solid black",
            padding: "4px 10px",
            color: "black",
            fontWeight: "700",
            userSelect: "none",
          }}
        >
          Lotus Negra Street
        </div>

{/* Centro: Menu */}
<div style={{ display: "flex", gap: "24px", cursor: "pointer", position: "relative" }}>
  {["Início", "Sobre", "Contato"].map((item) => {
    if (item === "Contato") {
      return (
        <div key={item} style={{ position: "relative" }}>
          <button
            style={{
              background: "none",
              border: "none",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: "pointer",
              color: "black",
              padding: 0,
              userSelect: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#7e22ce")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
            onClick={() => {
              const box = document.getElementById("contato-box");
              box.style.display = box.style.display === "flex" ? "none" : "flex";
            }}
          >
            {item}
          </button>

          {/* Caixinha de contato */}
          <div
            id="contato-box"
            style={{
              display: "none",
              flexDirection: "column",
              gap: "10px",
              position: "absolute",
              top: "30px",
              right: "0", // garante alinhamento à esquerda do botão
              background: "white",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              zIndex: 999,
              minWidth: "200px",
              transform: "translateX(0%)" // move totalmente para a esquerda
            }}
          >
            <a
              href="https://wa.me/557498013532"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                color: "#25D366",
                fontWeight: "600"
              }}
            >
              <FaWhatsapp /> Whatsapp
            </a>

            <a
              href="https://www.instagram.com/lotus_negra_street?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20a%20Lotus%20Negra%20Street."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                color: "#C13584",
                fontWeight: "600"
              }}
            >
              <FaInstagram /> Lotus_Negra_Street
            </a>
          </div>
        </div>
      );
    }

    return (
      <button
        key={item}
        style={{
          background: "none",
          border: "none",
          fontWeight: "600",
          fontSize: "1rem",
          cursor: "pointer",
          color: "black",
          padding: 0,
          userSelect: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#7e22ce")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
        onClick={() => {
          if (item === "Início") {
            window.scrollTo({ top: -20000, behavior: "smooth" });
          } else if (item === "Sobre") {
            window.scrollTo({ top: 20000, behavior: "smooth" });
          }
        }}
      >
        {item}
      </button>
    );
  })}
</div>


{/* Direita: Ícones */}
<div style={{ padding: "20px" }}>
  <div
    style={{
      display: "flex",
      gap: "16px",
      fontSize: "1.3rem",
      cursor: "pointer",
      position: "relative",
    }}
  >
    {/* Ícone de Usuário */}
    <div style={{ position: "relative" }}>
      <FaUser
        title="Usuário"
        onClick={() => {
          setShowUserBox(!showUserBox);
        }}
        style={{
          userSelect: "none",
          backgroundColor: "white",
          color: "black",
        }}
      />

      {showUserBox && (
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "130%",
            backgroundColor: "white",
            color: "black",
            border: "1px solid #000000ff",
            borderRadius: "5px",
            padding: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: "300px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              textAlign: "right",
              marginBottom: "-25px",
            }}
          >
            <span
              onClick={() => setShowUserBox(false)}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                color: "black",
              }}
            >
              X
            </span>
          </div>
          <p style={{ margin: 0 }}>E-mail: {user.email}</p>

          {/* Botão sair dentro da caixinha, estilo simples */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "2px solid black",
              backgroundColor: "black",
              color: "white",
              fontWeight: "700",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaSignOutAlt /> Sair
          </button>
        </div>
      )}
    </div>
  </div>
</div>


      </nav>

      {/* CONTEÚDO PRINCIPAL - Fundo dividido */}
<main
  style={{
    flex: 1,
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: "calc(100vh - 56px)",
  }}
>
  {/* Lado esquerdo - texto e fumaça */}
  <section
    style={{
      flex: isMobile ? 1 : 0.5, // metade no desktop, cheio no mobile
      backgroundColor: "black",
      color: "white",
      padding: isMobile ? "40px 24px" : "64px 48px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      maxWidth: "none", // remover limite para não estreitar
      margin: "initial", // padrão
      textAlign: isMobile ? "center" : "left",
    }}
  >
    {/* Fumaça */}
    <div
      style={{
        position: "absolute",
        top: "-20%",
        left: "-20%",
        width: "150%",
        height: "150%",
        background:
          "url('https://i.ibb.co/jv7jMXv/smoke-effect.png') no-repeat center/cover",
        opacity: 0.15,
        filter: "blur(30px)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    ></div>

    {/* Conteúdo texto */}
    <div style={{ position: "relative", zIndex: 1 }}>
      <h2
        style={{
          fontWeight: "900",
          fontSize: isMobile ? "1.8rem" : "2.2rem",
          marginBottom: "1rem",
          lineHeight: 1.2,
        }}
      >
        STREETWEAR
        <br />
        AUTÊNTICO
        <br />
        E ÚNICO
      </h2>
      <p
        style={{
          fontSize: isMobile ? "0.95rem" : "1rem",
          lineHeight: "1.5",
          marginBottom: "2rem",
        }}
      >
        Camisas oversized com designs exclusivos criados por nossa equipe.
        Você merece se destacar com estilo. Você não veste uma roupa, você
        veste uma atitude.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1.5rem",
          marginBottom: "2rem",
          justifyContent: isMobile ? "center" : "flex-start",
        }}
      >
        <button
          style={{
            backgroundColor: "transparent",
            border: "1.8px solid white",
            padding: "10px 20px",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
            borderRadius: "6px",
            userSelect: "none",
            transition: "background-color 0.3s ease",
            width: isMobile ? "100%" : "auto",
          }}
          onClick={() => {
            const el = document.getElementById("sobre");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              setTimeout(() => {
                window.scrollBy({ top: 100, behavior: "smooth" });
              }, 600);
            } else {
              window.scrollBy({ top: 880, behavior: "smooth" });
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "black";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "white";
          }}
        >
          VER COLEÇÕES
        </button>

        <button
          style={{
            backgroundColor: "transparent",
            border: "1.8px solid white",
            padding: "10px 20px",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
            borderRadius: "6px",
            userSelect: "none",
            transition: "background-color 0.3s ease",
            width: isMobile ? "100%" : "auto",
          }}
          onClick={() => {
            const el = document.getElementById("sobre");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              setTimeout(() => {
                window.scrollBy({ top: 100, behavior: "smooth" });
              }, 600);
            } else {
              window.scrollBy({ top: 20000, behavior: "smooth" });
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "black";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "white";
          }}
        >
          SOBRE OS DESIGNS
        </button>
      </div>
    </div>
  </section>

  {/* Lado direito - imagem da camisa */}
  <section
    style={{
      flex: isMobile ? 1 : 0.5,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? "24px" : "48px",
      position: "relative",
      minHeight: isMobile ? "300px" : "auto",
    }}
  >

  {/* Carrossel de imagens */}
  <Carousel
    imagens={[Camisa2, Camisa3, Camisa4, Camisa5, Camisa6, Camisa7, Camisa8, Camisa9]}
    intervalo={3000}
  />
  </section>
</main>

      <h2 className="text-2xl font-bold mb-8">Catálogo</h2>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  }}
>
  {products.map((product) => (
    <div
      key={product.id}
      style={{
        backgroundImage: "linear-gradient(135deg, #1d1d1dff, #e5e7eb)",
        padding: "52px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        flex: "1 1 30%",
        maxWidth: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "150px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "12px",
        }}
      />
      <h3
        style={{
          fontWeight: "600",
          fontSize: "1.1rem",
          marginBottom: "6px",
        }}
      >
        {product.name}
      </h3>
      <p
        style={{
          color: "#000000ff",
          fontWeight: "500",
          fontSize: "0.9rem",
          marginBottom: "8px",
        }}
      >
        {product.available ? `R$${product.price.toFixed(2)}` : "Em breve"}
      </p>

      {product.available && (
        <>
          <input
            type="number"
            min="1"
            defaultValue={1}
            ref={(el) => (quantityRefs.current[product.id] = el)}
            style={{
              width: "100%",
              padding: "6px",
              fontSize: "0.8rem",
              border: "1px solid #000000ff",
              borderRadius: "6px",
              marginBottom: "8px",
              textAlign: "center",
            }}
          />
          <button
            onClick={() => {
              const inputEl = quantityRefs.current[product.id];
              const quantity = inputEl ? parseInt(inputEl.value) || 1 : 1;
              addToCart(product, quantity);
              
            }}
            style={{
              width: "100%",
              backgroundColor: "#000000ff",
              color: "white",
              padding: "8px",
              fontWeight: "700",
              borderRadius: "8px",
              fontSize: "0.9rem",
              cursor: "pointer",
              border: "none",
            }}
          >
            Adicionar
          </button>
          {showMsg && (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "#333",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer", // deixa o cursor de botão
        zIndex: 9999,
        userSelect: "none", // evita seleção do texto no clique
      }}
    >
      <FaShoppingCart />
      Item adicionado! Veja sua sacolinha abaixo. ↴
    </div>
)}
        </>
      )}
    </div>
  ))}
</div>
            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaShoppingCart /> Sacola
                </h2>
                {cart.length === 0 ? (
                    <p className="text-gray-500">Nenhum item adicionado.</p>
                ) : (
                    <ul className="space-y-4">
                        {cart.map((item) => (
                            <li
                                key={item.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#000000ff",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <strong>{item.name}</strong>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateCartQuantity(
                                            item.id,
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "60px",
                                        marginRight: "12px",
                                        padding: "4px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        textAlign: "center",
                                    }}
                                />
                                <span
                                    style={{
                                      
                                        color: "#16a34a",
                                        fontWeight: "600",
                                        minWidth: "80px",
                                    }}
                                >
                                    R$
                                    {(item.price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "red",
                                        cursor: "pointer",
                                        marginLeft: "12px",
                                    }}
                                    title="Remover item"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
    
{cart.length > 0 && (
  <div
    style={{
      display: "flex",
      gap: "16px",
      marginTop: "24px",
      flexWrap: "wrap",
      justifyContent: "center",
    }}
  >
    <button
      onClick={generatePDF}
      style={{
        flex: "1 1 200px",
        maxWidth: "200px",
        backgroundColor: "#22c55e",
        color: "black",
        padding: "10px 16px",
        fontWeight: "700",
        borderRadius: "18px",
        fontSize: "1rem",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 4px 6px rgba(34, 197, 94, 0.4)",
        transition: "background-color 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
    >
      <FaFilePdf /> Baixar Orçamento em PDF
    </button>

    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        flex: "1 1 200px",
        maxWidth: "200px",
        backgroundColor: "#22c55e",
        color: "black",
        padding: "10px 16px",
        fontWeight: "700",
        borderRadius: "18px",
        fontSize: "1rem",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 4px 6px rgba(34, 197, 94, 0.4)",
        transition: "background-color 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
    >
      <FaWhatsapp /> Enviar orçamento via WhatsApp
    </a>
  </div>
)}
{showWhatsappModal && (
    <div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        }}
    >
        <div
            style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                maxWidth: "90vw",
                width: "400px",
            }}
        >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "24px" }}>
                PDF gerado com sucesso!
            </h2>

            <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    backgroundColor: "#22c55e",
                    color: "black",
                    padding: "10px 20px",
                    fontWeight: "700",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(34, 197, 94, 0.4)",
                    transition: "background-color 0.3s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
            >
                <FaWhatsapp /> Enviar PDF ao WhatsApp
            </a>

            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => setShowWhatsappModal(false)}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "8px 16px",
                        fontWeight: "700",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.6)",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "black")}
                >
                    Fechar
                </button>
            </div>
        </div>
    </div>
)}

    <div style={{
  margin: "40px 0",
  padding: 20,
  borderTop: "1px solid #eee",
  borderBottom: "1px solid #eee",
  textAlign: "left",
  color: "#444",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
}}>
  <h2 style={{ fontWeight: "600", fontSize: "1.8rem", marginBottom: 10 }}>
    Sobre os Designs
  </h2>
  <p style={{textAlign: "left",fontSize: "1rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.5 }}>
    Um novo estilo de vida. Com atitude, qualidade e autenticidade para quem vive a cultura streetwear.
    Todos os designs são criados do zero, garantindo exclusividade e originalidade em cada peça. 
    Nossas camisetas oversized são feitas com materiais premium, proporcionando conforto e dando um novo estilo de vida.
    Cada estampa é cuidadosamente desenvolvida por nossa equipe de designers, que se inspiram num novo visual, arte de rua 
    e tendências globais para criar peças que realmente se destacam.
    Vista atitude, vista Lotus Negra Street.
  </p>
    <p style={{ textAlign: "left",fontSize: "1rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.5 }}>
    © 2025 Lotus Negra Street. Todos os direitos reservados.
  </p>
      <p style={{ textAlign: "left",fontSize: "1rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.5 }}>
    Developed by <a href="https://www.instagram.com/claiverrochaa" target="_blank" rel="noopener noreferrer" style={{ color: "#7e22ce", textDecoration: "underline" }}>Claiver Rocha</a>
  </p>
</div>
            </div>
        </div>
        
    );
    
}
