const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// API Route
// ✅ POST login route
app.post('/api/login', (req, res) => {
  const { uname, psw } = req.body;

  if (!uname || !psw) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const query = 'SELECT * FROM tbl_users WHERE USR_Username = ? AND USR_PasswordHash = ?';
  db.query(query, [uname, psw], (err, results) => {
    if (err) {
      console.error('Login query failed:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// ===================== Customers Services =====================

app.get('/customers', (req, res) => {
  db.query('SELECT * FROM tbl_customer_info WHERE CUS_Status != "Deleted"', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/customers', (req, res) => {
  const { CUS_CustomerName, CUS_PhoneNumber, CUS_Village, CUS_Block, CUS_District, CUS_CreatedBy } = req.body;
  const sql = `INSERT INTO tbl_customer_info
    (CUS_CustomerName, CUS_PhoneNumber, CUS_Village, CUS_Block, CUS_District, CUS_CreatedBy)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [CUS_CustomerName, CUS_PhoneNumber, CUS_Village, CUS_Block, CUS_District, CUS_CreatedBy];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, message: 'Customer created successfully' });
  });
});

// Soft delete customer
app.delete('/customers/:id', (req, res) => {
  const id = req.params.id;
  const { CUS_LastModifiedBy } = req.body;

  const sql = `UPDATE tbl_customer_info SET CUS_Status = 'Deleted', CUS_LastModifiedBy = ? WHERE CUS_CustomerID = ?`;

  db.query(sql, [CUS_LastModifiedBy, id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully (soft delete)' });
  });
});

app.put('/customers/:id', (req, res) => {
  const id = req.params.id;
  const { CUS_CustomerName, CUS_PhoneNumber, CUS_Village, CUS_Block, CUS_District, CUS_LastModifiedBy, CUS_Status } = req.body;

  const sql = `UPDATE tbl_customer_info SET
    CUS_CustomerName = ?,
    CUS_PhoneNumber = ?,
    CUS_Village = ?,
    CUS_Block = ?,
    CUS_District = ?,
    CUS_LastModifiedBy = ?,
    CUS_Status = ?
    WHERE CUS_CustomerID = ?`;

  const values = [CUS_CustomerName, CUS_PhoneNumber, CUS_Village, CUS_Block, CUS_District, CUS_LastModifiedBy, CUS_Status, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Customer not found' });
    res.json({ message: 'Customer updated successfully' });
  });
});

// ===================== Order Items =====================

app.get('/order-items', (req, res) => {
  db.query('SELECT * FROM tbl_order_items WHERE OIT_Status != "Deleted"', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/order-items', (req, res) => {
  const item = req.body;
  const sql = `INSERT INTO tbl_order_items (OIT_ORD_OrderID, OIT_PRD_ProductID, OIT_Quantity, OIT_Price, OIT_ItemAmount, OIT_Discount, OIT_TotalAmount, OIT_Status, OIT_CreatedBy)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    item.OIT_ORD_OrderID,
    item.OIT_PRD_ProductID,
    item.OIT_Quantity,
    item.OIT_Price,
    item.OIT_ItemAmount,
    item.OIT_Discount,
    item.OIT_TotalAmount,
    item.OIT_Status || 'Active',
    item.OIT_CreatedBy
  ];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Item added to order', itemId: result.insertId });
  });
});

app.put('/order-items/:id', (req, res) => {
  const id = req.params.id;
  const item = req.body;
  const sql = `UPDATE tbl_order_items SET
    OIT_Quantity = ?, OIT_Price = ?, OIT_ItemAmount = ?, OIT_Discount = ?, OIT_TotalAmount = ?, OIT_Status = ?, OIT_LastModifiedBy = ?
    WHERE OIT_OrderItemID = ?`;
  const values = [
    item.OIT_Quantity,
    item.OIT_Price,
    item.OIT_ItemAmount,
    item.OIT_Discount,
    item.OIT_TotalAmount,
    item.OIT_Status,
    item.OIT_LastModifiedBy,
    id
  ];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Order item updated successfully' });
  });
});

app.delete('/order-items/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tbl_order_items WHERE OIT_OrderItemID = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Order item deleted successfully' });
  });
});

