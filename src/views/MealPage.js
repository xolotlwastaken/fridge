import React, { useEffect, useState } from "react";
import { Col, Container, Image, Nav, Navbar, Row, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";

export default function MealPage() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const [meal, setMeal] = useState()

    async function getMealDetails(id) {
        const detailedUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="
    
        try {
            const res = await fetch(detailedUrl + id);
            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`)
            }
            const json = await res.json();
            const mealDetails = json.meals[0];
            setMeal(mealDetails);
            
        } catch (error) {
            console.error(error.message);
        }
      }
    
    function ShowDetails() {
        if(meal) {
            return (
                <Container>
                    <h2>{meal.strMeal}</h2>
                    <Image src={meal.strMealThumb} style={{width:"16rem", heigh:"16rem"}} />
                    <p>{meal.strInstructions}</p>
                    <p>See video<a href={meal.strYoutube} target="_blank" rel="noopener noreferrer"> here.</a></p>
                </Container>
            );
        } else {
            return loading;
        }
    }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getMealDetails(id);
  }, [navigate, user, loading, id, meal]);


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
        <ShowDetails />
      </Container>
      
    </>
  );
}