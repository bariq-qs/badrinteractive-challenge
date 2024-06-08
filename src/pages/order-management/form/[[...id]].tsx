import WrapContent from "@/app/components/layouts/WrapContent";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  initialOrderForm,
  initialProduct,
  schemaOrderForm,
} from "@/app/utils/schema/order";
import {
  Button,
  Divider,
  FormControl,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useOrderDetail, useProductGetAll, useSaveOrder } from "@/app/services";
import { ChangeEvent, useEffect } from "react";
import { rupiahFormat } from "@/app/utils/helpers/currency";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

const OrderManagementForm = () => {
  const router = useRouter();
  const toast = useToast();
  const idOrder = router?.query?.id ?? [];
  const isEdit = !isEmpty(idOrder);

  const { data: dataProducts } = useProductGetAll();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaOrderForm),
    defaultValues: initialOrderForm,
  });

  const { fields, append } = useFieldArray({
    control,
    name: "products",
  });
  const { data: dataOrderDetail, isLoading: isLoadingOrderDetail } =
    useOrderDetail(idOrder[0] ?? "");
  useEffect(() => {
    if (dataOrderDetail) {
      let totalPrice = 0;
      dataOrderDetail.products.forEach((val) => {
        const totalPerOrder = Number(val.product_price) * Number(val.quantity);
        totalPrice += totalPerOrder;
      });
      reset({
        ...dataOrderDetail,
        products: dataOrderDetail.products.map((product) => ({
          price: product.product_price,
          quantity: product.quantity,
          product_id: product.product_id.toString(),
          total_price: (product?.product_price ?? 0) * product.quantity,
        })),
        total_price: totalPrice,
      });
    }
  }, [dataOrderDetail]);

  const calculateTotalPriceProduct = () => {
    let totalPrice = 0;
    (watch("products") ?? []).forEach((val) => {
      const totalPerOrder = Number(val.price) * Number(val.quantity);
      totalPrice += totalPerOrder;
    });
    setValue("total_price", totalPrice);
  };

  const onChangeProduct = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const idVal = e.target.value ?? "";
    const findProduct = dataProducts?.data.find(
      (item) => item.id === Number(idVal)
    );
    let totalPrice = 0;
    let price = 0;
    if (findProduct) {
      totalPrice =
        Number(watch(`products.${index}.quantity`)) *
        Number(findProduct?.price);
      price = Number(findProduct?.price);
    }
    setValue(`products.${index}.product_id`, idVal);
    setValue(`products.${index}.price`, price);
    setValue(`products.${index}.total_price`, totalPrice);
    calculateTotalPriceProduct();
  };

  const onChangeQuantity = (index: number, value: string) => {
    const quantityValue = Number(value);
    const totalPrice = Number(watch(`products.${index}.price`)) * quantityValue;
    setValue(`products.${index}.quantity`, quantityValue);
    setValue(`products.${index}.total_price`, totalPrice);
    calculateTotalPriceProduct();
  };

  useEffect(() => {
    calculateTotalPriceProduct();
  }, [fields]);

  const { mutate: mutateSaveOrder, isPending: isPendingSave } = useSaveOrder();
  const onSubmit = handleSubmit((val) => {
    mutateSaveOrder(
      {
        idOrder: idOrder[0] ?? "",
        payload: {
          customer_name: val.customer_name,
          products: (val?.products ?? []).map((item) => ({
            product_id: Number(item.product_id),
            quantity: item.quantity,
          })),
        },
      },
      {
        onSuccess(isSuccess) {
          if (isSuccess) {
            toast({
              title: "Your data has been successfully saved",
              status: "success",
            });
            router.push("/order-management");
          }
        },
        onError(error) {
          toast({
            title: error.message,
            status: "error",
          });
        },
      }
    );
  });

  return (
    <WrapContent title='Add New Order'>
      <form onSubmit={onSubmit} className='p-4'>
        <div className='grid grid-cols-2 gap-8'>
          <FormControl className='mb-2 flex flex-col'>
            <label className='required'>Customer Name</label>
            <Input
              id='cutomer_name'
              className='w-1/2'
              {...register("customer_name")}
              disabled={isEdit}
              placeholder='Input customer name'
            ></Input>
            <small className='invalid-text'>
              {errors.customer_name?.message}
            </small>
          </FormControl>
        </div>
        <Divider className='my-4' />
        <p style={{ color: "#6E7478" }} className='mb-4'>
          Product Detail
        </p>
        {fields.map((field, pIdx) => (
          <span key={pIdx}>
            <div className='grid grid-cols-2 gap-8'>
              <div>
                <div className='flex flex-col mb-4'>
                  <label className='required'>Product Name</label>
                  <Select
                    placeholder='Select product name'
                    onChange={(val) => onChangeProduct(pIdx, val)}
                  >
                    {dataProducts?.data.map((product, prodIdx) => (
                      <option value={product.id} key={prodIdx}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                  <small className='invalid-text'>
                    {(errors?.products ?? [])[pIdx]?.product_id?.message}
                  </small>
                </div>
                <div className='flex flex-col mb-4'>
                  <label className='required'>Quantity</label>
                  <Input
                    value={watch(`products.${pIdx}.quantity`)}
                    onChange={(e) => onChangeQuantity(pIdx, e.target.value)}
                    className='w-1/2'
                    placeholder='Input Quantity'
                    type='number'
                  ></Input>
                  <small className='invalid-text'>
                    {(errors?.products ?? [])[pIdx]?.quantity?.message}
                  </small>
                </div>
              </div>
              <div className=''>
                <div className='mb-4 flex flex-col'>
                  <label>Price</label>
                  <Input
                    value={rupiahFormat(
                      Number(watch(`products.${pIdx}.price`))
                    )}
                    className='w-1/2'
                    disabled
                    placeholder='You need to select product name'
                  ></Input>
                </div>
                <div className='mb-4 flex flex-col'>
                  <label>Total Product Price</label>
                  <Input
                    value={rupiahFormat(
                      Number(watch(`products.${pIdx}.total_price`))
                    )}
                    className='w-1/2'
                    disabled
                    placeholder='You need to input quantity'
                  ></Input>
                </div>
              </div>
            </div>
            <Divider className='my-4' />
          </span>
        ))}
        <Button
          className='mt-4'
          style={{ backgroundColor: "#042A49", color: "white" }}
          onClick={() => append(initialProduct)}
        >
          Add More Product
        </Button>
        <Divider className='my-4' />
        <div className='grid grid-cols-2'>
          <div className='mb-2 flex flex-col'>
            <label className='required'>Total Order Price</label>
            <Input
              value={rupiahFormat(Number(watch("total_price")))}
              className='w-1/2'
              disabled
            ></Input>
          </div>
        </div>
        <div className='flex mt-4 gap-7'>
          <Button
            colorScheme='cyan'
            style={{ color: "white" }}
            type='submit'
            isLoading={isPendingSave || isLoadingOrderDetail}
          >
            Save
          </Button>
          <Button
            style={{
              backgroundColor: "transparent",
              border: "1px solid #E0E0E0",
            }}
            onClick={() => router.push("/order-management")}
          >
            Back
          </Button>
        </div>
      </form>
    </WrapContent>
  );
};

export default OrderManagementForm;
