import { Input, Button, Spinner } from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "./Layout/Header";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  const emailIsInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setFormSubmitted(true);

    if (emailIsInvalid) {
      console.log("error");
      setLoading(false);
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5237/api/auth/forgot-password/forgot-password?email=${userData.email}`
        );

        console.log("response", response);
        if (!response.data.success) {
          setFrontError(response.data.validationResult.errors);
          toast.error("There has been an error");
          console.log(
            "validationResult",
            response.data.validationResult.errors
          );
        } else {
          //   setFrontError([]);
          toast.success("Successfully sent");
          navigate("/login");
          console.log("something good");
        }
      } catch (err) {
        console.error(err);
        // setErrorServer(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Header></Header>
      <div className="text-red-700 font-bold text-center text-2xl mt-20">
        PLEASE INPUT THE EMAIL THAT WE'LL SEND THE RESET PASSWORD LINK TO
      </div>
      <div className="flex flex-col items-center justify-center content-end">
        <form className="mt-8" onSubmit={handleSubmit}>
          {loading ? (
            <div className="flex flex-col items-center">
              <Spinner
                className=" flex justify-center items-center mt-40 h-12 w-12"
                color="red"
              />
            </div>
          ) : (
            <div className="w-72 mx-auto mt-20 flex flex-col gap-4">
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
              <Button
                className="bg-red-800"
                type="submit"
                // onClick={() => navigate(`/end`)}
              >
                submit
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
