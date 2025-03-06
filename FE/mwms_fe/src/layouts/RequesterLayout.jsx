import {DashboardUI} from "../components/ui/DashboardUI.jsx";
import {GetApp} from "@mui/icons-material";

const navigation = [
    {
        segment: 'rq/request',
        title: 'Request equipments',
        icon: <GetApp/>,
    }
]

export default function RequesterLayout() {
    return (
        <DashboardUI navigate={navigation} homeUrl={"/rq"}/>
    )
}