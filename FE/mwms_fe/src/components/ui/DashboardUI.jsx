import {DashboardLayout} from "@toolpad/core";
import {Outlet} from "react-router-dom";
import '../../styles/ui/dashboard.css'
import {Typography} from "@mui/material";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {ReactRouterAppProvider} from "@toolpad/core/react-router";
import {enqueueSnackbar} from "notistack";
import Cookies from 'js-cookie'

DashboardUI.proTypes = {
    navigate: PropTypes.array.isRequired,
    homeUrl: PropTypes.string.isRequired
}

/* eslint-disable react/prop-types */
function SidebarFooter({mini}) {
    return (
        <Typography
            variant="caption"
            sx={{m: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}
        >
            {mini ? '© M115' : `© ${new Date().getFullYear()} Medic115. All rights reversed`}
        </Typography>
    );
}


export function DashboardUI({navigate, homeUrl}) {
    const [session, setSession] = useState({
        user: {
            name: JSON.parse(localStorage.getItem("user")).name,
            email: JSON.parse(localStorage.getItem("user")).email
        }
    })

    const auth = {
        signIn: () => {
            setSession(session);
        },
        signOut: () => {
            setSession(null);
            window.location.href = "/login";
        },
    }

    const checkCookie = Cookies.get("check");

    useEffect(() => {
        if (!checkCookie) {
            enqueueSnackbar("Please turn on cookies to use the web", {variant: "warning"});
            navigate("/login");
        }
    }, [checkCookie]);


    const originalWarn = console.warn;
    console.warn = (...args) => {
        if (!args[0].includes("Failed prop type: Invalid prop `router.Link`")) {
            originalWarn(...args);
        }
    };

    const component = (
        <ReactRouterAppProvider
            navigation={navigate}
            branding={{
                logo: <img src="/medic.png" alt="Medic icon" />,
                title: "MEDIC115",
                homeUrl: homeUrl,
            }}
            session={session.user ? session : null}
            authentication={auth}
        >
            <DashboardLayout
                slots={{
                    sidebarFooter: SidebarFooter,
                }}
            >
                <div className="outlet">
                    <Outlet/>
                </div>
            </DashboardLayout>
        </ReactRouterAppProvider>
    );

    // Restore original console.warn
    console.warn = originalWarn;

    return component;
}