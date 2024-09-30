import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
    return (
        <Container>
            <h1 className='text-center mt-5'>Welcome to our E-Commerce Website</h1>
            <p className='text-center'>Products for everyone, everywhere</p>
            <div className='text-center mb-4'>
                <Link to="/products">
                    <Button variant="primary">Browse Products</Button>
                </Link>
            </div>
            <FeaturedProducts />
        </Container>
    );
}
