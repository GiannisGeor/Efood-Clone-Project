import axios from "axios";
import { StoreCard } from "./Layout/StoreCard";
import React from "react";
import Header from "./Layout/Header";

import { useEffect, useState } from "react";
import { Spinner } from "@material-tailwind/react";

function StoreCatalogPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(
        "http://localhost:5237/api/v1/Store/store-store-category-and-address"
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header></Header>
      <div className=" bg-white rounded-2xl">
        {loading ? (
          <div className="flex flex-col items-center">
            <Spinner
              className=" flex justify-center items-center mt-40 h-12 w-12"
              color="red"
            />
          </div>
        ) : (
          <div className=" flex flex-wrap space-x-16 justify-center ">
            {data.items?.map((store) => {
              return <StoreCard store={store} key={store?.id}></StoreCard>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreCatalogPage;
