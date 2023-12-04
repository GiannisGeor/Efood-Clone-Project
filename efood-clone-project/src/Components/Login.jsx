import Header from "./Layout/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/AuthReducer";
import {
  Input,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Typography,
  Button,
  Alert,
} from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorServer, setErrorServer] = useState(false);
  const [frontError, setFrontError] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const dispatch = useDispatch();

  const emailIsInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resendEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5237/api/auth/email-confirmation/resend-confirmation-email/${userData.email}`
      );
      console.log("response", response);
      if (!response.data.success) {
        setFrontError(response.data.validationResult.errors);
        toast.error("An error occured");
        console.log("validationResult", response.data.validationResult.errors);
      } else {
        setFrontError([]);
        toast.success("Successfully resend email");
        console.log("resend email");
      }
    } catch (err) {
      console.error(err);
      setErrorServer(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setFormSubmitted(true);

    if (emailIsInvalid) {
      console.log("error");
      setLoading(false);
    } else {
      const loginData = {
        email: userData.email,
        password: userData.password,
        rememberMe: true,
      };

      console.log(loginData);

      try {
        const response = await axios.post(
          "http://localhost:5237/api/auth/login/login-forms",
          loginData
        );

        console.log("response", response);
        if (!response.data.success) {
          setFrontError(response.data.validationResult.errors);
          toast.error("Error at Login");
          console.log(
            "validationResult",
            response.data.validationResult.errors
          );
        } else {
          setFrontError([]);
          toast.success("Successfully logged in");
          dispatch(setToken(response.data.item));
          navigate("/");
          console.log("something good");
        }
      } catch (err) {
        console.error(err);
        setErrorServer(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Header></Header>
      <Alert
        color="red"
        variant="gradient"
        open={frontError.length > 0}
        action={
          <Button
            variant="text"
            color="white"
            size="sm"
            className="!absolute top-3 right-3"
            onClick={() => setFrontError([])}
          >
            Close
          </Button>
        }
      >
        {frontError.map((error, index) => {
          return (
            <div key={index} className="flex flex-row justify-center">
              <p className=" text-xl text-black font-bold">
                {error.errorMessage}
                If you want the confirmation to be resend -
                <button className="font-bold underline" onClick={resendEmail}>
                  {" "}
                  click here
                </button>
              </p>
            </div>
          );
        })}
      </Alert>
      <Alert
        color="red"
        variant="gradient"
        open={errorServer}
        action={
          <Button
            variant="text"
            color="white"
            size="sm"
            className="!absolute top-3 right-3"
            onClick={() => setErrorServer(false)}
          >
            Close
          </Button>
        }
      >
        Sorry, The Email or Password you inputed are not correct.
      </Alert>
      <div className="flex flex-col items-center justify-center content-end">
        <Card className="h-16 w-2/6 flex-row">
          <CardBody className="mx-auto">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 w-2/5 uppercase"
            >
              login
            </Typography>
          </CardBody>
        </Card>
        <form className="mt-8" onSubmit={handleSubmit}>
          {loading ? (
            <div className="flex flex-col items-center">
              <Spinner
                className=" flex justify-center items-center mt-40 h-12 w-12"
                color="red"
              />
            </div>
          ) : (
            <div className="flex flex-col w-72 gap-4">
              <Input
                onChange={(e) => handleInput(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                type="email"
                label="Email"
                name="email"
                value={userData.email}
                error={emailIsInvalid && formSubmitted}
              />
              {emailIsInvalid && formSubmitted && (
                <div className="text-red-500">Invalid email format </div>
              )}
              <Input
                onChange={(e) => handleInput(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                type="password"
                label="Password"
                name="password"
                value={userData.password}
              />
              <button
                className="text-red-600 text-sm text-right"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>

              <Button className="bg-red-800" type="submit">
                login
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
