import { useState, useEffect, useContext } from 'react';
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

// For Notification Messages
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

import OrderListView from "../components/OrderListView";

export default function Order() {

	const notyf = new Notyf();

	const { user } = useContext(UserContext);

	const [orders, setOrders] = useState([]);
	const [hasOrders, setHasOrders] = useState(false);

	const fetchOrderData = async () => {

		try {

			let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/orders/all` : `${process.env.REACT_APP_API_BASE_URL}/orders/`;

			const response = await fetch(fetchUrl, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});

			const data = await response.json();
			if(data.message === "No orders found for this user" || data.error === "No orders found") {
				setHasOrders(false);
			} else {
				setHasOrders(true);
				setOrders(data.orders);
			}

		} catch (error) {
            notyf.error("Something went wrong");
            console.error(error);
        }

	}

	useEffect(() => {
		fetchOrderData();
	}, [])

	return (
		<>
		{(user.id !== null) ?
			<>
			<h1>Orders</h1>
			{(hasOrders) ?
				<>
					{orders.map(order => (
						<OrderListView key={order._id} order={order} />
					))}
				</>
				:
				<h2>No Orders</h2>
			}
			</>
			:
			<Navigate to="/login" />
		}
		</>
	)
}