app.get('/order-items/order/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  db.query('SELECT * FROM tbl_order_items WHERE OIT_ORD_OrderID = ?', [orderId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create New Order
app.post('/orders', (req, res) => {
  const order = req.body;
  const sql = `INSERT INTO tbl_order_info (
    ORD_CUS_CustomerID, ORD_PhoneNumber, ORD_ShortDescription, ORD_AdminComments, ORD_OrderStatus,
    ORD_OrderAmount, ORD_Discount, ORD_Total, ORD_DeliveryStatus, ORD_PaymentStatus,
    ORD_DeliveryNotes, ORD_CreatedBy
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    order.ORD_CUS_CustomerID,
    order.ORD_PhoneNumber,
    order.ORD_ShortDescription,
    order.ORD_AdminComments,
    order.ORD_OrderStatus,
    order.ORD_OrderAmount,
    order.ORD_Discount,
    order.ORD_Total,
    order.ORD_DeliveryStatus,
    order.ORD_PaymentStatus,
    order.ORD_DeliveryNotes,
    order.ORD_CreatedBy
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
  });
});

// List Customer Order List
app.get('/orders/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const sql = `SELECT * FROM tbl_order_info WHERE ORD_CUS_CustomerID = ? ORDER BY ORD_CreatedAt DESC`;
  db.query(sql, [customerId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Update Existing Order
app.put('/orders/:id', (req, res) => {
  const id = req.params.id;
  const order = req.body;
  const sql = `UPDATE tbl_order_info SET
    ORD_CUS_CustomerID = ?, ORD_PhoneNumber = ?, ORD_ShortDescription = ?, ORD_AdminComments = ?,
    ORD_OrderStatus = ?, ORD_OrderAmount = ?, ORD_Discount = ?, ORD_Total = ?,
    ORD_DeliveryStatus = ?, ORD_PaymentStatus = ?, ORD_DeliveryNotes = ?, ORD_LastModifiedBy = ?
    WHERE ORD_OrderID = ?`;

  const values = [
    order.ORD_CUS_CustomerID,
    order.ORD_PhoneNumber,
    order.ORD_ShortDescription,
    order.ORD_AdminComments,
    order.ORD_OrderStatus,
    order.ORD_OrderAmount,
    order.ORD_Discount,
    order.ORD_Total,
    order.ORD_DeliveryStatus,
    order.ORD_PaymentStatus,
    order.ORD_DeliveryNotes,
    order.ORD_LastModifiedBy,
    id
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Order updated successfully' });
  });
});

app.put('/orders/payment/:id', (req, res) => {
  const id = req.params.id;
  const order = req.body;

  const sql = `
    UPDATE tbl_order_info SET
      ORD_OrderAmount = ?,
      ORD_Discount = ?,
      ORD_Total = ?,
      ORD_LastModifiedBy = ?
    WHERE ORD_OrderID = ?
  `;

  const values = [
    order.ORD_OrderAmount,
    order.ORD_Discount,
    order.ORD_Total,
    order.ORD_LastModifiedBy,
    id
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Order totals updated successfully' });
  });
});


// List products List
app.get('/products', (req, res) => {
  db.query('SELECT * FROM tbl_products WHERE PRD_Status = "Active"', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add Order Payment
app.post('/order-payments', (req, res) => {
  const {
    ORP_ORD_OrderID,
    ORP_PaymentDate,
    ORP_PaymentAmount,
    ORP_PaymentMode,
    ORP_ReferenceNumber,
    ORP_Remarks,
    ORP_CreatedBy
  } = req.body;

  const sql = `INSERT INTO tbl_order_payments (ORP_ORD_OrderID, ORP_PaymentDate, ORP_PaymentAmount, ORP_PaymentMode, ORP_ReferenceNumber, ORP_Remarks, ORP_CreatedBy)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [ORP_ORD_OrderID, ORP_PaymentDate, ORP_PaymentAmount, ORP_PaymentMode, ORP_ReferenceNumber, ORP_Remarks, ORP_CreatedBy];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Payment recorded successfully', paymentId: result.insertId });
  });
});

// List Payments for an Order
app.get('/order-payments/order/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  db.query('SELECT * FROM tbl_order_payments WHERE ORP_ORD_OrderID = ?', [orderId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.get('/orders/:id/details', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM tbl_order_info WHERE ORD_OrderID = ?', [id], (err, orderResult) => {
    if (err) return res.status(500).send(err);
    if (orderResult.length === 0) return res.status(404).json({ message: 'Order not found' });

    const order = orderResult[0];

    db.query('SELECT * FROM tbl_customer_info WHERE CUS_CustomerID = ?', [order.ORD_CUS_CustomerID], (err, customerResult) => {
      if (err) return res.status(500).send(err);

      db.query('SELECT * FROM tbl_order_items WHERE OIT_ORD_OrderID = ?', [id], (err, itemResults) => {
        if (err) return res.status(500).send(err);

        db.query('SELECT * FROM tbl_order_payments WHERE ORP_ORD_OrderID = ?', [id], (err, paymentResults) => {
          if (err) return res.status(500).send(err);

          res.json({
            order,
            customer: customerResult[0] || null,
            items: itemResults,
            payments: paymentResults
          });
        });
      });
    });
  });
});


// ✅ Root route for render homepage
app.get('/', (req, res) => {
  res.send('✅ Uyirveli Backend API is Live!');
});

// 🔊 Start server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

