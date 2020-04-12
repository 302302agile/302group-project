import React, { Component } from 'react';
export default class Search extends Component {

    state = {
        orders: [],
        order:{
            o_id:'',
            c_id: '',
            product_id:'',
            product_name:'',
            order_date: '',
            total_price: '',
            locker_location: '',
            locker_number:'',
            locker_password:'',
            product_quantity:''
              }
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

      addOrder =_ =>{
        const { order }=this.state;
        fetch(`http://localhost:4000/orders/add?o_id=${order.o_id}&c_id=${order.c_id}&product_id=${order.product_id}&order_date=${order.order_date}&locker_location=${order.locker_location}&locker_number=${order.locker_number}&locker_password=${order.locker_password}&product_quantity=${order.product_quantity}`)
        fetch(`http://localhost:4000/logistic/orders/add?o_id=${order.o_id}&c_id=${order.c_id}&product_id=${order.product_id}&product_quantity=${order.product_quantity}&locker_location=${order.locker_location}&locker_number=${order.locker_number}&locker_password=${order.locker_password}`)
        .then(this.getOrders)
        .catch(err => console.error(err))
      }

      renderOrder = ({ order_id,customer_id, product_name, order_date, total_price, deliver_status, locker_location, locker_number, locker_password, product_quantity }) => <div key={ order_id }>

        order id: {order_id} <br></br> customer id: {customer_id} <br></br>  product_name: {product_name} <br></br>order date: {order_date}<br></br> total price: {total_price} <br></br>deliver status: {deliver_status}<br></br> locker location: {locker_location}<br></br> locker number: {locker_number}<br></br> locker password: {locker_password} <br></br> product_quantity: {product_quantity} <hr></hr>
        </div>


    render() {
        const { orders, order } = this.state;
        return (
            <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h3>Create Order</h3>
                    <br />
                    <div className="form-group">
                        <label>Order ID</label>
                        <input
                            className="form-control"
                            placeholder="Enter Order ID"
                            value={order.o_id}
                            onChange={e => this.setState({ order: { ...order, o_id: e.target.value } })}></input>
                    </div>
                    <div className="form-group">
                        <label>Customer ID</label>
                        <input
                            className="form-control"
                            placeholder="Enter Customer ID"
                            value={order.c_id}
                            onChange={e => this.setState({ order: { ...order, c_id: e.target.value } })}></input>
                    </div>
                    <div className="form-group">
                        <label>product id</label>
                        <input
                            className="form-control"
                            placeholder="Enter Product id"
                            value={order.product_id}
                            onChange={e => this.setState({ order: { ...order, product_id: e.target.value } })}></input>
                    </div>

                    <div className="form-group">
                        <label>Order date</label>
                        <input
                            className="form-control"
                            placeholder="Enter Order date"
                            value={order.order_date}
                            onChange={e => this.setState({ order: { ...order, order_date: e.target.value }})}></input>
                    </div>

                    <div className="form-group">
                        <label>Locker Location</label>
                        <input
                            className="form-control"
                            placeholder="Enter Locker Location"
                            value={order.locker_location}
                            onChange={e => this.setState({ order: { ...order, locker_location: e.target.value } })}></input>
                    </div>

                    <div className="form-group">
                        <label>Locker Number</label>
                        <input
                            className="form-control"
                            placeholder="Enter Locker Number"
                            value={order.locker_number}
                            onChange={e => this.setState({ order: { ...order, locker_number: e.target.value } })}></input>
                    </div>

                    <div className="form-group">
                        <label>Locker Password</label>
                        <input
                            className="form-control"
                            placeholder="Enter Locker Password"
                            value={order.locker_password}
                            onChange={e => this.setState({ order: { ...order, locker_password: e.target.value } })}></input>
                    </div>

                    <div className="form-group">
                        <label>Product Quantity</label>
                        <input
                            className="form-control"
                            placeholder="Enter Product Quantity"
                            value={order.product_quantity}
                            onChange={e => this.setState({ order: { ...order, product_quantity: e.target.value } })}></input>
                    </div>

                    <button type="button" className="btn btn-secondary" onClick={this.addOrder}>Add product</button>
                  </div>
                </div><br />
              </div>
              <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                        {orders.map(this.renderOrder,this.addOrder)}
                    </div>
                  </div>
              </div>
            </div>
          </div>

        );
    }
}
