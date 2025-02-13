import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ role: decoded.role });
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                localStorage.removeItem("accessToken");
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("accessToken", token);
        const decoded = jwtDecode(token);
        setUser({ role: decoded.role });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
