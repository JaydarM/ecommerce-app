import { useState, useEffect, useContext } from 'react';
import UserContext from "../context/UserContext";
import CartItemCard from "../components/CartItemCard";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// For Notification Messages
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Cart() {

    const navigate = useNavigate();
	const notyf = new Notyf();

    const { user } = useContext(UserContext);

    const [title, setTitle] = useState("Cart Empty");
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error === "No cart found" || data.cart.cartItems.length === 0) {
                setTitle("Cart Empty");
                setCartItems([]);
                setTotalPrice(0);
            } else {
                setTitle("Cart");
                setCartItems(data.cart.cartItems);
                setTotalPrice(data.cart.totalPrice);
            }
        })
        .catch(error => console.error("Fetch error:", error));
    }

    useEffect(() => {
        fetchData();
    }, []);

    const removeItem = (productId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Item removed from cart successfully") {
                setCartItems(cartItems.filter(item => item.productId !== productId));
            } else {
                console.error("Error removing item:", data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
    };

    const clearCart = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Cart cleared successfully") {
                setCartItems([]);
                setTotalPrice(0);
            } else {
                console.error("Error clearing cart:", data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
    };

    const checkout = () => {
        if (user.isAdmin) {
            alert("Admin cannot checkout");
            return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
            	productsOrdered: cartItems
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Ordered Successfully") {
                notyf.success("Checked Out Cart");
                setCartItems([]);
                setTotalPrice(0); 

                navigate("/orders");
            } else {
            	notyf.error("Something went wrong");
                console.error("Error placing order:", data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
    };

    return (
        <>
            <h1>{title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {cartItems.map(cartItem => (
                    <CartItemCard 
                        key={cartItem.productId} 
                        cartItem={cartItem}
                        removeItem={removeItem}
                        fetchData={fetchData}
                    />
                ))}
            </div>
            <h2>Total: PHP {totalPrice}</h2>
            <div className="d-flex justify-content-between">
                <Button variant="danger" onClick={clearCart}>Clear All Items</Button>
                <Button variant="success" onClick={checkout}>Checkout</Button>
            </div>
        </>
    );
}
