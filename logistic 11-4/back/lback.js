const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');


const app = express();


const rdb = mysql.createConnection({
    host     : 'database-3.cvy5hjvppguv.us-west-2.rds.amazonaws.com',
    user     : 'cem302302',
    password : '302302cem',
    database:'retail_db'

});

const ldb = mysql.createConnection({
    host     : 'database-3.cvy5hjvppguv.us-west-2.rds.amazonaws.com',
    user     : 'cem302302',
    password : '302302cem',
    database:'logistic_db'

});

// connect mysql db
rdb.connect(err=>{
    if(err){
        throw err;
    }
    console.log('Retail Mysql Connected...');
});

ldb.connect(err=>{
    if(err){
        throw err;
    }
    console.log('Logistic Mysql Connected...');
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('home page')
});

app.get('/logistics/orders', (req, res) => {
    const select_all_orders = 'select order_id, customer_id, b.product_name,deliver_status,locker_location,locker_number,locker_password, product_quantity from retail_db.orders as a, retail_db.products as b where(b.product_id=a.product_id)'
    ldb.query(select_all_orders, (err, results)=>{
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

app.get('/logistics/orders/updates', (req, res) => {
    const { o_id, deliver_status } = req.query;
    const update_order = `UPDATE orders SET deliver_status = '${deliver_status}' WHERE order_id = ${o_id}`;
    rdb.query(update_order, (err, results) =>{

    })
    ldb.query(update_order, async (err, results) =>{
        if(err) {
            return res.send(err)
        }
        else{

          const deliData = await getDeliData(o_id);

          const ctmData = await getCtmData(deliData.ctmID);


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
              from: `"Logistic Team" <${SenderMail.usrnm}>`,
              to: ctmData.ctmEmail,
              subject: "Hi ! " + ctmData.ctmName + " " + "Your delivery status of " + `[OrderID: ${o_id}]` + " have been changed!",
              html: `<p>Dear ${ctmData.ctmName}</p><br /><br /><H1>Your order is now ${deliver_status}</H1><br /><H2>Your locker information as below</H2><li>Locker Location: ${deliData.lckLocation}</li><li>Locker Number: ${deliData.lckNumber}</li><li>Locker PassWord: ${deliData.lckPw}</li><p>Thank for using our services</p><br /><br /><p>From Logistic Team</p>`
          }

          ndmail.sendMail(mailFunction, (err, info) => {
              if (err) {
                  return console.log(err);
              }
              console.log('Mail %s sent %s', info.messageId, info.response);
          })

            return res.send('sucessfully updated order')
        }
    })
})

app.get('/logistics/orders/search', (req, res) => {
    const { o_id } = req.query;
    const search_order = `select order_id, customer_id, b.product_name, deliver_status,locker_location,locker_number,locker_password, product_quantity from retail_db.orders as a, retail_db.products as b where(b.product_id=a.product_id) and a.order_id = ${o_id}`;
    ldb.query(search_order, (err, results) => {
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

const getCtmData = (c_id) => {
    let ctmData = {};
    const ctmQuery = `SELECT customer_name, customer_email FROM customers WHERE customer_id = ${c_id}`
    return new Promise((resolve, reject) => {
        rdb.query(ctmQuery, function(err,rows) {
            ctmData.ctmEmail = rows[0].customer_email
            ctmData.ctmName = rows[0].customer_name
            resolve(ctmData);
        })
    })
}

const getDeliData = (o_id) => {
    let deliData = {};
    const deliQuery = `SELECT order_id, deliver_status, customer_id, locker_location, locker_number, locker_password FROM orders WHERE order_id = ${o_id}`
    return new Promise((resolve, reject) => {
        ldb.query(deliQuery, function(err,rows) {
            deliData.deliID = rows[0].order_id
            deliData.deliStatus = rows[0].deliver_status
            deliData.ctmID = rows[0].customer_id
	    deliData.lckLocation = rows[0].locker_location
	    deliData.lckNumber = rows[0].locker_number
	    deliData.lckPw = rows[0].locker_password
            resolve(deliData);
        })
    })
}

port=5000
app.listen(port,() =>{
    console.log('Server started on '+port);
});
