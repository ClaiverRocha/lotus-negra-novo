import React, { useState, useEffect } from "react";
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

// Tenta carregar imagens dinamicamente
const loadImage = (index) => {
  try {
    return require(`./assets/Camisa${index}.png`);
  } catch (error) {
    return "https://via.placeholder.com/300x150?text=Produto+em+breve";
  }
};

const products = Array.from({ length: 12 }, (_, i) => {
    const index = i + 1;
    const image = loadImage(index);
    const nomesOficiais = ["Fake Queen", "Bunny Killer", "Lotus Negra"];

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
    const [quantities, setQuantities] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
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

    const addToCart = (product) => {
        const quantity = Math.max(1, parseInt(quantities[product.id]) || 1);

        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === product.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            } else {
                return [...prev, { ...product, quantity }];
            }
        });

        setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
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
        let y = 20;
        cart.forEach((item) => {
            doc.text(
                `${item.name} - ${item.quantity} x R$${item.price.toFixed(
                    2
                )} = R$${(item.quantity * item.price).toFixed(2)}`,
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
    };

    if (!user) {
        return (
            <div className="login-container">
                {/* Lado esquerdo */}
                <div className="login-left">
                    <h1 className="font-lobster">L◉tus Negra</h1>
                    <p>
                        Faça seu orçamento de camisetas oversized personalizadas
                        com estilo e qualidade!
                    </p>
                    <div className="social-icons">
                        <a
                            href="https://www.instagram.com/l0tusnegra"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={28} />
                        </a>
                        <a
                            href="https://wa.me/5574999751663"
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
        <div
            style={{
                backgroundColor: "white",
                minHeight: "100vh",
                color: "black",
                position: "relative",
            }}
            className="p-6 max-w-7xl mx-auto"
        >
            {/* Botão sair fixado no topo direito */}
            <button
                onClick={handleLogout}
                style={{
                    position: "fixed",
                    top: "16px",
                    right: "16px",
                    backgroundColor: "transparent",
                    border: "2px solid black",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "black",
                    zIndex: 1000,
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "black";
                    e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "black";
                }}
            >
                <FaSignOutAlt /> Sair
            </button>

            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-widest uppercase">
                    L◉tus Negra
                </h1>
                <p className="text-gray-700">
                    Camisas Oversized personalizadas
                </p>
            </header>

            <h2 className="text-2xl font-bold mb-8">Catálogo</h2>

            {/* Linha de produtos */}
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
                            backgroundColor: "#f3f4f6",
                            padding: "12px",
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
                                color: "#16a34a",
                                fontWeight: "500",
                                fontSize: "0.9rem",
                                marginBottom: "8px",
                            }}
                        >
                            {product.available
                                ? `R$${product.price.toFixed(2)}`
                                : "Em breve"}
                        </p>

                        {product.available && (
                            <>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) =>
                                        setQuantities({
                                            ...quantities,
                                            [product.id]:
                                                Math.max(
                                                    1,
                                                    parseInt(e.target.value) || 1
                                                ),
                                        })
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "6px",
                                        fontSize: "0.8rem",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        marginBottom: "8px",
                                        textAlign: "center",
                                    }}
                                />
                                <button
                                    onClick={() => addToCart(product)}
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#1E90FF",
                                        color: "black",
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
                                    backgroundColor: "#f9fafb",
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
                    <button
                        onClick={generatePDF}
                        className="mt-6 flex items-center gap-2 bg-green-400 text-black px-4 py-2 rounded font-bold"
                    >
                        <FaFilePdf /> Baixar Orçamento em PDF
                    </button>
                )}
            </div>
        </div>
    );
}
