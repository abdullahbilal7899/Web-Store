import {apiSlice} from './apiSlice'
import { ORDER_URL } from '../constants'


export const orderApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({

        createOrder:builder.mutation({
            query:(order)=>({
                url:ORDER_URL,
                method:"POST",
                body:order
            })
        }),

getOrderDetails:builder.query({
    query:(id)=>({
url:`${ORDER_URL}/${id}`
    })
}),

payOrder:builder.mutation({
    query:({orderId,details})=>({
        url:`${ORDER_URL}/${orderId}/pay`,
        method:"PUT",
        body:details
    })
}),

getMyOrders:builder.query({
    query:()=>({
        url:`${ORDER_URL}/mine`
    }),
    keepUnusedDataFor:5
}),

getOrders:builder.query({
    query:()=>({
        url:ORDER_URL
    })
}),


deliverOrder:builder.mutation({
    query:(orderId)=>({
        url:`${ORDER_URL}/${orderId}/deliver`,
        method:"PUT",
    })
}),

getTotalOrders:builder.query({
    query:()=>`${ORDER_URL}/total-orders`
}),

getTotalSales: builder.query({
    query: () => `${ORDER_URL}/total-sales`,
  }),


getTotalSalesByDate:builder.query({
    query:()=> `${ORDER_URL}/total-sales-by-date`
}),

updateOrderPaymentStatus:builder.mutation({
    query: ({ orderId, isPaid }) => ({
      url: `${ORDER_URL}/${orderId}/update-payment-status`,
      method: "PUT",
      body: { isPaid }
    })
  }),

    }),

 
    
})


export const {
    useGetTotalOrdersQuery,
    useGetTotalSalesByDateQuery,
    useGetTotalSalesQuery,
    //------------

    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetMyOrdersQuery,
    useDeliverOrderMutation,
    useGetOrdersQuery,
    useUpdateOrderPaymentStatusMutation

}= orderApiSlice