import './App.css';
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { Suspense, lazy } from "react";

// Pages and Components
import AppNavbar from "./components/AppNavbar";
/*import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import Cart from "./pages/Cart";*/

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

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  // Logout User
  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log(data.user)
        console.log(data.user !== undefined)

        // Keeps you logged in
        if (data.user !== undefined) { 
          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin
          })

          //console.log(user);
        } else {
          setUser({
            id: null,
            isAdmin: null
          });
        }
      })
    }
    
  }, [user.id])

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
