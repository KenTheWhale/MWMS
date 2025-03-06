import {
    Apps,
    Archive,
    Assignment,
    AutoAwesomeMosaic,
    InsertDriveFile,
    Inventory2,
    MedicalServices,
    Unarchive
} from "@mui/icons-material";
import {DashboardUI} from "../components/ui/DashboardUI.jsx";

const navigation = [
    {
        segment: 'manager/request',
        title: 'Request',
        icon: <InsertDriveFile/>,
        children: [
            {
                segment: 'import',
                title: 'Import request',
                icon: <Archive/>,
            },
            {
                segment: 'export',
                title: 'Export request',
                icon: <Unarchive/>,
            }
        ]
    },
    {
        segment: 'manager/batch',
        title: 'Batch',
        icon: <Inventory2/>,
    },
    {
        segment: 'manager/task',
        title: 'Task',
        icon: <Assignment/>,
    },
    {
        segment: 'manager/equipment',
        title: 'Equipment',
        icon: <MedicalServices/>,
    },
    {
        segment: 'manager/category',
        title: 'Category',
        icon: <AutoAwesomeMosaic/>,
    },
    {
        segment: 'manager/area',
        title: 'Area',
        icon: <Apps/>,
    }
]

export default function ManagerLayout() {
    return (
        <DashboardUI navigate={navigation} homeUrl={"/manager"}/>
    )
}