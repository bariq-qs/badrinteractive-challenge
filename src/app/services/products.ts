import { useQuery } from '@tanstack/react-query'
import axl from '../config/api'
import type {
  TProduct
} from './products-model'
import type {
  TBasicResponse
} from '../utils/types/Response'

const endpoint = 'products'
class ProductsService {
  getAll(): Promise<TBasicResponse<TProduct>> {
    return axl.get(`${endpoint}`).then((response) => response.data)
  }
}

const productService = new ProductsService()

export const useProductGetAll = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  })
}