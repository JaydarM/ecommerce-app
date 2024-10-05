import { useState, useEffect, useContext } from 'react';
import UserContext from "../context/UserContext";

// For Notification Messages
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Components
import UserView from "../components/UserView";
import AdminDashboard from "../components/AdminDashboard";

export default function Products() {

	const notyf = new Notyf();

	const { user } = useContext(UserContext);

	const [products, setProducts] = useState([]);

	async function fetchData() {

		try {

			let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/` : `${process.env.REACT_APP_API_BASE_URL}/products/active`;
			const response = await fetch(fetchUrl, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});

			const data = await response.json();
			setProducts(data);

		} catch (error) {
    		notyf.error("Something went wrong");
            console.error(error);
    	}

	}

	// Update Product Information
	useEffect(() => {
		fetchData();
	}, [user]);

	return (
		<>
			{(user.isAdmin === true)?
				<AdminDashboard productData={products} fetchData={fetchData} />
				:
				<UserView productData={products} />
			}
		</>
	);
}
