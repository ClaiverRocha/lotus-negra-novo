import React from "react";

export function Input({ type = "text", placeholder, value, onChange, className = "" }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`border border-gray-300 p-2 rounded w-full ${className}`}
        />
    );
}
