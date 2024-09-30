import { Button } from 'react-bootstrap';

// For Notification
import { Notyf } from 'notyf';

export default function ArchiveProduct({product, isActive, fetchData}) {

	const notyf = new Notyf();

	const productId = product._id;

	const archiveToggle = () => {
		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(res => res.json())
		.then(data => {
			if(data.success === true) {
				notyf.success("Successfully Archived");
				fetchData();
			} else {
				notyf.error("Something went wrong");
				fetchData();
			}
		})
	}

	const activateToggle = () => {
		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(res => res.json())
		.then(data => {
			if(data.success === true) {
				notyf.success("Successfully Activated");
				fetchData();
			} else {
				notyf.error("Something went wrong");
				fetchData();
			}
		})
	}

	return (
		<>
			{isActive ?
				<Button variant="danger" size="sm" onClick={() => archiveToggle()}>Archive</Button>
				:
				<Button variant="success" size="sm" onClick={() => activateToggle()}>Activate</Button>
			}
		</>
	)
}