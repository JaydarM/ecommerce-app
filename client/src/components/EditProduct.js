import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

// For Message Notifications
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function EditProduct({product, fetchData}) {

	const notyf = new Notyf();

	const productId = product._id;
	const [name, setName] = useState(product.name);
	const [description, setDescription] = useState(product.description);
	const [price, setPrice] = useState(product.price);

	// State to Open and Close Modals
	const [showEdit, setShowEdit] = useState(false);

	const openEdit = () => {
		setShowEdit(true);
	}

	const closeEdit = () => {
		setShowEdit(false);
		setName("");
		setDescription("");
		setPrice(0);
	}

	const editProduct = (e, productId) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`, {
			method: "PATCH",
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

			if(data.success === true) {
				notyf.success("Product Updated");
				closeEdit();
				fetchData();
			} else {
				notyf.error("Something went wrong");
				closeEdit();
				fetchData();
			}

		})
	}

	return (
		<>
			<Button variant="primary" size="sm" onClick={() => openEdit(product)}> Edit </Button>

			{/*Edit Product Modal*/}
			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editProduct(e, productId)}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Product</Modal.Title>
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
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
				</Form>
			</Modal>
		</>
	)
}