import { Button, Spinner } from "@material-tailwind/react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Layout/Header";

function EmailConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const u = new URLSearchParams(location.search).get("u");
  const t = new URLSearchParams(location.search).get("t");

  console.log(u, t);

  useEffect(() => {
    axios
      .post(
        `http://localhost:5237/api/auth/email-confirmation/confirm-userid/${u}/token/${t}`
      )
      .then(() => {
        toast.success("succesfully confirmed email");
      })
      .catch((err) => {
        toast.error("An error occured during email confirmation");
        console.log(err);
      })
      .finally(() => navigate("/login"));
  }, [u, t]);

  return (
    <div>
      <Header></Header>
      <div className="flex flex-col items-center">
        <Spinner
          className=" flex justify-center items-center mt-40 h-12 w-12"
          color="red"
        />
      </div>
    </div>
  );
}

export default EmailConfirmationPage;
