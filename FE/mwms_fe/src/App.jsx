import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ManagerLayout from "./layouts/ManagerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";
import SupplierLayout from "./layouts/SupplierLayout.jsx";
import RequesterLayout from "./layouts/RequesterLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashDefault from "./view/dashboard/index.jsx";
import ImportRequestPage from "./pages/manager/ImportRequestPage.jsx";
import BatchManagePage from "./pages/manager/BatchManagePage.jsx";
import ExportRequestPage from "./pages/manager/ExportRequestPage.jsx";
import EquipmentPage from "./pages/manager/EquipmentPage.jsx";
import CategoryPage from "./pages/manager/CategoryPage.jsx";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import TaskPage from "./pages/manager/TaskPage.jsx";
import {authReducer} from "./reducers/AuthReducer.jsx";
import ProtectedRoute from "./config/ProtectedRoute.jsx";
import Unauthorized from "./view/Unauthorized.jsx";

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
        element: <ImportRequestPage />,
      },
      {
        path: "request/export",
        element: <ExportRequestPage />,
      },
      {
        path: "batch",
        element: <BatchManagePage />,
      },
      {
        path: "task",
        element: <TaskPage />,
      },
      {
        path: "area",
        element: (
          <h1 className={`d-flex justify-content-center text-light`}>Area</h1>
        ),
      },
      {
        path: "equipment",
        element: <EquipmentPage />,
      },
      {
        path: "category",
        element: <CategoryPage />,
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
        element: (
          <h1 className={`d-flex justify-content-center text-light`}>
            Import Request
          </h1>
        ),
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
        </Provider>
    )
}

export default App
