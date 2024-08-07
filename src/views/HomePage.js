import { useEffect, useState } from "react";
import { Container, Image, Nav, Navbar, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [food, setFood] = useState([]);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

   async function getAllfood() {
    const query = await getDocs(collection(db, "users", auth.currentUser.uid, "foods"));
    const food = query.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });
    setFood(food);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getAllfood();

  }, [navigate, user, loading]);

  const ImagesRow = () => {
    return food.map((post, index) => <ImageSquare key={index} post={post} />);
  };

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">"fridge"</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Food</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id, name, expiryDate } = post;
  const navigate = useNavigate();

  function daysTillExpiry(expiryDate) {
    const currDate = new Date();
    const expiry = new Date(expiryDate);
    var utc1 = Date.UTC(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    var utc2 = Date.UTC(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());

    // Calculate the time difference in milliseconds
    let timeDiff = Math.abs(utc2 - utc1);

    // Convert milliseconds to days
    let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff.toString();
  }

  return (
    <Card 
    onClick={(e) => navigate(`food/${id}`)}
    style={{ 
        width: '18rem', 
        marginLeft: "1rem",
        marginTop: "2rem",
        cursor: "pointer",
        padding: "0",
        }}>
      <Card.Img 
        variant="top" 
        src={image} style={{
          objectFit: "cover",
          width: '100%',
          height: "16rem",
        }}/>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text class="mb-4">
          Expiring in: {daysTillExpiry(expiryDate)} days
        </Card.Text>
      </Card.Body>
    </Card>
  );
}