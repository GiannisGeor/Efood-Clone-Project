import mealtime from "../../assets/mealtime.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../redux/AuthReducer";
import { clearCart } from "../../redux/CartReducer";
import { clearFields } from "../../redux/AddressReducer";

import { Button } from "@material-tailwind/react";

const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(clearToken());
    dispatch(clearFields());
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 md:h-20 bg-white text-center flex justify-between items-center px-8 md:px-10 shadow-md z-10">
        <div className="flex items-center justify-between w-full">
          <h1
            className="text-2xl md:text-[2rem] text-red-600 font-semibold hover:text-red cursor-pointer"
            onClick={() => navigate(`/`)}
          >
            React-Food
          </h1>
          {token ? (
            <div className="ml-auto">
              <Button className=" bg-red-800" onClick={handleLogout}>
                LOG OUT
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </header>
      <div>
        <div className="z-0 overflow-hidden">
          <img src={mealtime} alt="A table full of delicious food!" />
        </div>
      </div>
    </>
  );
};

export default Header;
