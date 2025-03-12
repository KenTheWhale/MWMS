import {Account, DashboardLayout} from "@toolpad/core";
import {Outlet} from "react-router-dom";
import '../../styles/ui/dashboard.css'
import {Typography} from "@mui/material";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {ReactRouterAppProvider} from "@toolpad/core/react-router";
import {enqueueSnackbar} from "notistack";
import Cookies from 'js-cookie'
import {Logout} from "@mui/icons-material";

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
            color={"textPrimary"}
        >
            {mini ? '© M115' : `© ${new Date().getFullYear()} Medic115. All rights reversed`}
        </Typography>
    );
}

function ToolbarAccount() {
    return (
        <Typography
            variant="caption"
            color={"textPrimary"}>
            <div className={'d-flex justify-content-between align-items-center me-4 gap-2'}>
                <Account
                    slotProps={{
                        signOutButton: {
                            variant: "contained",
                            color: "error"
                        }
                    }}
                />
                <Typography variant={"body1"} color={"textPrimary"}>
                    {localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : ""}
                </Typography>
            </div>
        </Typography>
    )
}

export function DashboardUI({navigate, homeUrl}) {
    const [session, setSession] = useState({
        user: {
            name: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : "",
            email: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email : ""
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

    return (
        <ReactRouterAppProvider
            navigation={navigate}
            branding={{
                logo: <img src="/medic.png" alt="Medic icon"/>,
                title: "MEDIC115",
                homeUrl: homeUrl,
            }}
            session={session ? session : null}
            authentication={auth}
        >
            <DashboardLayout
                slots={{
                    sidebarFooter: SidebarFooter,
                    toolbarAccount: ToolbarAccount
                }}
            >
                <div className="outlet">
                    <Outlet/>
                </div>
            </DashboardLayout>
        </ReactRouterAppProvider>
    );
}