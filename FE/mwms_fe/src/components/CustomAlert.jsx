import {useEffect} from "react";
import {Snackbar, Alert} from "@mui/material";
import css from "../styles/ui/Alert.module.css"
import styles from "../styles/Alert.module.css"

/*eslint-disable react/prop-types*/
export function CustomAlertHUY({message, type, onClose}) {
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
        <div className="custom-alert-container">
            <Alert variant={type} className={`mt-3`} onClose={onClose} dismissible="true">
                {message}
            </Alert>
        </div>
    );
}


export function CustomAlertQUOC({message, CloseFunc, open, severity}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={CloseFunc}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            className={css.snackbar}
        >
            <Alert
                handleClose={CloseFunc}
                sx={{width: "100%"}}
                variant="filled"
                severity={severity}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}