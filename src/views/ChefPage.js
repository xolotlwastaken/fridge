import React, { useEffect, useState } from "react";
import { Container, Form, Nav, Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function ChefPage() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [food, setFood] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [navigate, user, loading]);

  async function searchFood() {
    const baseUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

    try {
        const response = await fetch(baseUrl + food);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        const meal = json.meals[0];
        navigate(`/chef/${meal.idMeal}`);
    } catch (error) {
        console.error(error.message);
    }
  }

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">"fridge"</Navbar.Brand>
          <Nav>
          <Nav.Link href="/chef">ChefGPT</Nav.Link>
            <Nav.Link href="/add">New Food</Nav.Link>
            <Nav.Link onClick={(e) => signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
      <h1 style={{ marginBlock: "1rem" }}>Chef GPT</h1>
        <Form>
                    <Form.Group className="mb-3" controlId="food">
                        <Form.Label>Select your food item</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="e.g. chicken"
                        value={food}
                        onChange={(text) => setFood(text.target.value)}
                        />
                    </Form.Group>
          <Button variant="primary" onClick={async (e) => searchFood()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}