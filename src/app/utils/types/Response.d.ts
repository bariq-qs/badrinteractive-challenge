export type TBasicPaginationResponse<TData> = {
  page: number
  limit: number
  total: number
  list: TData[]
}

export type TBasicResponse<TData> = {
  data: Array<TData>
}