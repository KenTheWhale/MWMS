import {DashboardLayout} from "@toolpad/core";
import {Outlet} from "react-router-dom";
import '../../styles/ui/dashboard.css'
import {Typography} from "@mui/material";
import {useState} from "react";
import PropTypes from "prop-types";
import {ReactRouterAppProvider} from "@toolpad/core/react-router";

DashboardUI.proTypes = {
    navigate: PropTypes.array.isRequired,
    homeUrl: PropTypes.string.isRequired
}

/* eslint-disable react/prop-types */
function SidebarFooter({ mini }) {
    return (
        <Typography
            variant="caption"
            sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
            {mini ? '© M115' : `© ${new Date().getFullYear()} Medic115. All rights reversed`}
        </Typography>
    );
}

export function DashboardUI({navigate, homeUrl}){
    const [session, setSession] = useState({
        user: {
            name: "Test",
            email: "Test"
        }
    })

    const authen = {
        signIn: () => {
            setSession(session);
        },
            signOut: () => {
            setSession(null);
        },
    }


    return(
        <ReactRouterAppProvider
            navigation={navigate}
            branding={{
                logo: <img src = "/medic.png" alt = "Medic icon" />,
                title: "MEDIC115",
                homeUrl: homeUrl
            }}
            session={session}
            authentication={authen}
        >
            <DashboardLayout slots={{
                sidebarFooter: SidebarFooter
            }}>
                <Outlet className="outlet"/>
            </DashboardLayout>
        </ReactRouterAppProvider>
    )
}