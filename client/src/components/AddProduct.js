import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

// For Message Notifications
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AddProduct({ fetchData }) {

	const notyf = new Notyf();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);

	// State to Open and Close Modals
	const [showAdd, setShowAdd] = useState(false);

	const openAdd = () => {
		setShowAdd(true);
	}

	const closeAdd = () => {
		setShowAdd(false);
		setName("");
		setDescription("");
		setPrice(0);
	}

	function createProduct(e) {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data.product !== undefined) {
				notyf.success("Product Added");

				setName("")
                setDescription("")
                setPrice(0);
                closeAdd();
                fetchData();
			} else {
				notyf.error("Error: Something Went Wrong.");
				closeAdd();
			}
		})
	}

	return (
		<>
			<Button variant="primary" onClick={() => openAdd()}> Add Product </Button>

			{/*Add Product Modal*/}
			<Modal show={showAdd} onHide={closeAdd}>
                <Form onSubmit={e => createProduct(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Product</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                                required/>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeAdd}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
		</>
	)
}