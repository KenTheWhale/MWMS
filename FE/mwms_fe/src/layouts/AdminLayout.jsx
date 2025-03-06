import {DashboardUI} from "../components/ui/DashboardUI.jsx";
import {Dashboard, ManageAccounts} from "@mui/icons-material";

const navigation = [
    {
        segment: 'admin/dashboard',
        title: 'Dashboard',
        icon: <Dashboard/>,
    },
    {
        segment: 'admin/account',
        title: 'Accounts',
        icon: <ManageAccounts/>,
    }
]

export default function AdminLayout() {
    return (
        <DashboardUI navigate={navigation} homeUrl={"/admin"}/>
    )
}