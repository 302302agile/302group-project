import React, { Component } from 'react';
export default class Create extends Component {

    state = {
        orders: [],
        order:{
            c_id: '',
            product_quantity:'',
            order_date: '',
            total_price: '',
            locker_location: '',
            locker_number:'',
            locker_password:'',
            deliver_status:''
            }
    }

        searchOrder = _ =>{
        const { order } = this.state;
        fetch(`http://localhost:4000/orders/search?o_id=${order.o_id}`)
        .then(response => response.json())
        .then(response => this.setState({ orders: response.data}))
        .catch(err => console.error(err))
      }
        updateOrder = _ =>{
        const { order } = this.state;
        fetch(`http://localhost:4000/updates?o_id=${order.o_id}&product_quantity=${order.product_quantity}&locker_location=${order.locker_location}&locker_number=${order.locker_number}&locker_password=${order.locker_password}&order_date=${order.order_date}`)
        fetch(`http://localhost:4000/logistic/updates?o_id=${order.o_id}&locker_location=${order.locker_location}&locker_number=${order.locker_number}&locker_password=${order.locker_password}&deliver_status=${order.deliver_status}&product_quantity=${order.product_quantity}`)
        .then(this.searchOrder)
        .catch(err => console.error(err))
        }

        componentDidMount(){
          this.getOrders();
        }

        getOrders = _ =>{
          fetch('http://localhost:4000/orders')
            .then(response => response.json())
            .then(response => this.setState({ orders: response.data}))
            .catch(err => console.error(err))
        }

        renderOrder = ({ order_id, customer_id, product_name, order_date, total_price, deliver_status, locker_location, locker_number, locker_password, product_quantity }) => <div key={ order_id }>

        order id: {order_id} <br></br> customer id: {customer_id} <br></br>customer id: {customer_id} <br></br> product_name: {product_name} <br></br> order date: {order_date}<br></br> total price: {total_price} <br></br>deliver status: {deliver_status}<br></br> locker location: {locker_location}<br></br> locker number: {locker_number}<br></br> locker password: {locker_password} <br></br> product_quantity: {product_quantity} <hr></hr>
        </div>


    render() {
      const { orders, order } = this.state;
        return (
            <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h3>Update Order</h3>
                    <br />
                    <div className="form-group">
                        <label>update ID</label>
                        <input
                            className="form-control"
                            placeholder="Enter Order ID"
                            value={order.o_id}
                            onChange={e => this.setState({ order: { ...order, o_id: e.target.value } })}></input>
                    </div>

                    <button type="button" className="btn btn-secondary" onClick={this.searchOrder}>Search</button><br></br>
                    <button type="button" className="btn btn-secondary" onClick={this.updateOrder}>Update</button><br></br>
                    update order_date: <input value={order.order_date} onChange={e => this.setState({ order: { ...order, order_date: e.target.value } })} ></input><br></br>
                    update_product_quantity:   <input value={order.product_quantity} onChange={e => this.setState({ order: { ...order, product_quantity: e.target.value } })} ></input><br></br>
                    update locker location: <input value={order.locker_location} onChange={e => this.setState({ order: { ...order, locker_location: e.target.value } })} ></input><br></br>
                    update locker number: <input value={order.locker_number} onChange={e => this.setState({ order: { ...order, locker_number: e.target.value } })} ></input><br></br>
                    update locker password: <input value={order.locker_password} onChange={e => this.setState({ order: { ...order, locker_password: e.target.value } })} ></input> <hr></hr>
                  </div>

                </div>
              </div>
              <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                        {orders.map(this.renderOrder)}
                    </div>
                  </div>
              </div>
            </div>
          </div>

        );
    }
}
