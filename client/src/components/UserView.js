import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ProductCard from "./ProductCard";

export default function UserView({ productData }) {
    const [products, setProducts] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const activeProducts = productData.filter(product => product.isActive);
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
    }, [productData]);

    const handleSearchByName = () => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleSearchByPrice = () => {
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Infinity;
        const filtered = products.filter(product =>
            product.price >= min && product.price <= max
        );
        setFilteredProducts(filtered);
    };

    const handleClear = () => {
        setSearchName('');
        setMinPrice('');
        setMaxPrice('');
        setFilteredProducts(products);
    };

    const incrementMinPrice = () => {
        setMinPrice(prev => (parseFloat(prev) || 0) + 1000);
    };

    const decrementMinPrice = () => {
        setMinPrice(prev => Math.max((parseFloat(prev) || 0) - 1000, 0));
    };

    const incrementMaxPrice = () => {
        setMaxPrice(prev => (parseFloat(prev) || 0) + 1000);
    };

    const decrementMaxPrice = () => {
        setMaxPrice(prev => Math.max((parseFloat(prev) || 0) - 1000, 0));
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <h2 className="mb-4">Product Search</h2>
                    <Form>
                        <Row className="mb-3">
                            <Col xs={12} className="mb-2">
                                <Form.Group controlId="searchName">
                                    <Form.Label>Search by Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product name"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} className="mb-2">
                                <Form.Group controlId="minPrice">
                                    <Form.Label>Minimum Price:</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Button variant="secondary" onClick={decrementMinPrice} className="text-light bg-dark">-</Button>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min price"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="mx-2"
                                        />
                                        <Button variant="secondary" onClick={incrementMinPrice} className="text-light bg-dark">+</Button>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col xs={12} className="mb-2">
                                <Form.Group controlId="maxPrice">
                                    <Form.Label>Maximum Price:</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Button variant="secondary" onClick={decrementMaxPrice} className="text-light bg-dark">-</Button>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max price"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="mx-2"
                                        />
                                        <Button variant="secondary" onClick={incrementMaxPrice} className="text-light bg-dark">+</Button>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="mb-4">
                            <Button variant="primary" onClick={handleSearchByName} className="mx-2">
                                Search by Name
                            </Button>
                            <Button variant="primary" onClick={handleSearchByPrice} className="mx-2">
                                Search by Price
                            </Button>
                            <Button variant="danger" onClick={handleClear} className="mx-2">
                                Clear
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
						<hr></hr>
            <h1 className="my-4 text-center">Our Products</h1>
            <div className="justify-content-center my-5" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product._id} productProp={product} />
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </Container>
    );
}
