// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const xml2js = require('xml2js');
const https = require('https');
const rfqRoute = require('./vendorRfqRoute');
const vendorPoRoute = require('./vendorPoRoute');
const vendorLoginRoute = require('./vendorLoginRoute');
const vendorProfileRoute = require('./vendorProfileRoute');
const vendorGrRoute = require('./vendorGsRoute');
const vendorInvoiceRoute=require('./vendorInvoiceRoute');
const vendorMemoRoute=require('./vendorMemoRoute');
const vendorAgingRoute=require('./vendorAgingRoute');
const vendorInvoicePdf=require('./vendor-invoice-pdf')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Route mounting
app.use('/api/vendor/login', vendorLoginRoute);  // if you move login to route file
app.use('/api/vendor/profile', vendorProfileRoute);
app.use('/api/vendor/rfq', rfqRoute);
app.use('/api/vendor/po', vendorPoRoute );
app.use('/api/vendor/gr', vendorGrRoute );
app.use('/api/vendor/invoice',vendorInvoiceRoute);
app.use('/api/vendor/memo',vendorMemoRoute);
app.use('/api/vendor/aging',vendorAgingRoute);
app.use('/api/vendor/invoice-pdf',vendorInvoicePdf);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
