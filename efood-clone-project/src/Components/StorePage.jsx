import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import Modal from "react-overlays/Modal";
import productMin from "../assets/productMin.png";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../redux/CartReducer";
import { removeFromCart } from "../redux/CartReducer";
import { useNavigate } from "react-router-dom";
import foodMin from "../assets/foodMin.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Card,
  CardBody,
  Checkbox,
  ListItem,
  ListItemPrefix,
  Avatar,
  CardHeader,
  CardFooter,
  Typography,
  Button,
  Input,
  Spinner,
  alert,
  Radio,
} from "@material-tailwind/react";
import Header from "./Layout/Header";

function StorePage() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userComment, setUserComment] = useState({ comments: "" });
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [showCheckoutMessage, setShowCheckoutMessage] = useState(false);

  console.log("selectedOptions", selectedOptions);

  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserComment({ ...userComment, [name]: value });
  };

  const addProductToCart = (modalData) => {
    const modalDataWithComment = {
      ...modalData,
      comments: userComment.comments,
      options: selectedOptions,
    };

    const totalPrice = calculateProductTotalPrice();

    // Update the price in the modalData before adding to the cart
    modalDataWithComment.price = totalPrice;

    dispatch(addToCart(modalDataWithComment));
    handleClose();
    console.log("modalData", modalDataWithComment);
  };

  const increaseQuantity = (modalData) => {
    dispatch(incrementQuantity(modalData));
  };

  const decreaseQuantity = (modalData) => {
    const modalDataWithComment = {
      ...modalData,
      comments: userComment.comments,
    };
    if (modalDataWithComment.quantity == 1) {
      dispatch(removeFromCart(modalDataWithComment));
    } else {
      dispatch(decrementQuantity(modalDataWithComment));
    }
  };

  const getTotalQuantity = () => {
    let totalQuantity = 0;
    cart.forEach((product) => {
      totalQuantity += product.quantity;
    });
    return totalQuantity;
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });
    return totalPrice;
  };

  const { id } = useParams();

  console.log(id);

  const calculateProductTotalPrice = () => {
    return (
      productData?.price +
        Object.values(selectedOptions ?? {}).reduce(
          (total, selectedOptionsGroup) => {
            const optionsArray = Array.isArray(selectedOptionsGroup)
              ? selectedOptionsGroup
              : [selectedOptionsGroup];
            console.log("optionsArray", optionsArray);

            return (
              total +
              optionsArray.reduce(
                (extra, option) => extra + (option?.extraCost || 0),
                0
              )
            );
          },
          0
        ) || 0
    );
  };

  const navigateToCheckout = (id) => {
    if (getTotalQuantity() > 0) {
      navigate(`/checkout/${id}`);
    } else {
      setShowCheckoutMessage(true);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5237/api/v1/Store/initial-store-data/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        console.log("mass", data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  useEffect(() => {
    if (modalData) {
      console.log("product", modalData);
      axios
        .get(
          `http://localhost:5237/api/v1/Product/all-product-data/${modalData?.id}`
        )
        .then((res) => {
          setProductData(res.data.item);
          setLoading(false);
          const _selectedOptions = {};

          res.data.item?.productOptionsGroups?.forEach((og) => {
            _selectedOptions[og.id] = og?.optionsGroup?.isMulti
              ? []
              : og?.options?.[0];
          });

          setSelectedOptions(_selectedOptions);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [modalData]);

  console.log("productData", productData);

  console.log("111SelectedOptions", selectedOptions);

  const handleClose = () => {
    setShowModal(false);
    setModalData(null);
    setSelectedOptions(null);
    setUserComment({ comments: "" });
  };

  const handleProductClick = (product) => {
    // const productId = product.id;
    // console.log("productId", productId);

    // console.log("product", modalData);
    setModalData(product);
    setShowModal(true);
  };

  // console.log("yes", modalData.item);

  return (
    <div>
      <Header></Header>
      <Alert
        color="red"
        variant="gradient"
        open={showCheckoutMessage}
        action={
          <Button
            variant="text"
            color="white"
            size="sm"
            className="!absolute top-3 right-3"
            onClick={() => setShowCheckoutMessage(false)}
          >
            Close
          </Button>
        }
      >
        Please add items to your cart before proceeding to checkout.
      </Alert>
      {loading ? (
        <div className="flex flex-col items-center">
          <Spinner
            className=" flex justify-center items-center mt-40 h-12 w-12"
            color="red"
          />
        </div>
      ) : (
        <div className="flex flex-row justify-center items-start">
          <div className=" mx-auto">
            <div>
              <Card className="h-20 flex-row">
                <CardHeader
                  shadow={false}
                  floated={false}
                  className="m-0 w-20 shrink-0"
                >
                  <img src={foodMin} alt="store-image" className=" w-20 "></img>
                </CardHeader>
                <CardBody>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-2 ml-14 w-10 uppercase"
                  >
                    <div>{data?.item?.name}</div>
                    <div className=" font-extralight ">
                      {data?.item?.storeCategory?.name}
                    </div>
                  </Typography>
                </CardBody>
              </Card>
            </div>
            <Card className="mt-8  w-96">
              <div>
                {data.item?.productCategories?.map((category) => {
                  return (
                    <div key={category?.id}>
                      <div className="bg-white-200">
                        <h1
                          colSpan="3"
                          className="px-8 py-2 text-center text-black font-semibold whitespace-nowrap dark:text-blue-100"
                        >
                          {category?.name}
                        </h1>
                      </div>
                      {category?.products.map((product) => (
                        <ListItem
                          onClick={() => handleProductClick(product)}
                          key={product.id}
                        >
                          <ListItemPrefix>
                            <Avatar
                              variant="circular"
                              alt="candice"
                              src={productMin}
                            />
                          </ListItemPrefix>
                          <div>
                            <Typography variant="h6" color="blue-gray">
                              {product?.name}
                            </Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal"
                            >
                              {product?.description}
                            </Typography>
                            <Typography className="text-left" color="blue-gray">
                              {product?.price} euro
                            </Typography>
                          </div>
                        </ListItem>
                      ))}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          <div className=" -mx-96 w-96 mr-10">
            <Card className=" ml-10">
              <CardBody>
                <div className="mb-2 w-72 text-black text-center font-bold">
                  <span className=" text-2xl ml-8">CART</span>
                  <span className=" bg-red-800 text-white ml-4 px-2 py-1 rounded-[25px] ">
                    {getTotalQuantity() || 0}
                  </span>
                  <h1 className="ml-6">
                    {getTotalPrice().toFixed(2) || 0} euro
                  </h1>
                </div>
                <div>
                  {cart.map((modalData) => {
                    return (
                      <div key={modalData.cartProductId}>
                        <p className="font-bold text-center text-black ml-2">
                          {modalData.name}
                        </p>
                        <p className="text-center ml-2">{modalData.comments}</p>
                        {modalData.options && (
                          <div className="text-center ml-2">
                            <h3>Selected Options:</h3>
                            <ul>
                              {Object.entries(modalData.options).map(
                                ([groupId, selectedOptions]) => (
                                  <li key={groupId}>
                                    {Array.isArray(selectedOptions) ? (
                                      selectedOptions.map((option) => (
                                        <span key={option.id}>
                                          {option.baseOption?.name},{" "}
                                        </span>
                                      ))
                                    ) : (
                                      <span>
                                        {selectedOptions.baseOption?.name}
                                      </span>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        <div className="flex flex-row mx-24">
                          <button
                            className="text-3xl mb-1"
                            onClick={() => decreaseQuantity(modalData)}
                          >
                            -
                          </button>
                          <h1>{modalData.quantity}</h1>
                          <button
                            className="text-2xl"
                            onClick={() => increaseQuantity(modalData)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
              <CardFooter className="pt-0 mx-auto">
                <Button
                  className=" bg-red-800"
                  onClick={() => navigateToCheckout(id)}
                >
                  go to checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      <Modal
        className="fixed w-[600px] z-[1040] bg-[white] border shadow-[0_5px_15px_rgba(0,0,0,0.5)] rounded-[14px] border-solid border-[rgba(0,0,0,0.2)] left-[34%] top-[20%]"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="border-b-2 flex justify-between p-3">
            <div className="font-bold">{productData?.name}</div>
            <div className="font-medium">
              {calculateProductTotalPrice().toFixed(2)} euro
            </div>
            <div>
              <span
                className="text-2xl font-bold leading-none text-black bg-[white] opacity-70 cursor-pointer border-[none]"
                onClick={handleClose}
              >
                x
              </span>
            </div>
          </div>
          <div className="p-3">
            <h1>{productData?.description}</h1>
            {productData?.productOptionsGroups?.map((productOptionsGroup) => {
              console.log("productOptionsGroup", productOptionsGroup);

              const optionsThatDisableThisGroup =
                productOptionsGroup?.optionsGroup
                  ?.optionIdsThatDisableGroup?.[0];

              console.log(
                "optionsThatDisableThisGroup",
                optionsThatDisableThisGroup
              );

              if (optionsThatDisableThisGroup && selectedOptions) {
                const isDisabled = Object.values(selectedOptions).some(
                  (selectedOption) => {
                    if (Array.isArray(selectedOption)) {
                      return (
                        selectedOption &&
                        selectedOption.some(
                          (option) =>
                            option && option.id === optionsThatDisableThisGroup
                        )
                      );
                    } else if (selectedOption && selectedOption.id) {
                      return selectedOption.id === optionsThatDisableThisGroup;
                    }

                    return false;
                  }
                );

                if (isDisabled) {
                  return null;
                }
              }
              return (
                <div key={productOptionsGroup.id}>
                  <h2>{productOptionsGroup?.optionsGroup?.name}</h2>
                  <div className="flex flex-wrap">
                    {productOptionsGroup?.options?.map((option) => (
                      <div key={option.id} className="w-1/2 mb-2">
                        <label className="flex items-center">
                          {productOptionsGroup?.optionsGroup?.isMulti ? (
                            <Checkbox
                              color="red"
                              checked={selectedOptions?.[
                                productOptionsGroup?.id
                              ]?.find(
                                (selectedOption) =>
                                  selectedOption.id === option.id
                              )}
                              onChange={() => {
                                const isAlreadySelected = selectedOptions?.[
                                  productOptionsGroup?.id
                                ]?.find(
                                  (selectedOption) =>
                                    selectedOption.id === option.id
                                );

                                setSelectedOptions((prevOptions) => {
                                  const currentOptions =
                                    prevOptions[productOptionsGroup?.id] || [];

                                  if (isAlreadySelected) {
                                    // Remove the selected option
                                    return {
                                      ...prevOptions,
                                      [productOptionsGroup?.id]:
                                        currentOptions.filter(
                                          (selectedOption) =>
                                            selectedOption.id !== option.id
                                        ),
                                    };
                                  } else {
                                    // Add the selected option
                                    return {
                                      ...prevOptions,
                                      [productOptionsGroup?.id]: [
                                        ...currentOptions,
                                        option,
                                      ],
                                    };
                                  }
                                });
                              }}
                            />
                          ) : (
                            <Radio
                              color="red"
                              name={`${productOptionsGroup?.optionsGroup.name}_${productOptionsGroup?.optionsGroup?.id}`}
                              checked={
                                selectedOptions?.[productOptionsGroup?.id]
                                  ?.id === option.id
                              }
                              onChange={() =>
                                setSelectedOptions({
                                  ...selectedOptions,
                                  [productOptionsGroup?.id]: option,
                                })
                              }
                            />
                          )}
                          {option.extraCost !== 0 ? (
                            <span>
                              {option.baseOption?.name} (+
                              {option.extraCost?.toFixed(2)} euro)
                            </span>
                          ) : (
                            <span>{option.baseOption?.name}</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-6 justify-center border-t-[#e9ecef4d] border-t border-solid p-3">
            <Input
              onChange={handleInput}
              size="lg"
              label="Comments"
              name="comments"
              variant="standard"
              value={userComment.comments}
            />

            <Button
              className="ml-82 bg-red-800"
              onClick={() => addProductToCart(modalData)}
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default StorePage;
