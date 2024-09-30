import { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";

export default function OrderItemView({ orderedProduct }) {

	const { productId, quantity, subtotal } = orderedProduct;

	const [productName, setProductName] = useState("")

	const getProductInfo = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
        .then(res => res.json())
        .then(data => {
            setProductName(data.name);
        });
    }

    useEffect(() => {
        getProductInfo();
    }, [productId]);

	return (
		<Container fluid>
			<Row>
				<Col xs={2}>{productId}</Col>
				<Col xs={6}>{productName}</Col>
				<Col>Quantity: {quantity}</Col>
				<Col>Subtotal: PHP {subtotal}</Col>
			</Row>
		</Container>
	)
}