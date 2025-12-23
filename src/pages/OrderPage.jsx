import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../actions/orderActions';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  return loading ? (
    <h2>Loading Order...</h2>
  ) : error ? (
    <p style={{ color: 'red' }}>{error}</p>
  ) : (
    <div style={{ padding: '2rem' }}>
      <h1>Order: {order._id}</h1>
      <p><strong>Name: </strong> {order.user.name}</p>
      <p><strong>Email: </strong> {order.user.email}</p>
      <p><strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
      
      <h3>Order Items</h3>
      {order.orderItems.map((item, index) => (
        <div key={index}>
          {item.name} - {item.qty} x ${item.price}
        </div>
      ))}
      <hr />
      <h4>Total: ${order.totalPrice}</h4>
    </div>
  );
};

export default OrderPage;