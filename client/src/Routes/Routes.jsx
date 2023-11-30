import { createBrowserRouter } from "react-router-dom";

//import pages
import BuisnessFlow from "../Pages/BuisnessFlow/BuisnessFlow.jsx";
import BillingFlow from "../Pages/BillingFlow/BillingFlow.jsx";
import LoginPage from '../Pages/Login/Login.jsx'
import SignupPage from '../Pages/Signup/SignUp.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <BuisnessFlow />,
  },
  {
    path: "/billingUnits",
    element: <BillingFlow />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

export default router;
