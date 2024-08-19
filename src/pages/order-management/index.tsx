import WrapContent from "@/app/components/layouts/WrapContent";
import TableDefault from "@/app/components/TableDefault";
import { TOrder, useDeleteOrder, useOrderGetAll } from "@/app/services";
import { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import EditIcon from "@/app/assets/icon/edit.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-regular-svg-icons";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { rupiahFormat } from "@/app/utils/helpers/currency";
import { useConfirmationModal } from "@/app/components/Confirmation";

const IndexOrderManagement = () => {
  const [customerName, setCustomerName] = useState("");
  const [page, setPage] = useState(1);
  const [orderDate, setOrderDate] = useState("");
  const toast = useToast();

  const router = useRouter();

  const { triggerModal, ConfirmationModal } = useConfirmationModal();

  const {
    data: dataOrders,
    isLoading,
    refetch,
  } = useOrderGetAll({
    customer_name: customerName,
    page,
    limit: 10,
    order_date: orderDate ? moment(orderDate).format("DD/MM/YYYY") : "",
  });

  const { mutate } = useDeleteOrder();

  const onDetail = (path: string) => {
    router.push(path);
  };

  const processDelete = (val: TOrder) => {
    mutate(
      {
        idOrder: val.id,
      },
      {
        onSuccess() {
          toast({
            title: "Your data has been successfully deleted",
            status: "success",
          });
          refetch();
        },
        onError(error) {
          toast({
            title: error.message,
            status: "error",
          });
        },
      }
    );
  };

  const onDelete = (val: TOrder) => {
    triggerModal({
      title: "Delete Confirmation",
      body: "Are you sure you want to delete this item?",
      onConfirm: () => processDelete(val),
    });
  };

  return (
    <>
      <WrapContent title='Order Management'>
        <div className='flex justify-between items-end mb-4'>
          <Box gap={4} display='flex'>
            <FormControl className='flex flex-col' as='div'>
              <label>Customer Name</label>
              <InputGroup>
                <Input
                  type='text'
                  placeholder='Input customer name'
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                  }}
                />
                <InputRightElement pointerEvents='none'>
                  <FontAwesomeIcon icon={faSearch} />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl className='flex flex-col' as='div'>
              <label>Create Date</label>
              <Input
                placeholder='Select Date'
                size='md'
                type='date'
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </FormControl>
          </Box>
          <Button
            colorScheme='cyan'
            style={{ color: "white" }}
            type='submit'
            onClick={() => onDetail("/order-management/form")}
          >
            Add New Order
          </Button>
        </div>
        <TableDefault
          isLoading={isLoading}
          data={dataOrders?.list ?? []}
          columns={[
            {
              field: "id",
              header: "Oder Id",
            },
            {
              field: "customer_name",
              header: "Customer Name",
            },
            {
              field: "total_products",
              header: "Total Products",
            },
            {
              field: "total_price",
              header: "Total Price",
              cell: (idx, data) => rupiahFormat(Number(data.total_price)),
            },
            {
              field: "created_at",
              header: "Oder Date",
              cell: (idx, data) =>
                moment(data.created_at).format("DD/MM/YYYY HH:mm"),
            },
            {
              header: "Action",
              cell: (idx, data) => (
                <div className='flex gap-5 items-center'>
                  <Image
                    src={EditIcon}
                    alt='edit'
                    className='h-5 cursor-pointer'
                    onClick={() =>
                      onDetail(`/order-management/form/${data.id}`)
                    }
                  />
                  <FontAwesomeIcon
                    icon={faListAlt}
                    className='h-5 cursor-pointer'
                    style={{ color: "#00b4ff" }}
                    onClick={() =>
                      onDetail(`/order-management/detail/${data.id}`)
                    }
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "#FF0000" }}
                    className='h-5 cursor-pointer'
                    onClick={() => onDelete(data)}
                  ></FontAwesomeIcon>
                </div>
              ),
            },
          ]}
        />
        <ConfirmationModal />
      </WrapContent>
    </>
  );
};

export default IndexOrderManagement;
