import {Outlet, useNavigate} from "react-router-dom";
import style from "../styles/Layout.module.css";
import {Menu, MenuItem, Sidebar} from "react-pro-sidebar";

function GenerateNavbar() {
    const navigate = useNavigate();
    return (
        <div className={`vw-17`}>
            <h1 className={style.title}>Partner</h1>
            <Sidebar collapsed={false} className={style.sidebar} backgroundColor={'#222222'}>
                <Menu closeOnClick={true} className={style.menu}>
                    <MenuItem onClick={() => {navigate("/sp/request")}}>Import Request</MenuItem>
                </Menu>
            </Sidebar>
            <div className={style.profile}>
                <img src={""} alt=""/>
                <label>Account Name</label>
            </div>
            <div className={style.footer}>
                <p>&copy; {new Date().getFullYear()} MWMS. All rights reserved</p>
            </div>
        </div>
    )
}

export default function SupplierLayout() {
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