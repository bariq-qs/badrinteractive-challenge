
import * as yup from "yup"

const schemaOrderForm = yup.object(
  {
    customer_name: yup.string().required('Harus diisi.'),
    products: yup.array().of(yup.object().shape({
      product_id: yup.string().required('Harus diisi.'),
      quantity: yup.number().required('Harus diisi.'),
      price: yup.number().required(),
      total_price: yup.number().required()
    })),
    total_price: yup.number()
  }
)

type TSchemaOrderForm = yup.InferType<typeof schemaOrderForm>

const initialProduct = {
  product_id: '',
  quantity: 0,
  price: 0,
  total_price: 0
}

const initialOrderForm: TSchemaOrderForm = {
  customer_name: '',
  products: [initialProduct],
  total_price: 0
}

export {
  schemaOrderForm,
  initialOrderForm,
  initialProduct
}

export type {
  TSchemaOrderForm
}