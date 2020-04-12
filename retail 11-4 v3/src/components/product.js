import React, { Component } from 'react';
export default class Product extends Component {

    state = {
        products: [],
        product:{
          product_id:'',
          product_name:'',
          product_type:'',
          product_price:'',
          product_description:''
            }
    }


      componentDidMount(){
        this.getProducts();
      }

      getProducts = _ =>{
        fetch('http://localhost:4000/products')
          .then(response => response.json())
          .then(response => this.setState({ products: response.data}))
          .catch(err => console.error(err))
      }


      renderProduct = ({ product_id, product_name, product_type, product_price,product_description }) => <div key={ product_id }>

        product_id: {product_id} <br></br>
         product_name: {product_name} <br></br>
          product_type: {product_type}<br></br>
           product_price: {product_price} <br></br>
           product_description {product_description}<br></br> <hr></hr>
        </div>


    render() {
        const { products,product } = this.state;
        return (
            <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h3>View Products</h3>
                    <br />

                  </div>
                </div><br />
              </div>
              <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                        {products.map(this.renderProduct)}
                    </div>
                  </div>
              </div>
            </div>
          </div>

        );
    }
}
