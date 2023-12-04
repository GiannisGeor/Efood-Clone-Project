import food from "../../assets/Food.jpg";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export function StoreCard({ store }) {
  const navigate = useNavigate();

  console.log("store", store);
  return (
    <Card
      className=" w-64 flex items-center content-start hover:bg-red-900 hover:shadow-md cursor-pointer"
      onClick={() => navigate(`/store/${store?.id}`)}
    >
      <CardHeader shadow={false} floated={false} className=" h-64">
        <img
          src={food}
          alt="card-image"
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <div className="mb-2 flex items-center justify-between w-40">
          <Typography color="blue-gray" className="font-bold">
            {store.name}
          </Typography>
          <Typography color="blue-gray" className=" font-normal opacity-90">
            {store?.storeCategory?.name}
          </Typography>
        </div>
        <Typography
          variant="small"
          color="gray"
          className="font-normal text-center opacity-75"
        >
          address: {store?.address?.fullAddress}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          ripple={false}
          fullWidth={true}
          className="bg-red-800 hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          onClick={() => navigate(`/store/${store?.id}`)}
        >
          ORDER
        </Button>
      </CardFooter>
    </Card>
  );
}
