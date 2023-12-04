import Header from "./Layout/Header";
import ThankYou from "../assets/ThankYou.png";
import { clearCart } from "../redux/CartReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function ThankYouPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, []);

  return (
    <div>
      <Header></Header>
      <h2 className="text-center max-w-[45rem] w-[50%] mt-[2rem] font-bold text-brown-500 m-auto p-4 rounded-[14px] text-[1.5rem] ">
        <div>
          Thank you for ordering with React-Food! Your order is on its way, and
          we can't wait for you to enjoy your delicious meal. We appreciate your
          trust in us to satisfy your cravings. If you ever need another
          culinary adventure, you know where to find us! Bon appétit!
        </div>
      </h2>
      <div className="flex justify-center">
        <img src={ThankYou} alt="thankYou-image"></img>
      </div>
    </div>
  );
}

export default ThankYouPage;
