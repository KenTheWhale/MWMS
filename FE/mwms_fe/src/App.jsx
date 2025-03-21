import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ManagerLayout from "./layouts/ManagerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";
import SupplierLayout from "./layouts/SupplierLayout.jsx";
import RequesterLayout from "./layouts/RequesterLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashDefault from "./view/dashboard/index.jsx";
import ImportRequest from "./components/manager/ImportRequest.jsx";
import {BatchManage} from "./components/manager/BatchManage.jsx";
import ExportRequest from "./components/manager/ExportRequest.jsx";
import Equipment from "./components/manager/Equipment.jsx";
import Category from "./components/manager/Category.jsx";
import Task from "./components/manager/Task.jsx";
import Unauthorized from "./view/Unauthorized.jsx";
import ProtectedRoute from "./config/ProtectedRoute.jsx";
import Request from "./components/partner/Request.jsx";
import AreaPage from "./components/manager/AreaPage.jsx";
import 'react-toastify/dist/ReactToastify.css';
import PositionPage from "./components/manager/PositionPage.jsx";
import "react-datepicker/dist/react-datepicker.css";
import {SnackbarProvider} from "notistack";
import Admin from "./components/admin/Account.jsx";
import {TaskStaff} from "./components/staff/TaskStaff.jsx";
import {Dashboard} from "./components/manager/Dashboard.jsx";
import ImportHistory from "./components/manager/ImportHistory.jsx";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={"manager"}>
        <ManagerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/manager/dashboard"} />,
      },
      {
        path: "dashboard",
        element: <Dashboard/>,
      },
      {
        path: "request",
        element: <Navigate to={"/manager/request/import"} />,
      },
      {
        path: "request/import",
        element: <ImportRequest />,
      },
      {
        path: "request/export",
        element: <ExportRequest />,
      },
      {
        path: "batch",
        element: <BatchManage />,
      },
      {
        path: "task",
        element: <Task/>,
      },
      {
        path: "area",
        element: (
          <AreaPage/>
        ),
      },
      {
        path: "position/:id",
        element: (
          <PositionPage/>
        )
      },
      {
        path: "equipment",
        element: <Equipment />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "history",
        element: <ImportHistory />,
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={"admin"}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/admin/dashboard"} />,
      },
      {
        path: "dashboard",
        element: <DashDefault />,
      },
      {
        path: "account",
        element: (
         <Admin/>
        ),
      },
    ],
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={"staff"}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/staff/task"} />,
      },
      {
        path: "task",
        element: <TaskStaff/>,
      }
      // {
      //   path: "batch",
      //   element: (
      //     <h1 className={`d-flex justify-content-center text-light`}>Batch</h1>
      //   ),
      // },
      // {
      //   path: "area",
      //   element: (
      //     <h1 className={`d-flex justify-content-center text-light`}>Area</h1>
      //   ),
      // },
    ],
  },
  {
    path: "/sp",
    element: (
        <ProtectedRoute allowedRoles={"partner"}>
          <SupplierLayout/>
        </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/sp/request"} />,
      },
      {
        path: "request",
        element: <Request />,
      },
    ],
  },
  {
    path: "/rq",
    element: (
        <ProtectedRoute allowedRoles={"partner"}>
          <RequesterLayout/>
        </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/rq/request"} />,
      },
      {
        path: "request",
        element: (
          <h1 className={`d-flex justify-content-center text-light`}>
            Request Equipments
          </h1>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized/>
  },
  {
    path: "*",
    element: <Navigate to={"/login"} />,
  },
]);

function App() {
    return (
        <SnackbarProvider maxSnack={4} anchorOrigin={{horizontal: "right", vertical: "top"}} autoHideDuration={1000}>
            <RouterProvider router={router}/>
        </SnackbarProvider>
    )
}

export default App
