import { useState, useEffect, useContext } from 'react';
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

import OrderListView from "../components/OrderListView";

export default function Order() {

	const { user } = useContext(UserContext);

	const [orders, setOrders] = useState([]);
	const [hasOrders, setHasOrders] = useState(false);

	const fetchOrderData = () => {

		let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/orders/all-orders` : `${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`;

		fetch(fetchUrl, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if(data.message === "No orders found for this user" || data.error === "No orders found") {
				setHasOrders(false);
			} else {
				setHasOrders(true);
				setOrders(data.orders);
			}
		})
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