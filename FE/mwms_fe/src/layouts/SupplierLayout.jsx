import {Task} from "@mui/icons-material";
import {DashboardUI} from "../components/ui/DashboardUI.jsx";

const navigation = [
    {
        segment: 'sp/request',
        title: 'Import request',
        icon: <Task/>,
    }
]

export default function SupplierLayout() {
    return (
        <DashboardUI navigate={navigation} homeUrl={"/sp"}/>
    )
}