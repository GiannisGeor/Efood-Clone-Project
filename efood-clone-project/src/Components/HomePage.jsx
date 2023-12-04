import Header from "./Layout/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setFields } from "../redux/AddressReducer";
import Modal from "react-overlays/Modal";
import axios from "axios";
import foodMin from "../assets/foodMin.jpg";
import trash from "../assets/trash.png";
import {
  Card,
  ListItem,
  Typography,
  Button,
  Input,
  Spinner,
} from "@material-tailwind/react";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [errorServer, setErrorServer] = useState(false);
  const [frontError, setFrontError] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    postalCode: "",
    fullAddress: "",
    floor: "",
    doorbellName: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const postalCodeIsInvalid = !/^\d{5}$/.test(userData.postalCode);
  const fullAddressIsInvalid = userData.fullAddress.trim() === "";
  const floorIsInvalid = userData.floor.trim() === "";
  const doorbellNameIsInvalid = userData.doorbellName.trim() === "";

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get("http://localhost:5237/api/v1/Address/all-customer-addresses", {
        headers,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  var handleClose = () => setShowModal(false);

  const handleAddAddressClick = () => {
    setShowModal(true);
  };

  const handleAddressClick = (address) => {
    dispatch(
      setFields({
        addressId: address.id,
        postalCode: address.postalCode,
        address: address.fullAddress,
        floor: address.floor,
        doorbellName: address.doorbellName,
      })
    );
    navigate("/stores");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setFormSubmitted(true);

    if (
      postalCodeIsInvalid ||
      fullAddressIsInvalid ||
      floorIsInvalid ||
      doorbellNameIsInvalid
    ) {
      console.log("error");
      setLoading(false);
    } else {
      const addressData = {
        postalCode: userData.postalCode,
        fullAddress: userData.fullAddress,
        floor: userData.floor,
        doorbellName: userData.doorbellName,
      };

      console.log(addressData);

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(
          "http://localhost:5237/api/v1/Address/add-addresses",
          addressData,
          { headers }
        );

        console.log("response", response);
        if (!response.data.success) {
          setFrontError(response.data.validationResult.errors);
          toast.error("Error Registration");
          console.log(
            "validationResult",
            response.data.validationResult.errors
          );
        } else {
          setFrontError([]);
          setShowModal(false);
          toast.success("Successfully added address");
          setLoading(true);
          axios
            .get(
              "http://localhost:5237/api/v1/Address/all-customer-addresses",
              {
                headers,
              }
            )
            .then((res) => {
              setData(res.data);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
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

  const handleDeleteAddress = async (addressId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(
        `http://localhost:5237/api/v1/Address/delete-addresses/${addressId}`,
        { headers }
      );

      if (response.data.success) {
        toast.success("Address deleted successfully");
        setLoading(true);
        axios
          .get("http://localhost:5237/api/v1/Address/all-customer-addresses", {
            headers,
          })
          .then((res) => {
            setData(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
        console.log("Address deleted successfully");
      } else {
        toast.error("Failed to delete address");
        console.error("Failed to delete address:", response.data.message);
      }
    } catch (error) {
      toast.error("Error while deleting address");
      console.error("Error while deleting address:", error);
    }
  };

  return (
    <div>
      <Header></Header>
      <div>
        {loading ? (
          <div className="flex flex-col items-center">
            <Spinner
              className=" flex justify-center items-center mt-40 h-12 w-12"
              color="red"
            />
          </div>
        ) : (
          <div>
            {token ? (
              <div>
                <div className="flex flex-col text-center max-w-[45rem] w-[50%] mt-[2rem] relative bg-white text-red-600 shadow-[0_1px_10px_1px_rgba(0,0,0,0.25)] m-auto p-4 rounded-[14px] text-[1.5rem] ">
                  <strong>WELCOME TO REACT-FOOD</strong>
                  <div>Please choose or create an address to continue</div>
                </div>
                <div className="flex justify-center">
                  <Card className="mt-8 w-96">
                    <div>
                      {data?.items?.map((address) => (
                        <ListItem
                          address={address}
                          className="flex justify-between cursor-default"
                          key={address?.id}
                        >
                          <div>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal w-full"
                            >
                              {address?.postalCode}
                            </Typography>
                            <Typography className="text-left" color="blue-gray">
                              {address?.fullAddress}
                            </Typography>
                            <Typography>floor: {address?.floor}</Typography>
                            <Typography>
                              Doorbell Name: {address?.doorbellName}
                            </Typography>
                          </div>
                          <div className="flex flex-col">
                            {address?.canBeDeleted ? (
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="justify-between hover:scale-110 hover:bg-red-50 ml-auto"
                              >
                                <img
                                  src={trash}
                                  alt="store-image"
                                  className="w-5"
                                ></img>
                              </button>
                            ) : null}

                            <Button
                              size="sm"
                              ripple={false}
                              fullWidth={true}
                              onClick={() => handleAddressClick(address)}
                              className="justify-between mt-12 bg-red-800 hover:scale-105 ml-auto"
                            >
                              SELECT
                            </Button>
                          </div>
                        </ListItem>
                      ))}
                    </div>
                  </Card>
                </div>
                <div className="flex justify-center mt-3">
                  <Button
                    onClick={() => handleAddAddressClick()}
                    className=" bg-red-800 mb-11"
                  >
                    Add new Address
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-[45rem] w-[50%] mt-[2rem] relative bg-white text-red-600 shadow-[0_1px_18px_10px_rgba(0,0,0,0.25)] m-auto mb-20 p-4 rounded-[14px] text-[1.5rem] ">
                <strong>WELCOME TO REACT-FOOD</strong>
                <p>
                  Your Culinary Companion! Discover a world of delicious
                  possibilities at your fingertips. Browse, order, and savor a
                  diverse menu of mouthwatering dishes from your favorite local
                  restaurants. Whether you're craving comfort food, exotic
                  flavors, or healthy options, we've got you covered. Join our
                  food-loving community today and elevate your dining experience
                  with ease and convenience. Your next great meal is just a few
                  taps away!
                </p>
                <div className=" flex flex-row">
                  <Button
                    className=" flex items-center content-start hover:bg-red-900 bg-red-800 text-[white] mb-auto mt-10 mr-1 ml-auto p-4 shadow-[0_1px_18px_10px_rgba(0,0,0,0.25)] rounded-[14px] text-[1rem]"
                    onClick={() => navigate(`/login`)}
                  >
                    LOGIN
                  </Button>
                  <Button
                    className=" flex items-center content-start hover:bg-red-900 bg-red-800 text-[white] mb-auto mt-10 mr-auto ml-30 p-4 shadow-[0_1px_18px_10px_rgba(0,0,0,0.25)] rounded-[14px] text-[1rem]"
                    onClick={() => navigate(`/register`)}
                  >
                    REGISTER
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        className="fixed w-[400px] z-[1040] bg-[white] border shadow-[0_5px_15px_rgba(0,0,0,0.5)] rounded-[14px] border-solid border-[rgba(0,0,0,0.2)] left-[38%] top-[30%]"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="flex border-b-2 justify-between p-3">
            <div className="font-bold">ADDRESS</div>
            <span
              className="text-2xl font-bold leading-none text-black bg-[white] opacity-70 cursor-pointer border-[none]"
              onClick={handleClose}
            >
              x
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 justify-center border-t-[#e9ecef4d] border-t border-solid p-3">
              <Input
                onChange={handleInput}
                label="PostalCode"
                name="postalCode"
                value={userData.postalCode}
              />
              <Input
                onChange={handleInput}
                label="FullAddress"
                name="fullAddress"
                value={userData.fullAddress}
              />
              <Input
                onChange={handleInput}
                label="Floor"
                name="floor"
                value={userData.floor}
              />
              <Input
                onChange={handleInput}
                label="DoorbellName"
                name="doorbellName"
                value={userData.doorbellName}
              />
              <Button type="submit" className="ml-82 bg-red-800">
                Add
              </Button>
              {/* <ProductQuantity onAddToCart={onAddToCart}></ProductQuantity> */}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default HomePage;
