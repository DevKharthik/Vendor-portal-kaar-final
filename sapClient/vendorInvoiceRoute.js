// vendorPoRoute.js (for vendor-specific PO fetching)
const express = require('express');
const axios = require('axios');
const https = require('https');

const router = express.Router();

// ✅ SAP Configuration
const SAP_BASE_URL = 'http://AZKTLDS5CP.kcloud.com:8000';
const SERVICE_PATH = '/sap/opu/odata/SAP/ZVP_VENDOR_SRV';
const ENTITY_SET = 'ZVENDOR_INVOICESet';
const SAP_CREDS = {
  username: 'K901564',
  password: '06-Aug-030',
};

// Create HTTPS agent to ignore certificate issues (only for dev)
const sapAgent = new https.Agent({ rejectUnauthorized: false });

// 📘 GET vendor-specific PO data
router.get('/:vendorId', async (req, res) => {
  const vendorId = req.params.vendorId;
  console.log('📥 Fetching invoice data for Vendor ID:', vendorId);

  if (!vendorId) {
    return res.status(400).json({ success: false, message: 'Vendor ID is required.' });
  }

  try {
    const url = `${SAP_BASE_URL}${SERVICE_PATH}/${ENTITY_SET}?$filter=Lifnr eq '${vendorId}'`;

    const response = await axios.get(url, {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${SAP_CREDS.username}:${SAP_CREDS.password}`).toString('base64'),
        Accept: 'application/json',
      },
      httpsAgent: sapAgent,
    });

    const invoiceEntries = response.data?.d?.results;

    if (!invoiceEntries || invoiceEntries.length === 0) {
      return res.status(404).json({ success: false, message: 'No PO data found for this vendor.' });
    }

    const invoiceList = invoiceEntries.map((entry) => ({
        Belnr: entry.Belnr,       // Document Number: "5105600751"
        Budat: entry.Budat,       // Posting Date: "2025-06-03T00:00:00"
        Gjahr: entry.Gjahr,       // Fiscal Year: "2025"
        Waers: entry.Waers,       // Currency: "INR"
        Wrbtr: entry.Wrbtr,       // Amount: "580.000"
        Lifnr: entry.Lifnr,       // Vendor Code: "100000"
        Matnr: entry.Matnr,       // Material Number: "13"
        Txz01: entry.Txz01,       // Material Description: "Wood"
        Name1: entry.Name1  
    }));


    return res.json({ success: true, data: invoiceList });
  } catch (error) {
    console.error('❌ SAP PO Fetch Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch vendor PO data',
      error: error.message,
      sapError: error.response?.data,
    });
  }
});

module.exports = router;
