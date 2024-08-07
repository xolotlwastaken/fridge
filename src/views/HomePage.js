import { useEffect, useState } from "react";
import { Container, Image, Nav, Navbar, Row } from "react-bootstrap";
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
  const { image, id } = post;
  return (
    <Link
      to={`food/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
      }}
    >
      <Image
        src={image}
        style={{
          objectFit: "cover",
          width: "18rem",
          height: "18rem",
        }}
      />
    </Link>
  );
}