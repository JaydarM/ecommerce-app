import { useState, useEffect, useContext } from 'react';
import UserContext from "../context/UserContext";

// Components
import UserView from "../components/UserView";
import AdminDashboard from "../components/AdminDashboard";

export default function Products() {

	const { user } = useContext(UserContext);
	//console.log(user);

	const [products, setProducts] = useState([]);

	const fetchData = () => {

		let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` : `${process.env.REACT_APP_API_BASE_URL}/products/active`;

		fetch(fetchUrl, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(res => res.json())
		.then(data => {
			setProducts(data);
		});
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
