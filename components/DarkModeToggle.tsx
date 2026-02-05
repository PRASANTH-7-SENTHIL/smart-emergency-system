"use client";

import { useTheme } from "@/context/ThemeContext";

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: isDark ? "#2563eb" : "#e5e7eb",
                color: isDark ? "#fff" : "#000",
            }}
            className="hover:scale-105 active:scale-95 shadow-sm font-medium"
        >
            {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
    );
};

export default DarkModeToggle;
