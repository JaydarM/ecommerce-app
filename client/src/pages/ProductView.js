import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

// For Message Notifications
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function ProductView() {
	const notyf = new Notyf();
	const { productId } = useParams();
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	// States
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(1);

	async function addToCart(productId) {

		try {

			const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					productId: productId,
					quantity: quantity,
					subtotal: price * quantity
				})
			})

			const data = await response.json();
			if (data.message === "Item added to cart successfully") {
				notyf.success("Item Added to Cart");
				navigate("/cart");
			} else {
				notyf.error("Something went wrong");
			}

		} catch (error) {
    		notyf.error("Something went wrong");
            console.error(error);
    	}

	}

	useEffect(() => {

		const fetchProductInfo = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
				const data = await response.json();
				setName(data.name);
				setDescription(data.description);
				setPrice(data.price);
			} catch (error) {
	    		notyf.error("Something went wrong");
	            console.error(error);
    		}
		}
		
	}, [productId]);

	return (
		<Container className='my-5'>
			<Row>
				<Col>
					<Card> 
						<Card.Body >
							<Card.Title className='text-center' style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
								{name}
							</Card.Title>
							<Card.Subtitle>Description: </Card.Subtitle>
							<Card.Text>{description}</Card.Text>
							<Card.Subtitle>Price:</Card.Subtitle>
							<Card.Text>Php {price}</Card.Text>

							<div className="d-flex align-items-center mb-3">
								<Button 
									variant="secondary" 
									onClick={() => setQuantity(q => Math.max(q - 1, 1))} 
									className="me-2"
								>
									-
								</Button>
								<span className="mx-2">
							        <Form.Control 
								        type="number"
								        required
							        	value={quantity} 
							        	defaultValue={1}
							        	onChange={e => {setQuantity(e.target.value)}}
							        />
								</span>
								<Button 
									variant="secondary" 
									onClick={() => setQuantity(q => q + 1)} 
									className="ms-2"
								>
									+
								</Button>
							</div>

                            {(user.id !== null) ? (
                            	<Button variant="primary" block onClick={() => addToCart(productId)}>Add to Cart</Button>
                            ) : (
                            	<Link className="btn btn-danger" to="/login">Login to Buy</Link>
                            )}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}
