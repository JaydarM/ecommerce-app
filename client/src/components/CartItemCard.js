import { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

// For Notification Messages
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function CartItemCard({ cartItem, removeItem, fetchData }) {

    const notyf = new Notyf();

    const { productId, quantity, subtotal } = cartItem;

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productQuantity, setProductQuantity] = useState(quantity);
    const [productSubtotal, setProductSubtotal] = useState(subtotal);

    const getProductInfo = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);

            const data = response.json();
            setProductName(data.name);
            setProductDescription(data.description);
            setProductPrice(data.price);

        } catch (error) {
            notyf.error("Something went wrong");
            console.error(error);
        }

    }

    useEffect(() => {
        getProductInfo();
    }, [productId]);

    const updateProductQuantity = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-quantity`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    productId: productId,
                    newQuantity: productQuantity
                })
            });

            const data = response.json();
            if(data.message === "Item quantity updated successfully") {
                fetchData();
            }

        } catch (error) {
            notyf.error("Something went wrong");
            console.error(error);
        }

    }

    useEffect(() => {
        updateProductQuantity();
    }, [productQuantity, productPrice]);

    const addOne = () => {
        setProductQuantity((prev) => prev + 1);
    }

    const minusOne = () => {
        if (productQuantity > 1) {
            setProductQuantity((prev) => prev - 1);
        }
    }

    return (
        <Card className="d-flex flex-column" style={{ width: '19rem', height: '300px', display: 'flex', flexDirection: 'column' }}>
            <Card.Body className="d-flex flex-column">
                <Card.Title 
                    style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                    }}
                >
                    {productName}
                </Card.Title>
                <Card.Text>{productDescription}</Card.Text>
                <div className="d-flex flex-column justify-content-between flex-grow-1">
                    <Card.Text>Quantity: {productQuantity}</Card.Text>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="primary" onClick={addOne}>+</Button>
                        <Form.Control 
                            type="number"
                            required
                            value={productQuantity} 
                            defaultValue={1}
                            onChange={e => {setProductQuantity(e.target.value)}}
                        />
                        <Button variant="danger" onClick={minusOne}>-</Button>
                    </div>
                    <Card.Text><strong>PHP {productSubtotal}</strong></Card.Text>
                    <Button variant="danger" onClick={() => removeItem(productId)}>Remove Item</Button>
                </div>
            </Card.Body>
        </Card>
    );
}
