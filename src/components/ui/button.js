import React from "react";

export function Button({ children, onClick, className = "", variant = "default" }) {
    const baseStyle = "px-4 py-2 rounded text-white font-semibold";
    const variants = {
        default: "bg-blue-600 hover:bg-blue-700",
        outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-100",
    };
    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
}
