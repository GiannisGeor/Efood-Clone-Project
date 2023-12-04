import { Input, Button, Spinner } from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "./Layout/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    password: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const u = new URLSearchParams(location.search).get("u");
  const t = new URLSearchParams(location.search).get("t");

  console.log(u, t);

  const passwordIsInvalid =
    userData.password.length < 8 ||
    !/[A-Z]/.test(userData.password) ||
    !/\d/.test(userData.password);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setFormSubmitted(true);

    if (passwordIsInvalid) {
      console.log("error");
      setLoading(false);
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5237/api/auth/forgot-password/reset-password?authUserId=${u}&resetToken=${t}&newPassword=${userData.password}`
        );

        console.log("response", response);
        if (!response.data.success) {
          //   setFrontError(response.data.validationResult.errors);
          toast.error("There has been an error");
          console.log(
            "validationResult",
            response.data.validationResult.errors
          );
        } else {
          //   setFrontError([]);
          toast.success("Password changed successfully");
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
        PLEASE INPUT YOUR NEW PASSWORD
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
                type="password"
                label="New Password"
                name="password"
                value={userData.email}
                error={passwordIsInvalid && formSubmitted}
              />
              {passwordIsInvalid && formSubmitted && (
                <div className="text-red-500">Invalid email format </div>
              )}
              <Button className="bg-red-800" type="submit">
                submit
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
