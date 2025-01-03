import Order from "../models/orderModel.js"
import Product from '../models/productModel.js'
import calcPrices from "../utils/orderCalculate.js"



const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllOrders=async(req,res)=>{
try {

    const orders=await Order.find({}).populate('user','id username')
 res.json(orders)
    
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

const getUserOrders=async(req,res)=>{
    try {
        const orders= await Order.find({user:req.user._id})
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const countTotalOrders=async(req,res)=>{
    try {
        const totalOrders=await Order.countDocuments()
        res.json({totalOrders})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const findOrderById=async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id).populate('user','username email')

        if(order){
            res.json(order)
        }else{
            res.status(404)
            throw new Error("Order Not Found")
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const markOrderAsPaid=async(req,res)=>{
    try {
        const order =await Order.findById(req.params.id)

        if(order){
            order.isPaid=true,
            order.paidAt= Date.now()
            order.paymentResult={
                id:req.body.id,
                status:req.body.status,
                update_time:req.body.update_time,
                email_address:req.body.payer.email_address
            }
            const updateOrder=await order.save()
            res.status(200).json(updateOrder)

        }else{
            res.status(404)
            throw new Error('Order Not Found')
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const markOrderAsDelivered = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
  
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404);
        throw new Error("Order not found");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




const updateOrderPaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { isPaid } = req.body;

  try {
 
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

   
    order.isPaid = isPaid;
    order.paidAt = isPaid ? Date.now() : null; 

 
    await order.save();

    return res.status(200).json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {createOrder,getAllOrders,getUserOrders,countTotalOrders,
    calculateTotalSales,calculateTotalSalesByDate,findOrderById,
    markOrderAsPaid,markOrderAsDelivered,updateOrderPaymentStatus
}