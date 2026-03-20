import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../actions/orderActions';
import { formatTaka } from '../../utils/currencyUtils';
import '../../styles/OrderListPage.css';

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <div className="order-page">

      {/* ── Header ── */}
      <div className="order-header">
        <h1 className="order-title">Admin Dashboard: Orders</h1>
        <p className="order-subtitle">Manage and track all customer purchases</p>
      </div>

      {/* ── States ── */}
      {loading ? (
        <div className="order-loading">Loading Orders...</div>
      ) : error ? (
        <p className="order-error">{error}</p>
      ) : (
        <div className="order-table-wrapper">
          <div className="order-table-scroll">
            <table className="order-table">
              <thead>
                <tr className="order-thead-row">
                  <th className="order-th">Order ID</th>
                  <th className="order-th">Customer</th>
                  <th className="order-th">Date</th>
                  <th className="order-th">Total</th>
                  <th className="order-th">Paid Status</th>
                  <th className="order-th">Delivery</th>
                  <th className="order-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`order-row ${index % 2 === 0 ? 'order-row--even' : 'order-row--odd'}`}
                  >
                    <td className="order-td order-td--id">
                      {order._id.substring(0, 12)}...
                    </td>

                    <td className="order-td order-td--name">
                      {order.user?.name || 'Deleted User'}
                    </td>

                    <td className="order-td">
                      {order.createdAt.substring(0, 10)}
                    </td>

                    <td className="order-td order-td--price">
                      {formatTaka(order.totalPrice)}
                    </td>

                    <td className="order-td">
                      {order.isPaid ? (
                        <span className="order-badge order-badge--success">
                          Paid ({order.paidAt.substring(0, 10)})
                        </span>
                      ) : (
                        <span className="order-badge order-badge--danger">Pending</span>
                      )}
                    </td>

                    <td className="order-td">
                      {order.isDelivered ? (
                        <span className="order-badge order-badge--success">Delivered</span>
                      ) : (
                        <span className="order-badge order-badge--warning">In Transit</span>
                      )}
                    </td>

                    <td className="order-td">
                      <button
                        className="order-details-btn"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderListPage;