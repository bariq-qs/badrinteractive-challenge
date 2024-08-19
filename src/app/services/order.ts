import api from '@/app/config/api'
import type {
  TBasicPaginationResponse,
  TBasicResponse
} from '@/app/utils/types/Response'
import type {
  TOrder,
  TOrderDetail,
  TParamOrderGetAll,
  TPayloadSaveOrder
} from './order-model'
import { useMutation, useQuery } from '@tanstack/react-query'

const endpoint = 'order'

class OrderService {
  getAll({
    page,
    limit,
    customer_name,
    order_date
  }: TParamOrderGetAll): Promise<TBasicPaginationResponse<TOrder>> {
    return api.get(`${endpoint}s`, {
      params: {
        page,
        limit,
        customer_name,
        order_date
      }
    })
      .then((response) => response.data)
  }
  getDetail(idOrder: string): Promise<TOrderDetail> {
    return api.get(`${endpoint}/${idOrder}`)
      .then((response) => response.data)
  }
  save(idOrder: string = '', payload: TPayloadSaveOrder) {
    if (idOrder) {
      return api.put(`${endpoint}/${idOrder}`, payload).then((response) => response.data)
    } return api.post(endpoint, payload).then((response) => response.data)
  }
  delete(idOrder: string) {
    return api.delete(`${endpoint}/${idOrder}`).then((res) => res.data)
  }
}

const orderService = new OrderService()

export const useOrderGetAll = (params: TParamOrderGetAll) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: (val) => orderService.getAll(params)
  })
}

export const useOrderDetail = (idOrder: string) => {
  return useQuery(
    {
      queryKey: ['order-detail', idOrder],
      queryFn: () => orderService.getDetail(idOrder),
      enabled: !!idOrder
    }
  )
}

export const useSaveOrder = () => {
  return useMutation({
    // mutationKey
    mutationFn: ({ idOrder, payload }: { idOrder: string, payload: TPayloadSaveOrder }) => orderService.save(idOrder, payload)
  })
}

export const useDeleteOrder = () => {
  return useMutation({
    // mutationKey
    mutationFn: ({ idOrder }: { idOrder: string }) => orderService.delete(idOrder)
  })
}