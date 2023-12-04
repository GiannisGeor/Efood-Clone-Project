import Header from "./Layout/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorServer, setErrorServer] = useState(false);
  const [frontError, setFrontError] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const emailIsInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email);
  const passwordIsInvalid =
    userData.password.length < 8 ||
    !/[A-Z]/.test(userData.password) ||
    !/\d/.test(userData.password);
  const nameIsInvalid =
    userData.name.trim() === "" ||
    userData.name.length < 2 ||
    userData.name.length > 50 ||
    /[^A-Za-z\s'-]/.test(userData.name);
  const phoneIsInvalid = !/^\d{10}$/.test(userData.phone);
  // const phoneIsInvalid = false;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setFormSubmitted(true);

    if (
      emailIsInvalid ||
      passwordIsInvalid ||
      nameIsInvalid ||
      phoneIsInvalid
    ) {
      console.log("error");
      setLoading(false);
    } else {
      const registerData = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
      };

      console.log(registerData);

      try {
        const response = await axios.post(
          "http://localhost:5237/api/auth/register/registration",
          registerData
        );

        console.log("response", response);
        if (!response.data.success) {
          setFrontError(response.data.validationResult.errors);
          toast("Error Registration");
          console.log(
            "validationResult",
            response.data.validationResult.errors
          );
        } else {
          setFrontError([]);
          toast.success("Successful Registration");
          navigate("/login");
          console.log("something good");
        }
      } catch (err) {
        console.log(err);
        setErrorServer(true);
        console.log("errorrrrrrrrrrrrrrrr");
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
        Sorry, something went wrong please try again.
      </Alert>
      <div className="flex flex-col items-center justify-center content-end">
        <Card className="h-16 w-2/6 flex-row">
          <CardBody className="mx-auto">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 uppercase"
            >
              REGISTER
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
            <div className="flex flex-col w-72 gap-6">
              <Input
                onChange={(e) => handleInput(e)}
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
                type="password"
                label="Password"
                name="password"
                value={userData.password}
                error={passwordIsInvalid && formSubmitted}
              />

              {passwordIsInvalid && formSubmitted && (
                <div className="text-red-500">
                  Password should Use at least 8 characters, one uppercase, one
                  lowercase and one number.
                </div>
              )}
              <Input
                onChange={(e) => handleInput(e)}
                label="Name"
                name="name"
                value={userData.name}
                error={nameIsInvalid && formSubmitted}
              />
              {nameIsInvalid && formSubmitted && (
                <div className="text-red-500">Invalid name format</div>
              )}
              <Input
                onChange={(e) => handleInput(e)}
                label="Phone"
                name="phone"
                value={userData.phone}
                error={phoneIsInvalid && formSubmitted}
              />
              {phoneIsInvalid && formSubmitted && (
                <div className="text-red-500">
                  Phone should be a 10-digit number
                </div>
              )}
              <Button
                className="bg-red-800"
                type="submit"
                // onClick={() => navigate(`/end`)}
              >
                Register
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
