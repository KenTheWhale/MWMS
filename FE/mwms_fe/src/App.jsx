import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ManagerLayout from "./layouts/ManagerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";
import SupplierLayout from "./layouts/SupplierLayout.jsx";
import RequesterLayout from "./layouts/RequesterLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'

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
                element: <Navigate to={"/manager/request"}/>
            },
            {
                path: "request/import",
                element: <h1 className={`d-flex justify-content-center text-light`}>Import Request</h1>
            },
            {
                path: "request/export",
                element: <h1 className={`d-flex justify-content-center text-light`}>Export Request</h1>
            },
            {
                path: "batch",
                element: <h1 className={`d-flex justify-content-center text-light`}>Batch</h1>
            },
            {
                path: "task",
                element: <h1 className={`d-flex justify-content-center text-light`}>Task</h1>
            },
            {
                path: "area",
                element: <h1 className={`d-flex justify-content-center text-light`}>Area</h1>
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout/>,
        children:[
            {
                index: true,
                element: <Navigate to={"/admin/account"}/>,
            },
            {
                path: "account",
                element: <h1 className={`d-flex justify-content-center text-light`}>Account Management</h1>,
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
        element: <Navigate to={"/manager"}/>
    }
])

function App() {
    return <RouterProvider router={router}/>
}

export default App
