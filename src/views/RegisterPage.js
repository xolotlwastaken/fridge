import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, SetError] = useState("");
  const navigate = useNavigate();

  return (
    <Container>
      <h1 className="my-3">Sign up for an account</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <a href="/login">Have an existing account? Login here.</a>
        </Form.Group>

        <Button variant="primary" onClick={async (e) => {
            SetError("");
            const canSignup = username && password && confirmPassword;
            if (canSignup) {
                if (confirmPassword === password) {
                    try{
                        await createUserWithEmailAndPassword(auth, username, password);
                        await setDoc(doc(db, "users", auth.currentUser.uid), {
                            uid: auth.currentUser.uid,
                        });
                        navigate("/");
                    } catch (error) {
                        SetError(error.message);
                    }
                } else {
                    SetError("passwords do not match");
                }
                
            } else {
                SetError("Plese fill in all fields.");
            }
        }
        }>Sign Up</Button>
      </Form>
      <p>{error}</p>
    </Container>
  );
}