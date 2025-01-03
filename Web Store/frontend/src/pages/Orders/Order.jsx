import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { FaCreditCard } from "react-icons/fa";
import { useDeliverOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useUpdateOrderPaymentStatusMutation } from "../../redux/api/orderApiSlice";


const CreditCardModal = ({ onClose, onSubmitPayment }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!cardNumber || !expiryDate || !cvv || !name) {
      setError("Please fill in all fields.");
      return;
    }


    onSubmitPayment({ cardNumber, expiryDate, cvv, name });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Credit Card Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name on Card</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="1234 5678 1234 5678"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="MM/YY"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="CVV"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-between items-center mt-4">
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md w-full">
              Submit Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md w-full ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder] = usePayOrderMutation();
  const [updateOrderPaymentStatus] = useUpdateOrderPaymentStatusMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deliverOrder,{isLoading:loadingDeliver}]=useDeliverOrderMutation()

  const handleCreditCardPayment = async (paymentDetails) => {
    try {
     
      const paymentResponse = await payOrder({ orderId, details: paymentDetails });

      if (paymentResponse) {
   
        await updateOrderPaymentStatus({ orderId, isPaid: true });

     
        refetch();
        toast.success("Order paid with Credit Card");

       
        setPaymentMethod("Credit Card");

     
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };


  const deliverHandle=async()=>{
    await deliverOrder(orderId)
    refetch()
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">{(item.price).toFixed(2)}</td>
                      <td className="p-2">{(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order: </strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name: </strong> {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address: </strong> {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </p>

          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant='danger'>Not Paid</Message>
          )}

          <h2 className="text-xl font-bold mb-4 mt-10">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>$ {order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>$ {order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax</span>
            <span>$ {order.taxPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>$ {order.totalPrice}</span>
          </div>

          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <p>
            <strong className="text-pink-500">Method: </strong> {paymentMethod || order.paymentMethod}
          </p>
        </div>
        {!order.isPaid && userInfo && userInfo._id === order.user._id && (
  <div>
    <button
      className="w-full bg-blue-500 rounded-lg border h-10"
      onClick={() => setShowModal(true)}
    >
      Pay with Credit Card
    </button>
    {showModal && (
      <CreditCardModal
        onClose={() => setShowModal(false)}
        onSubmitPayment={handleCreditCardPayment}
      />
    )}
  </div>
)}

        {loadingDeliver && <Loader/>}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
  <div className="mt-10">
    <button
      type="button"
      className="bg-pink-500 text-white w-full py-2 rounded-full"
      onClick={deliverHandle}
    >
      Mark As Delivered
    </button>
  </div>
)}
      </div>
    </div>
  );
};

export default Order;
