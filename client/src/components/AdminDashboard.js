import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"

// Import Components
import EditProduct from "./EditProduct";
import ArchiveProduct from "./ArchiveProduct";
import AddProduct from "./AddProduct";

function AdminDashboard({ productData, fetchData }) {
  
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    
    const productArr = productData.map(product => {
      return (
        <tr key={product._id}>
          <td>{product._id}</td>
          <td>{product.name}</td>
          <td>{product.description}</td>
          <td>PHP {product.price}</td>
          <td className={product.isActive ? "text-success" : "text-danger"}>
            {product.isActive ? "Available" : "Unavailable"}
          </td>
          <td className="text-center">
            <EditProduct product={product} fetchData={fetchData} />
          </td>
          <td className="text-center">
            <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} />
          </td>
        </tr>
      )
    })

    setProducts(productArr);

  }, [productData]); //wants to add fetchData in dep array

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AddProduct fetchData={fetchData} />
      <Button onClick={() => navigate("/orders")} variant="success" className="ml-2">Show User Orders</Button>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminDashboard;
