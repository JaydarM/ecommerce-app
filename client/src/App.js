import './App.css';
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { Suspense, lazy } from "react";

// For Notification Messages
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Pages and Components
import AppNavbar from "./components/AppNavbar";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Logout"));
const Products = lazy(() => import("./pages/Products"));
const ProductView = lazy(() => import("./pages/ProductView"));
const Cart = lazy(() => import("./pages/Cart"));
const Orders = lazy(() => import("./pages/Orders"));

function App() {

  const notyf = new Notyf();

  // Set Up User Context
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  // Logout User
  function unsetUser() {
    localStorage.clear();
  }

  // Get User Details to stay logged in and set context
  useEffect(() => {

    const fetchUserData = async (token) => {
      try {

        const response = fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.user !== undefined) {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin
          });
        } else {
          notyf.error("Something went wrong");
        }

      } catch (error) {
        notyf.error("Something went wrong");
        console.error(error);
      }
    }

    const token =  localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }

  }, [user.id]);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<ProductView />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Container>
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;
