import {Outlet, useNavigate} from "react-router-dom";
import style from "../styles/Layout.module.css";
import {Menu, MenuItem, Sidebar} from "react-pro-sidebar";
import {CgLogOut} from "react-icons/cg";

function GenerateNavbar() {
    const navigate = useNavigate();
    return (
        <div className={`vw-17`}>
            <h1 className={style.title}>MEDIC115</h1>
            <Sidebar collapsed={false} className={style.sidebar} backgroundColor={'#222222'}>
                <Menu closeOnClick={true} className={style.menu}>
                    <MenuItem onClick={() => {
                        navigate("/staff/task")
                    }}>Task</MenuItem>
                    <MenuItem onClick={() => {
                        navigate("/staff/batch")
                    }}>Batch</MenuItem>
                    <MenuItem onClick={() => {
                        navigate("/staff/area")
                    }}>Area</MenuItem>
                </Menu>
            </Sidebar>
            <div className={style.profile}>
                <div className={style.label_area}>
                    <label>Account Name</label>
                    <p>STAFF</p>
                </div>
                <CgLogOut onClick={() => {
                    navigate("/login")
                }}/>
            </div>
            <div className={style.footer}>
                <p>&copy; {new Date().getFullYear()} MWMS. All rights reserved</p>
            </div>
        </div>
    )
}

export default function StaffLayout() {
    return (
        <div className={style.main}>
            <div className={style.navbar_area}>
                <GenerateNavbar/>
            </div>
            <div className={style.outlet_area}>
                <Outlet/>
            </div>
        </div>
    )
}