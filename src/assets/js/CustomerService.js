// Simple Node.js + Express + MySQL service for tbl_customer_info

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gopal200!',
  database: 'uyirveli_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Create new customer
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

// Get all customers
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM tbl_customer_info WHERE CUS_Status != "Deleted"', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get customer by ID
app.get('/customers/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM tbl_customer_info WHERE CUS_CustomerID = ? AND CUS_Status != "Deleted"', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ message: 'Customer not found' });
    res.json(result[0]);
  });
});

// Update customer
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

// Search customer by Phone Number
app.get('/customers/search/:phone', (req, res) => {
  const phone = req.params.phone;

  const sql = `SELECT * FROM tbl_customer_info 
               WHERE CUS_PhoneNumber = ? 
               AND CUS_Status != 'Deleted'`;

  db.query(sql, [phone], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send({ message: 'Customer not found' });
    res.json(results);
  });
});


// ===================== Work Activities Services =====================

app.post('/activities', (req, res) => {
  const { ACT_ActivityDate, ACT_WorkCategory, ACT_Description, ACT_NumberOfMembers, ACT_ProductionInfo, ACT_CreatedBy } = req.body;
  const sql = `INSERT INTO tbl_work_activities (ACT_ActivityDate, ACT_WorkCategory, ACT_Description, ACT_NumberOfMembers, ACT_ProductionInfo, ACT_CreatedBy) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [ACT_ActivityDate, ACT_WorkCategory, ACT_Description, ACT_NumberOfMembers, ACT_ProductionInfo, ACT_CreatedBy];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, message: 'Activity created successfully' });
  });
});

app.get('/activities', (req, res) => {
  db.query('SELECT * FROM tbl_work_activities', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/activities/:id/details', (req, res) => {
  const activityId = req.params.id;

  const activitySql = `SELECT * FROM tbl_work_activities WHERE ACT_ActivityId = ?`;
  const membersSql = `SELECT * FROM tbl_activity_members WHERE AMM_ActivityId = ?`;

  db.query(activitySql, [activityId], (err, activityResults) => {
    if (err) return res.status(500).send(err);
    if (activityResults.length === 0) return res.status(404).send({ message: 'Activity not found' });

    db.query(membersSql, [activityId], (err, memberResults) => {
      if (err) return res.status(500).send(err);

      const response = {
        activity: activityResults[0],
        members: memberResults
      };

      res.json(response);
    });
  });
});

// ===================== Activity Members Services =====================

app.post('/activity-members', (req, res) => {
  const { AMM_ActivityId, AMM_MemberId, AMM_WorkingHours, AMM_CreatedBy } = req.body;
  const sql = `INSERT INTO tbl_activity_members (AMM_ActivityId, AMM_MemberId, AMM_WorkingHours, AMM_CreatedBy) VALUES (?, ?, ?, ?)`;
  const values = [AMM_ActivityId, AMM_MemberId, AMM_WorkingHours, AMM_CreatedBy];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, message: 'Activity member added successfully' });
  });
});

app.get('/activity-members/:activityId', (req, res) => {
  const activityId = req.params.activityId;
  db.query('SELECT * FROM tbl_activity_members WHERE AMM_ActivityId = ?', [activityId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ===================== Members Services =====================

app.post('/members', (req, res) => {
  const { MEM_FullName, MEM_MobileNumber, MEM_CreatedBy } = req.body;
  const sql = `INSERT INTO tbl_members (MEM_FullName, MEM_MobileNumber, MEM_CreatedBy) VALUES (?, ?, ?)`;
  const values = [MEM_FullName, MEM_MobileNumber, MEM_CreatedBy];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, message: 'Member created successfully' });
  });
});

app.get('/members', (req, res) => {
  db.query('SELECT * FROM tbl_members', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


/*
 1. Add Task
Method: POST
URL: http://localhost:3000/tasks
Body (raw → JSON):

json
Copy
Edit
{
  "TSK_TaskName": "Fertilizer Distribution",
  "TSK_TaskDescription": "Distribute organic fertilizer to all members",
  "TSK_AssignedToMemberId": 2,
  "TSK_TaskStatus": "Pending",
  "TSK_ExpectedCompletionDate": "2025-07-20",
  "TSK_ActualCompletionDate": null,
  "TSK_CreatedBy": 1
}
✅ 2. Update Task
Method: PUT
URL: http://localhost:3000/tasks/1
Body (raw → JSON):

json
Copy
Edit
{
  "TSK_TaskName": "Fertilizer Distribution - Updated",
  "TSK_TaskDescription": "Updated task with new instructions",
  "TSK_AssignedToMemberId": 2,
  "TSK_TaskStatus": "In Progress",
  "TSK_ExpectedCompletionDate": "2025-07-25",
  "TSK_ActualCompletionDate": null
}
✅ 3. Delete Task
Method: DELETE
URL: http://localhost:3000/tasks/1

✅ 4. Get Task by ID
Method: GET
URL: http://localhost:3000/tasks/1

✅ 5. Get Tasks by Status
Method: GET
URL: http://localhost:3000/tasks/status/Pending
*/



// Add Task
app.post('/tasks', (req, res) => {
  const {
    TSK_TaskName,
    TSK_TaskDescription,
    TSK_AssignedToMemberId,
    TSK_TaskStatus,
    TSK_ExpectedCompletionDate,
    TSK_ActualCompletionDate,
    TSK_CreatedBy
  } = req.body;

  const sql = `INSERT INTO tbl_tasks (TSK_TaskName, TSK_TaskDescription, TSK_AssignedToMemberId, TSK_TaskStatus, TSK_ExpectedCompletionDate, TSK_ActualCompletionDate, TSK_CreatedBy)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [TSK_TaskName, TSK_TaskDescription, TSK_AssignedToMemberId, TSK_TaskStatus, TSK_ExpectedCompletionDate, TSK_ActualCompletionDate, TSK_CreatedBy];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
  });
});

// Update Task
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const {
    TSK_TaskName,
    TSK_TaskDescription,
    TSK_AssignedToMemberId,
    TSK_TaskStatus,
    TSK_ExpectedCompletionDate,
    TSK_ActualCompletionDate
  } = req.body;

  const sql = `UPDATE tbl_tasks SET TSK_TaskName = ?, TSK_TaskDescription = ?, TSK_AssignedToMemberId = ?, TSK_TaskStatus = ?, TSK_ExpectedCompletionDate = ?, TSK_ActualCompletionDate = ?
               WHERE TSK_TaskId = ?`;
  const values = [TSK_TaskName, TSK_TaskDescription, TSK_AssignedToMemberId, TSK_TaskStatus, TSK_ExpectedCompletionDate, TSK_ActualCompletionDate, id];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Task not found' });
    res.json({ message: 'Task updated successfully' });
  });
});

// Delete Task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tbl_tasks WHERE TSK_TaskId = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  });
});

// Get Task by ID
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM tbl_tasks WHERE TSK_TaskId = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send({ message: 'Task not found' });
    res.json(results[0]);
  });
});

// Get Tasks by Status
app.get('/tasks/status/:status', (req, res) => {
  const status = req.params.status;
  db.query('SELECT * FROM tbl_tasks WHERE TSK_TaskStatus = ?', [status], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});



// Add Task Activity
app.post('/task-activities', (req, res) => {
  const {
    TSA_TSK_TaskId,
    TSA_ActionByMemberId,
    TSA_ActivitySummary,
    TSA_Status,
    TSA_CreatedBy
  } = req.body;

  const sql = `INSERT INTO tbl_task_activities (TSA_TSK_TaskId, TSA_ActionByMemberId, TSA_ActivitySummary, TSA_Status, TSA_CreatedBy)
               VALUES (?, ?, ?, ?, ?)`;
  const values = [TSA_TSK_TaskId, TSA_ActionByMemberId, TSA_ActivitySummary, TSA_Status || 'Active', TSA_CreatedBy];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, message: 'Task activity added successfully' });
  });
});

// Delete Task Activity
app.delete('/task-activities/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tbl_task_activities WHERE TSA_ActivityId = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Task activity not found' });
    res.json({ message: 'Task activity deleted successfully' });
  });
});

// List Task Activities by Task ID
app.get('/task-activities/task/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const sql = `SELECT * FROM tbl_task_activities WHERE TSA_TSK_TaskId = ? AND TSA_Status != 'Deleted' ORDER BY TSA_ActivityDate DESC`;
  db.query(sql, [taskId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});



// ===================== Order Info =====================

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

// Delete Order
app.delete('/orders/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tbl_order_info WHERE ORD_OrderID = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Order deleted successfully' });
  });
});

// Get Order by ID
app.get('/orders/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM tbl_order_info WHERE ORD_OrderID = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Order not found' });
    res.json(results[0]);
  });
});

// ===================== Order Details by Order ID (with Items + Payments) =====================

app.get('/orders/:id/details', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM tbl_order_info WHERE ORD_OrderID = ?', [id], (err, orderResult) => {
    if (err) return res.status(500).send(err);
    if (orderResult.length === 0) return res.status(404).json({ message: 'Order not found' });

    const order = orderResult[0];

    db.query('SELECT * FROM tbl_order_items WHERE OIT_ORD_OrderID = ?', [id], (err, itemResults) => {
      if (err) return res.status(500).send(err);

      db.query('SELECT * FROM tbl_order_payments WHERE ORP_ORD_OrderID = ?', [id], (err, paymentResults) => {
        if (err) return res.status(500).send(err);

        res.json({
          order,
          items: itemResults,
          payments: paymentResults
        });
      });
    });
  });
});

// ===================== Order Items (Separate Service) =====================

// Add Item to Existing Order
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

// Update an Order Item
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

// Delete an Order Item
app.delete('/order-items/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tbl_order_items WHERE OIT_OrderItemID = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Order item deleted successfully' });
  });
});

// List Items for an Order
app.get('/order-items/order/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  db.query('SELECT * FROM tbl_order_items WHERE OIT_ORD_OrderID = ?', [orderId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ===================== Order Payments =====================

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


// ===================== Order Details by Order ID (with Items + Payments + Customer Info) =====================

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



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
