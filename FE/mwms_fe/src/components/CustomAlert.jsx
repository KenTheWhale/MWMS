import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import {Snackbar} from "@mui/material";

/*eslint-disable react/prop-types*/
export function CustomAlertHUY({ message, type, onClose}){
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <Alert variant={type} className="mt-3" onClose={onClose} dismissible>
            {message}
        </Alert>
    );
};


export function CustomAlertQUOC({openCondition, closeFunc, severity, variant, message}){
    return(
        <Snackbar
            open={openCondition}
            autoHideDuration={3000}
            onClose={closeFunc}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            style={{zIndex:5000}}
            >
            <Alert
                onClose={closeFunc}
                severity={severity}
                variant={variant}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}