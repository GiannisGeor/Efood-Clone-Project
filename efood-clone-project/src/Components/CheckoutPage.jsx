import Header from "./Layout/Header";
import { useSelector } from "react-redux";
import checkout from "../assets/checkout.png";
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
import { useState } from "react";
import { useParams } from "react-router-dom";

function CheckoutPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorServer, setErrorServer] = useState(false);
  const [frontError, setFrontError] = useState([]);

  const [userData, setUserData] = useState({ comments: "" });

  const { id } = useParams();

  const storeId = parseInt(id, 10);

  const cart = useSelector((state) => state.cart.cart);

  console.log("cart", cart);
  const addressId = useSelector((state) => state.address.addressId);
  const postalCode = useSelector((state) => state.address.postalCode);
  const address = useSelector((state) => state.address.address);
  const floor = useSelector((state) => state.address.floor);
  const doorbellName = useSelector((state) => state.address.doorbellName);

  const { token } = useSelector((state) => state.auth);

  const orderLines = cart.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    comments: product.comments,
    orderLinesOptions: Object.values(product.options).flatMap((option) =>
      Object.values(option)
        .filter((subOption) => subOption.id !== undefined)
        .map((subOption) => ({
          optionId: subOption.id,
        }))
    ),
  }));

  const getTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });
    return totalPrice;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const checkoutData = {
      storeId: storeId,
      addressId: addressId,
      orderComments: userData.comments,
      orderLines: orderLines,
    };

    console.log("checkoutData", checkoutData);

    try {
      const response = await axios.post(
        "http://localhost:5237/api/v1/Order/new-order",
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response);
      if (response.data.success === false) {
        setFrontError(response.data.validationResult.errors);
        console.log("validationResult", response.data.validationResult.errors);
      } else {
        setFrontError([]);
        navigate("/end");
        console.log("something good");
      }
    } catch (err) {
      console.log(err);
      setErrorServer(true);
      console.log("errorrrrrrrrrrrrrrrr");
    } finally {
      setLoading(false);
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
              className="mb-2 w-20 uppercase flex justify-center"
            >
              CHECKOUT
            </Typography>
          </CardBody>
        </Card>
        <Card className="mt-8 h-auto w-3/12">
          <div>
            {cart.map((product) => {
              return (
                <div
                  key={product.cartProductId}
                  className="flex flex-row justify-center"
                >
                  <p className=" text-xl text-black font-bold">
                    {product.name}:
                  </p>
                  <p className="text-xl ml-2 text-black font-semibold">
                    {product.quantity}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="text-xl text-center text-black font-bold">
            Total Price: {getTotalPrice()} euro
          </div>
        </Card>
        <Card className="mt-8 h-auto w-80">
          <div className="flex flex-col justify-center items-center">
            <p className=" text-l text-black font-bold">
              Postal Code: {postalCode}
            </p>
            <p className=" text-l text-black font-bold">Address: {address}</p>
            <p className=" text-l text-black font-bold">Floor: {floor}</p>
            <p className=" text-l text-black font-bold">
              Doorbell Name: {doorbellName}
            </p>
          </div>
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
                size="lg"
                variant="standard"
                label="Comments"
                name="comments"
                value={userData.comments}
              />
              <Button
                className="bg-red-800"
                type="submit"
                // onClick={() => navigate(`/end`)}
              >
                Submit
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
