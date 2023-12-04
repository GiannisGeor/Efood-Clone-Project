import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import souvlaki from "../../assets/image-1.jpg";

export function ProductsCard({}) {
  return (
    <Card className=" w-96 m-auto mt-8">
      <List>
        <ListItem>
          <ListItemPrefix>
            <Avatar variant="circular" alt="candice" src={souvlaki} />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" className=" text-center" color="blue-gray">
              Tania Andrew
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Software Engineer @ Material Tailwind
            </Typography>
            <Typography className=" text-center">2,10€</Typography>
          </div>
        </ListItem>
      </List>
    </Card>
  );
}

{
  /* <tbody>
          {data.item?.productCategories?.map((category) => {
            return (
              <Fragment key={category?.id}>
                <tr className="bg-white-200">
                  <td
                    colSpan="3"
                    className="px-8 py-2 font-medium  font-extralight text-black whitespace-nowrap dark:text-blue-100"
                  >
                    {category?.name}
                  </td>
                </tr>
                {category?.products.map((product, productIndex) => (
                  <tr
                    className="border-b hover:bg-red-800 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                    key={productIndex}
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-blue-100"
                    >
                      {product?.name}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-blue-100"
                    >
                      {product?.price} euro
                    </td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>  */
}
