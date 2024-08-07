import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, Row, Col } from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export default function AddFoodPage() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [datePurchased, setDatePurchased] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const navigate = useNavigate();

  async function addFood() {
    await addDoc(collection(db, "users", auth.currentUser.uid, "foods"), {
        name, 
        description,
        image, 
        category,
        datePurchased,
        expiryDate
    });
    navigate("/");
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [navigate, user, loading]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">"Fridge"</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Food</Nav.Link>
            <Nav.Link onClick={(e) => signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Add Food</h1>
        <Form>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="e.g. chicken"
                        value={name}
                        onChange={(text) => setName(text.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                        as="textarea" 
                        rows={5}
                        placeholder="e.g. very nice chicken breasts" 
                        value={description}
                        onChange={(text) => setDescription(text.target.value)}
                        />
                    </Form.Group>
                    <Row>
                        <Col>
                        <Form.Group className="mb-3" controlId="datePurchased">
                            <Form.Label>Date Purchased</Form.Label>
                            <Form.Control
                            type="date"
                            value={datePurchased}
                            onChange={(text) => setDatePurchased(text.target.value)}
                            />
                        </Form.Group>
                        </Col>

                        <Col>
                        <Form.Group className="mb-3" controlId="expiryDate">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                            type="date"
                            value={expiryDate}
                            onChange={(text) => setExpiryDate(text.target.value)}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="https://zca.sg/img/1"
                        value={image}
                        onChange={(text) => setImage(text.target.value)}
                        />
                        <Form.Text className="text-muted">
                        Make sure the url has a image type at the end: jpg, jpeg, png.
                        </Form.Text>
                    </Form.Group>
                    
                    {/* Category drop down */}
                    Categories
                    <DropdownButton id="dropdown-basic-button" title={category}>
                        <Dropdown.Item as="button" value="Poultry" onClick={(text) => setCategory(text.target.value)}>Polutry</Dropdown.Item>
                        <Dropdown.Item as="button" value="Fish" onClick={(text) => setCategory(text.target.value)}>Fish</Dropdown.Item>
                        <Dropdown.Item as="button" value="Vegetables" onClick={(text) => setCategory(text.target.value)}>Vegetables</Dropdown.Item>
                        <Dropdown.Item as="button" value="Dairy" onClick={(text) => setCategory(text.target.value)}>Dairy</Dropdown.Item>
                        <Dropdown.Item as="button" value="Bread" onClick={(text) => setCategory(text.target.value)}>Bread</Dropdown.Item>
                        <Dropdown.Item as="button" value="Fruits" onClick={(text) => setCategory(text.target.value)}>Fruits</Dropdown.Item>
                        <Dropdown.Item as="button" value="Others" onClick={(text) => setCategory(text.target.value)}>Others</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>
          <Button variant="primary" onClick={async (e) => addFood()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}