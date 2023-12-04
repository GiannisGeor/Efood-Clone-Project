// import { useRef, useState } from "react";
// import Input from "../UI/Input";

// const ProductQuantity = (props) => {
//   const [amountIsValid, setAmountIsValid] = useState(true);
//   const amountInputRef = useRef();

//   const submitHandler = (event) => {
//     event.preventDefault();

//     const enteredAmount = amountInputRef.current.value;
//     const enteredAmountNumber = +enteredAmount;

//     if (
//       enteredAmount.trim().length === 0 ||
//       enteredAmountNumber < 1 ||
//       enteredAmountNumber > 99
//     ) {
//       setAmountIsValid(false);
//       return;
//     }

//     var handleSuccess = () => {
//       console.log("success");
//     };

//     props.onAddToCart(enteredAmountNumber);
//   };

//   return (
//     <form className=" flex flex-row bg-white" onSubmit={submitHandler}>
//       <div className=" bg-blue-gray-200 py-2 px-4 rounded-[14px]">
//         <Input
//           ref={amountInputRef}
//           label="Amount"
//           input={{
//             id: "amount_" + props.id,
//             type: "number",
//             min: "1",
//             max: "99",
//             step: "1",
//             defaultValue: "1",
//           }}
//         />
//       </div>
//       <button
//         className=" ml-44 text-white bg-red-800 py-2 px-4 rounded-[14px]"
//         // onClick={handleSuccess}
//       >
//         Add
//       </button>
//       {!amountIsValid && <p>Please enter a valid amount (1-99).</p>}
//     </form>
//   );
// };

// export default ProductQuantity;
