import WrapContent from "@/app/components/layouts/WrapContent";
import TableDefault from "@/app/components/TableDefault";
import { useOrderDetail } from "@/app/services";
import { rupiahFormat } from "@/app/utils/helpers/currency";
import { Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderManagementDetail = () => {
  const router = useRouter();
  const idOrder = router?.query?.id ?? "";
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const { data: dataOrderDetail } = useOrderDetail(idOrder as string);

  useEffect(() => {
    if (dataOrderDetail) {
      let totalPrice = 0;
      dataOrderDetail?.products.forEach((product) => {
        totalPrice += (product?.product_price ?? 0) * product.quantity;
      });
      setTotalOrderPrice(totalPrice);
    }
  }, [dataOrderDetail]);
  return (
    <WrapContent title='Order Detail'>
      <div className='p-4'>
        <div className='mb-5'>
          <p className='mb-4'>Order ID</p>
          <p className='text-xl font-bold'>{dataOrderDetail?.id}</p>
        </div>
        <div className='mb-5'>
          <p className='mb-4'>Customer Name</p>
          <p className='text-xl font-bold'>{dataOrderDetail?.customer_name}</p>
        </div>
        <div className='mb-5'>
          <p className='mb-4'>Total Order Price</p>
          <p className='text-xl font-bold'>{rupiahFormat(totalOrderPrice)}</p>
        </div>
        <Divider className='my-8' />
        <TableDefault
          data={dataOrderDetail?.products ?? []}
          columns={[
            {
              header: "Product Name",
              cell: () => "-",
            },
            {
              header: "Quantity",
              field: "quantity",
            },
            {
              header: "Price",
              field: "product_price",
              cell: (idx, data) => (
                <p>{rupiahFormat(data?.product_price ?? 0)}</p>
              ),
            },
            {
              header: "Total Product Price",
              cell: (idx, data) => (
                <p>
                  {rupiahFormat((data?.product_price ?? 0) * data.quantity)}
                </p>
              ),
            },
          ]}
        ></TableDefault>
      </div>
    </WrapContent>
  );
};

export default OrderManagementDetail;
