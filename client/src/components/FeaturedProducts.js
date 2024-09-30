import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    //console.log(process.env.REACT_APP_API_BASE_URL);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center">Featured Products</h2>
            <Row className="justify-content-center">
                {products && products.length > 0 ? (
                    products.map(product => (
                        product && product._id ? (
                            <Col xs={12} sm={6} md={4} lg={3} key={product._id} className="mb-4">
                                <ProductCard productProp={product} />
                            </Col>
                        ) : null
                    ))
                ) : (
                    <p>No featured products available.</p>
                )}
            </Row>
        </Container>
    );
}
