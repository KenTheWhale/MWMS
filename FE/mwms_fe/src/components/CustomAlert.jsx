import { useEffect } from "react";
import { Alert } from "react-bootstrap";

const CustomAlert = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <Alert variant={type} className="mt-3" onClose={onClose} dismissible>
            {message}
        </Alert>
    );
};

export default CustomAlert;
