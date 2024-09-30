import { useState, useEffect, useContext } from "react";
import { Form, Button } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

// For Notification Messages
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Register() {

    const navigate = useNavigate();
	const notyf = new Notyf();

    const {user} = useContext(UserContext);

    // Hooks
	const [firstName, setFirstName] = useState("");
	const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [mobileNo,setMobileNo] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false);

    // Activate Button if fields are Not Empty
    useEffect(() => {
    	if ((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword) && (mobileNo.length === 11)) {

    		setIsActive(true);
    	} else {

    		setIsActive(false);
    	}
    }, [firstName, lastName, email, mobileNo, password, confirmPassword])

	function registerUser(e) {

    	e.preventDefault();

    	fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {

    		// Options
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json"
    		},
    		body: JSON.stringify({
    			firstName: firstName,
    			lastName: lastName,
    			email: email,
    			mobileNo: mobileNo,
    			password: password
    		})
    	})
    	.then(res => res.json())
    	.then(data => {

    		// For Checking
    		// console.log(data);

    		if (data.message === "Registered Successfully") {
    			setFirstName("");
    			setLastName("");
    			setEmail("");
    			setMobileNo("");
    			setPassword("");
    			setConfirmPassword("");

    			notyf.success("Registration successful");
                navigate("/login");
    		} else if (data.error === "Email is invalid") {
    			notyf.error("Email is invalid");
    		} else if (data.error === "Mobile number is invalid") {
    			notyf.error("Mobile number is invalid");
    		} else if (data.error === "Password must be atleast 8 characters long") {
    			notyf.error("Password must be atleast 8 characters long");
    		} else {
    			notyf.error("Something went wrong");
    		}
    	})
    }

	return (
		(user.id !== null) ?
            <Navigate to="/" />
            :
            <Form onSubmit={(e) => registerUser(e)}>
                <h1>Register</h1>
                <Form.Group>
                    <Form.Label>First Name: </Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter First Name" 
                        required 
                        value={firstName}
                        onChange={e => {setFirstName(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last Name: </Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter Last Name" 
                        required 
                        value={lastName}
                        onChange={e => {setLastName(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email: </Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter Email" 
                        required 
                        value={email}
                        onChange={e => {setEmail(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Mobile No: </Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Enter 11 Digit Mobile Number" 
                        required 
                        value={mobileNo}
                        onChange={e => {setMobileNo(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password: </Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        required 
                        value={password}
                        onChange={e => {setPassword(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password: </Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Confirm Password" 
                        required 
                        value={confirmPassword}
                        onChange={e => {setConfirmPassword(e.target.value)}}
                    />
                </Form.Group>
                {isActive ?
                    <Button variant="primary" type="submit" id="submitBtn">Submit</Button>
                    :
                    <Button variant="danger" type="submit" id="submitBtn" disabled>Submit</Button>
                }
            </Form>
	)
}