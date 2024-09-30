import { useContext } from 'react';
import { Accordion, Container, Row, Col, Stack } from 'react-bootstrap';
import UserContext from "../context/UserContext";

// Import Components
import OrderItemView from "./OrderItemView";

export default function OrderListView({ order }) {

	const { user } = useContext(UserContext);

	const orderDate = new Date(order.orderedOn);

	return (
		<Accordion className="my-3" defaultActiveKey="0">
	      	<Accordion.Item eventKey="0">
	        	<Accordion.Header>
	        		<Stack gap={3}>
	        			{(user.isAdmin) ?
	        				<h5 className="d-block">User ID: {order.userId}</h5>
	        				:
	        				<></>
	        			}
	        			<h6>Order ID: {order._id}</h6>
	        		</Stack>
	        	</Accordion.Header>
	        	<Accordion.Body>
	        		{order.productsOrdered.map(orderedProduct => (
	        			<>
	        				<OrderItemView key={orderedProduct.productId} orderedProduct={orderedProduct} />
	        			</>
	        		))}
	        	</Accordion.Body>
	        	<Container fluid>
	        		<Row>
	        			<Col>Order Date: {orderDate.toString()}</Col>
	        			<Col xs={3}>
	        				<h5>Total Price: PHP {order.totalPrice}</h5>
	        			</Col>
	        		</Row>
	        		<Row>
	        			<Col>Status: {order.status}</Col>
	        		</Row>
	        	</Container>
	      	</Accordion.Item>
	    </Accordion>
	)
}