import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ManagerLayout from "./layouts/ManagerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";
import SupplierLayout from "./layouts/SupplierLayout.jsx";
import RequesterLayout from "./layouts/RequesterLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashDefault from "./view/dashboard/index.jsx";
import ImportRequest from "./components/manager/ImportRequest.jsx";
import BatchManage from "./components/manager/BatchManage.jsx";
import ExportRequest from "./components/manager/ExportRequest.jsx";
import Equipment from "./components/manager/Equipment.jsx";
import Category from "./components/manager/Category.jsx";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import Task from "./components/manager/Task.jsx";
import {authReducer} from "./reducers/AuthReducer.jsx";
import Unauthorized from "./view/Unauthorized.jsx";
import ProtectedRoute from "./config/ProtectedRoute.jsx";
import Request from "./components/partner/Request.jsx";
import AreaPage from "./components/manager/AreaPage.jsx";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={["MANAGER"]}>
        <ManagerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
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
        element: <Task />,
      },
      {
        path: "area",
        element: (
          <AreaPage/>
        ),
      },
      {
        path: "equipment",
        element: <Equipment />,
      },
      {
        path: "category",
        element: <Category />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
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
          <h1 className={`d-flex justify-content-center text-light`}>
            Account
          </h1>
        ),
      },
    ],
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={["STAFF"]}>
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
        element: (
          <h1 className={`d-flex justify-content-center text-light`}>Task</h1>
        ),
      },
      {
        path: "batch",
        element: (
          <h1 className={`d-flex justify-content-center text-light`}>Batch</h1>
        ),
      },
      {
        path: "area",
        element: (
          <h1 className={`d-flex justify-content-center text-light`}>Area</h1>
        ),
      },
    ],
  },
  {
    path: "/sp",
    element: (
        <ProtectedRoute allowedRoles={["PARTNER"]}>
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
        <ProtectedRoute allowedRoles={["PARTNER"]}>
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

const store = configureStore({
  reducer: {
    authReducer: authReducer,
  },
});

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router}/>
            <ToastContainer/>
        </Provider>
    )
}

export default App
