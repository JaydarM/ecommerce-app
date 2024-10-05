import { useState, useEffect, useContext } from "react";
import { Form, Button } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

// For Notification Messages
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Login() {

	const notyf = new Notyf();

	const { user, setUser } = useContext(UserContext);

	// Hooks
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Set Button Active or Disabled
	const [isActive, setIsActive] = useState(false);

	// Login Function
	async function authenticate(e) {

    	e.preventDefault();

    	try {

	    	const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
	    		method: "POST",
	    		headers: {
	    			"Content-Type": "application/json"
	    		},
	    		body: JSON.stringify({
	    			email: email,
	    			password: password
	    		})
	    	});

	    	const data = await response.json();
	    	if (data.access !== undefined) {

	    		localStorage.setItem("token", data.access);
	    		retrieveUserDetails(data.access);

	    		setEmail("");
	    		setPassword("");

	    		notyf.success('Successful Login');

	    	} else if (data.message === "Email and password do not match") {
	    		notyf.error('Incorrect Credentials. Try Again');
	    	} else {
	    		notyf.error('User Not Found. Try Again.')
	    	}

    	} catch (error) {
    		notyf.error("Something went wrong");
            console.error(error);
    	}

    }

    async function retrieveUserDetails(token) {

    	try {

			const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			const data = await response.json();
			setUser({
				id: data._id,
				isAdmin: data.isAdmin
			});

		} catch (error) {
    		notyf.error("Something went wrong");
            console.error(error);
    	}

	}

	// For Login Button
	useEffect(() => {
    	if (email !== "" && password !== "" ) {
    		setIsActive(true);
    	} else {
    		setIsActive(false);
    	}
    }, [email, password])

	return (
		(user.id !== null) ?
			<Navigate to="/"/>
			:
			<Form onSubmit={(e) => authenticate (e)}>
	    		<h1 className="my-5 text-center">Login</h1>
		      	<Form.Group className="mb-3" controlId="formGroupEmail">
			        <Form.Label>Email Address</Form.Label>
			        <Form.Control 
				        type="email" 
				        placeholder="Enter email" 
				        required
			        	value={email} 
			        	onChange={e => {setEmail(e.target.value)}}
			        />
		      	</Form.Group>
		      	<Form.Group className="mb-3" controlId="formGroupPassword">
			        <Form.Label>Password</Form.Label>
			        <Form.Control 
				        type="password" 
				        placeholder="Enter password" 
				        required
			        	value={password} 
			        	onChange={e => {setPassword(e.target.value)}}
			        />
		      	</Form.Group>
		      	{isActive ?
	            	<Button variant="primary" type="submit" id="submitLoginBtn">Login</Button>
	            	:
	            	<Button variant="danger" type="submit" id="submitLoginBtn" disabled>Login</Button>
	        	}
		    </Form>
	)
}