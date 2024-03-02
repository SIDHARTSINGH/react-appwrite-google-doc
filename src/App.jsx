import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoutes from "./utils/PrivateRoutes";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import TextEditor from "./components/TextEditor";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/user/:id" element={<Profile />} />
            <Route path="/user/:userId/doc/:docId" element={<TextEditor />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
