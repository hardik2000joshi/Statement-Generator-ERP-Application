import { useContext } from "react";
import { createContext, useEffect, useState } from "react";

// create context - creatring the context
// Provider - providing the value to context
// useContext
const ThemeContext = createContext();  // creating the context for theme
export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });
    useEffect(() => {
        const root = document.documentElement;
        if(theme === "dark"){
            root.classList.add("dark");
        }
        else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((previousTheme) => previousTheme === "light" ? "dark" : "light");
    };
    return (
        <ThemeContext.Provider
        value={{theme, setTheme, toggleTheme}}
        >
            {children}
            </ThemeContext.Provider>   // Provide 
    );
}

export const useTheme = () => {   // useContext
    return useContext(ThemeContext);
}

