import { Button } from 'react-bootstrap';

// For Notification
import { Notyf } from 'notyf';

export default function ArchiveProduct({product, isActive, fetchData}) {

	const notyf = new Notyf();

	const productId = product._id;

	const archiveToggle = async () => {

		try {

			const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});

			const data = await response.json();
			if(data.success === true) {
				notyf.success("Successfully Archived");
				fetchData();
			} else {
				notyf.error("Something went wrong");
				fetchData();
			}

		} catch (error) {
            notyf.error("Something went wrong");
            console.error(error);
        }

	}

	const activateToggle = async () => {

		try {

			const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});

			const data = await response.json();
			if(data.success === true) {
				notyf.success("Successfully Activated");
				fetchData();
			} else {
				notyf.error("Something went wrong");
				fetchData();
			}

		} catch (error) {
            notyf.error("Something went wrong");
            console.error(error);
        }

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