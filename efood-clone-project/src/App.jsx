import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

import ThankYouPage from "./Components/ThankYouPage";
import HomePage from "./Components/HomePage.jsx";
import StorePage from "./Components/StorePage.jsx";
import Register from "./Components/Register";
import CheckoutPage from "./Components/checkoutpage";
import StoreCatalogPage from "./Components/StoreCatalogPage";
import EmailConfirmationPage from "./Components/EmailConfirmation.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import Login from "./Components/Login";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

import { store, persistor } from "./redux/store.js";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="register" element={<Register />} />
            <Route exact path="login" element={<Login />} />
            <Route
              exact
              path="email-confirmation"
              element={<EmailConfirmationPage />}
            />
            <Route exact path="forgot-password" element={<ForgotPassword />} />
            <Route exact path="reset-password" element={<ResetPassword />} />
            <Route
              exact
              path="stores"
              element={
                <ProtectedRoute>
                  <StoreCatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="store/:id"
              element={
                <ProtectedRoute>
                  <StorePage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="checkout/:id"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route exact path="end" element={<ThankYouPage />} />
            <Route
              exact
              path="admin"
              element={<h4>hello from admin page</h4>}
            />
          </Routes>
        </Router>
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}
export default App;
