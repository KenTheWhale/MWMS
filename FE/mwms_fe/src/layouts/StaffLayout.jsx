import {Apps, Assignment, Inventory2} from "@mui/icons-material";
import {DashboardUI} from "../components/ui/DashboardUI.jsx";

const navigation = [
    {
        segment: 'staff/task',
        title: 'Task',
        icon: <Assignment/>,
    },
    {
        segment: 'staff/batch',
        title: 'Batch',
        icon: <Inventory2/>,
    },
    {
        segment: 'staff/area',
        title: 'Area',
        icon: <Apps/>,
    }
]

export default function StaffLayout() {
    return (
        <DashboardUI navigate={navigation} homeUrl={"/staff"}/>
    )
}