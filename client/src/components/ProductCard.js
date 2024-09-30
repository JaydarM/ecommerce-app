import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
    const { _id, name, description, price } = productProp;

    return (
        <Card className="d-flex flex-column m-2" style={{ width: '19rem', height: '300px' }}>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-2 text-center">
                    <Link to={`/products/${_id}`} style={{  color: 'blue' }}>
                        {name}
                    </Link>
                </Card.Title>
                <Card.Text className="text-center"
                    style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        marginBottom: '0.5rem' // Small gap between name and description
                    }}
                >
                    {description}
                </Card.Text>
                <div className="mt-auto text-start">
                    <Card.Subtitle>Price:</Card.Subtitle>
                    <Card.Text>
                        Php {price}
                    </Card.Text>
                </div>
                <div className="mt-3">
                    <Link className="btn btn-primary" to={`/products/${_id}`} style={{ width: '100%' }}>
                        Details
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
}
