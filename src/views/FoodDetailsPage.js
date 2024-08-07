import React, { useEffect, useState } from "react";
import { Col, Container, Image, Nav, Navbar, Row, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

export default function FoodDetailsPage() {
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [datePurchased, setDatePurchased] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;

  async function deleteFood(id) {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "foods", id));
    navigate("/");
  }

  async function getFood(id) {
    const foodDocument = await getDoc(doc(db, "users", auth.currentUser.uid, "foods", id));
    const food = foodDocument.data();
    setName(food.name);
    setDescription(food.description);
    setImage(food.image);
    setDatePurchased(food.datePurchased);
    setExpiryDate(food.expiryDate);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getFood(id);
  }, [id, navigate, user, loading]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">"fridge"</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Food</Nav.Link>
            <Nav.Link onClick={(e) => signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Button variant="secondary" className="float-end" onClick={(e) => navigate(`/update/${id}`)}>Edit</Button>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <h2>{name}</h2>
            <p>{description}</p>
            <Row>
                <Col>
                    <h5>Date Purchased</h5>
                    <p>{datePurchased}</p>
                </Col>
                <Col>
                    <h5>Expiry Date</h5>
                    <p>{expiryDate}</p>
                </Col>
            </Row>
            <Button variant="success" onClick={(e) => deleteFood(id)}>I used it!</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}