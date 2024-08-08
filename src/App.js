import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import AddFoodPage from "./views/AddFoodPage";
import FoodDetailsPage from "./views/FoodDetailsPage";
import EditFoodPage from "./views/EditFoodPage";
import ChefPage from "./views/ChefPage";
import MealPage from "./views/MealPage";

function App() {
  const router =createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/add", element: <AddFoodPage /> },
    { path: "/food/:id", element: <FoodDetailsPage /> },
    { path: "/update/:id", element: <EditFoodPage /> },
    { path: "/chef", element: <ChefPage /> },
    { path: "/chef/:id", element: <MealPage /> }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
