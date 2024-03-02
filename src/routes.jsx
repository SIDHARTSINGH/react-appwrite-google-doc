import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import TextEditor from "./components/TextEditor";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    element: <PrivateRoutes />,
    children: [
      { path: "user/:id", element: <Profile /> },
      { path: "user/:userid/doc/:docid", element: <TextEditor /> },
    ],
  },
]);

export default router;
