import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ManagerLayout from "./layouts/ManagerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";
import SupplierLayout from "./layouts/SupplierLayout.jsx";
import RequesterLayout from "./layouts/RequesterLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashDefault from "./view/dashboard/index.jsx";
import "./index.scss"
import ImportRequestPage from "./pages/manager/ImportRequestPage.jsx";
import BatchManagePage from "./pages/manager/BatchManagePage.jsx";
import ExportRequestPage from "./pages/manager/ExportRequestPage.jsx";
import EquipmentPage from "./pages/manager/EquipmentPage.jsx";
import CategoryPage from "./pages/manager/CategoryPage.jsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/manager",
        element: <ManagerLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to={"/manager/request/import"}/>
            },
            {
                path: "request/import",
                element: <ImportRequestPage/>
            },
            {
                path: "request/export",
                element: <ExportRequestPage/>
            },
            {
                path: "batch",
                element: <BatchManagePage/>
            },
            {
                path: "task",
                element: <h1 className={`d-flex justify-content-center text-light`}>Task</h1>
            },
            {
                path: "area",
                element: <h1 className={`d-flex justify-content-center text-light`}>Area</h1>
            },
            {
                path: "equipment",
                element:<EquipmentPage/>
            },
            {
                path: "category",
                element:<CategoryPage/>
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout/>,
        children:[
            {
                index: true,
                element: <Navigate to={"/admin/dashboard"}/>,
            },
            {
                path: "dashboard",
                element: <DashDefault/>,
            },
            {
                path: "account",
                element: <h1 className={`d-flex justify-content-center text-light`}>Account</h1>,
            }
        ]
    },
    {
        path: "/staff",
        element: <StaffLayout/>,
        children:[
            {
                index: true,
                element: <Navigate to={"/staff/task"}/>
            },
            {
                path: "task",
                element: <h1 className={`d-flex justify-content-center text-light`}>Task</h1>
            },
            {
                path: "batch",
                element: <h1 className={`d-flex justify-content-center text-light`}>Batch</h1>
            },
            {
                path: "area",
                element: <h1 className={`d-flex justify-content-center text-light`}>Area</h1>
            }
        ]
    },
    {
        path: "/sp",
        element: <SupplierLayout/>,
        children:[
            {
                index: true,
                element: <Navigate to={"/sp/request"}/>
            },
            {
                path: "request",
                element: <h1 className={`d-flex justify-content-center text-light`}>Import Request</h1>
            }
        ]
    },
    {
        path: "/rq",
        element: <RequesterLayout/>,
        children:[
            {
                index: true,
                element: <Navigate to={"/rq/request"}/>
            },
            {
                path: "request",
                element: <h1 className={`d-flex justify-content-center text-light`}>Request Equipments</h1>
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={"/login"}/>
    }
])

function App() {
    return <RouterProvider router={router}/>
}

export default App
