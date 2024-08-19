export type TParamOrderGetAll = {
  page: number,
  limit: number,
  customer_name?: string,
  order_date?: string
}

export type TOrder = {
  created_at: Date;
  customer_name: string;
  total_products: number;
  total_price: string;
  id: string;
}

export type TProduct = {
  quantity: number;
  product_price?: number;
  product_id: number;
}

export type TOrderDetail = {
  id: string;
  customer_name: string;
  products: TProduct[];
}

export type TPayloadSaveOrder = Pick<TOrderDetail, 'customer_name' | 'products'>