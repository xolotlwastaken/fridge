import { useEffect, useState } from "react";
import { Container, Nav, Navbar, Row, Card } from "react-bootstrap";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [foodCategories, setFoodCategories] = useState({});
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getAllFood();
  }, [navigate, user, loading]);


  async function getAllFood() {
    const categories = ["Poultry", "Fish", "Vegetables", "Dairy", "Bread", "Fruits", "Others"];
    var foodCategories = {};
    

    // to sort array by object property
    function dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          // sort ascending
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
    }

    // set foodcategories to be a dictionary of categories with list of foods in that cateories
    for (const category of categories) {
      let foods = [];
      const q = query(collection(db, "users", auth.currentUser.uid, "foods"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        foods.push({id: doc.id, ...doc.data()});
      });
      foodCategories[category] = foods.sort(dynamicSort("expiryDate"));
    }
    setFoodCategories(foodCategories);
    console.log(foodCategories);
  }

  // Display a row of foods from a single category
  function CategoryRow(category, foodRow) {
    return(
      <>
      <h3 className="mt-5">{category}</h3>
      <ImagesRow foodRow={foodRow}/>
      </>
    )
  }

  // Display a row of foods
  const ImagesRow = ({foodRow}) => {
    if (foodRow.length !== 0) {
      return foodRow.map((post, index) => <ImageSquare key={index} post={post} />);
    } else {
      return <Container className="mb-5">You do not have any food from this category.</Container>
    }
  };

  // Display all categories and their foods
  const FullView = () => {
    let fullCatView = [];

    // sort categories by which has the most food items first
    function sortDictByLength(dict) {
      return Object.keys(dict)
        .sort((a, b) => dict[b].length - dict[a].length)
        .reduce((acc, key) => {
          acc[key] = dict[key];
          return acc;
        }, {});
    }
    
    const sortedDict = sortDictByLength(foodCategories);

    for (var key in sortedDict) {
      fullCatView.push(CategoryRow(key, sortedDict[key]));
    }
    return fullCatView;
  }

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">"fridge"</Navbar.Brand>
          <Nav>
            <Nav.Link href="/chef">ChefGPT</Nav.Link>
            <Nav.Link href="/add">New Food</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <FullView />
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
        marginBottom: "2rem",
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
