const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');



const app = express();


const db = mysql.createConnection({
    host     : 'database-3.cvy5hjvppguv.us-west-2.rds.amazonaws.com',
    user     : 'cem302302',
    password : '302302cem',
    database:'retail_db'

});

const dbabc = mysql.createConnection({
    host     : 'database-3.cvy5hjvppguv.us-west-2.rds.amazonaws.com',
    user     : 'cem302302',
    password : '302302cem',
    database:'logistic_db'

});

// connect mysql db



db.connect(err=>{
    if(err){
        throw err;
    }
    console.log('Retail Mysql Connected...');
});

dbabc.connect(err=>{
    if(err){
        throw err;
    }
    console.log('Logistic Mysql Connected...');
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('home page')
});


app.get('/logistic/orders/add', (req, res) => {
    const { o_id, c_id, product_id, product_quantity, locker_location, locker_number, locker_password } = req.query;
    const insert_order=`insert into orders (order_id, customer_id, product_id, product_quantity, locker_location, locker_number, locker_password) values('${o_id}','${c_id}','${product_id}','${product_quantity}','${locker_location}','${locker_number}','${locker_password}')`;
    dbabc.query(insert_order, (err, results) =>{
        if(err) {
            return res.send(err)
        }
        else{
            return res.send('sucessfully added new order')
        }
    })

})

app.get('/orders/add', (req, res) => {
    const { o_id, c_id, product_id, order_date, total_price, locker_location, locker_number, locker_password, product_quantity, product_price } = req.query;
    const insert_user=`insert into orders (order_id, customer_id, product_id, order_date, total_price, locker_location, locker_number, locker_password, product_quantity, product_price) values('${o_id}', '${c_id}','${product_id}', '${order_date}','${total_price}','${locker_location}','${locker_number}','${locker_password}','${product_quantity}','${product_price}')`;
    const update_price=`update retail_db.orders set product_price = (select product_price from products where orders.product_id = products.product_id) where order_id=('${o_id}')`;
    const cal_price=`update retail_db.orders set total_price= product_quantity*product_price where order_id=('${o_id}')`;
    db.query(insert_user, (err, results) =>{

    })
    db.query(update_price, (err, results) =>{

    })
    db.query(cal_price, async (err, results) =>{
        if(err) {
            return res.send(err)
        }
        else{

		      const ctmData = await getCtmData(c_id);


          const ndmail = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: '302emailemail@gmail.com',
                  pass: 'zjajfmhonyldqrxx'
              }
          });

          const SenderMail = {
              usrnm: '302emailemail@gmail.com'
          }

          const mailFunction = {
              from: `"Retail Team" <${SenderMail.usrnm}>`,
              to: ctmData.ctmEmail,
              subject: "Hi ! " + ctmData.ctmName + " " + "Your order have been placed!",
              html: `<p>Dear ${ctmData.ctmName}</p><br /><br /><p>Your order has been well received and we are working on it now</p><br /><p>Thank for using our services</p><br /><br /><p>From Retail Team</p>`
          }

          ndmail.sendMail(mailFunction, (err, info) => {
              if (err) {
                  return console.log(err);
              }
              console.log('Mail %s sent %s', info.messageId, info.response);
          })

            return res.send('sucessfully added new order')
        }
    })

})

app.get('/orders/delete', (req, res) => {
    const { o_id } = req.query;
    const delete_order = `DELETE FROM orders WHERE order_id = ${o_id }`
    db.query(delete_order, (err, results) =>{
        if(err) {
            return res.send(err)
        }
        else{
            return res.send('sucessfully deleted order')
        }
    })
})

app.get('/logistic/orders/delete', (req, res) => {
    const { o_id } = req.query;
    const delete_order = `DELETE FROM orders WHERE order_id = ${o_id }`
    dbabc.query(delete_order, (err, results) =>{
        if(err) {
            return res.send(err)
        }
        else{
            return res.send('sucessfully deleted order')
        }
    })
})


app.get('/orders/search', (req, res) => {
    const { o_id } = req.query;
    const search_order = `select order_id, customer_id, b.product_name,order_date, total_price,deliver_status,locker_location,locker_number,locker_password, product_quantity from retail_db.orders as a, retail_db.products as b where(b.product_id=a.product_id) and a.order_id = ${o_id}`;
    db.query(search_order, (err, results) => {
      if(err) {
        return res.send(err)
      }
      else {
        return res.json({
          data: results
        })
      }
    })
})

const select_all_orders = 'select order_id, customer_id, b.product_name,order_date, total_price,deliver_status,locker_location,locker_number,locker_password, product_quantity from retail_db.orders as a, retail_db.products as b where(b.product_id=a.product_id)'

app.get('/orders', (req, res) => {
    db.query(select_all_orders, (err, results)=>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/products', (req, res) => {
    db.query(`select * from products`, (err, results)=>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/updates', (req, res) => {
    const { o_id, product_quantity, locker_location, locker_number, locker_password, order_date  } = req.query;
    const update_order = `UPDATE orders SET product_quantity='${product_quantity}', locker_location = '${locker_location }',locker_number = '${locker_number }',locker_password = '${locker_password }',order_date = '${order_date }' WHERE order_id = ${o_id }`
    const cal_price=`update retail_db.orders set total_price= product_quantity*product_price where order_id=('${o_id}')`;
    db.query(update_order, (err, results) =>{

    })
    db.query(cal_price, (err, results) =>{
        if(err) {
            return res.send(err)
        }
        else{
            return res.send('sucessfully updated order')
        }
    })
})

app.get('/logistic/updates', (req, res) => {
    const { o_id, locker_location, locker_number, locker_password, product_quantity} = req.query;
    const update_order = `UPDATE orders SET locker_location = '${locker_location }',locker_number = '${locker_number }',locker_password = '${locker_password }' ,product_quantity = '${product_quantity}'WHERE order_id = ${o_id }`
    dbabc.query(update_order, (err, results) =>{
        if(err) {
            return res.send(err)
        }
        else{
            return res.send('sucessfully updated order')
        }
    })
})

const getCtmData = (c_id) => {
    let ctmData = {};
    const ctmQuery = `SELECT customer_name, customer_email FROM customers WHERE customer_id = ${c_id}`
    return new Promise((resolve, reject) => {
        db.query(ctmQuery, function(err,rows) {
            ctmData.ctmEmail = rows[0].customer_email
            ctmData.ctmName = rows[0].customer_name
            resolve(ctmData);
        })
    })
}


port=4000
app.listen(port,() =>{
    console.log('Server started on '+port);
});
