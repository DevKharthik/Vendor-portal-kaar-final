// vendorProfileRoute.js
const express = require('express');
const axios = require('axios');
const https = require('https');

const router = express.Router();

// ✅ SAP Configuration
const SAP_BASE_URL = 'http://AZKTLDS5CP.kcloud.com:8000';
const PROFILE_URL = '/sap/opu/odata/SAP/ZVP_VENDOR_SRV'; // Your service name
const ENTITY_SET = 'ZVENDOR_PROFILESet'; // Your profile entity set
const SAP_CREDS = {
  username: 'K901564',
  password: '06-Aug-030',
};

// Create HTTPS agent to ignore certificate issues (only for dev)
const sapAgent = new https.Agent({ rejectUnauthorized: false });

// 📘 GET vendor profile info
router.get('/:vendorId', async (req, res) => {
    const vendorId = req.params.vendorId;
  console.log('📥 Fetching vendor profile for:', vendorId);

  if (!vendorId) {
    return res.status(400).json({ success: false, message: 'Vendor ID is required.' });
  }

  try {
    const url = `${SAP_BASE_URL}${PROFILE_URL}/${ENTITY_SET}('${vendorId}')?$format=json`;

    const response = await axios.get(url, {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${SAP_CREDS.username}:${SAP_CREDS.password}`).toString('base64'),
        Accept: 'application/json',
      },
      httpsAgent: sapAgent,
    });

    const data = response.data?.d;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const profile = {
      Lifnr: data.Lifnr,
      Name1: data.Name1,
      Land1: data.Land1,
      Ort01: data.Ort01,
      Stras: data.Stras,
      Pstlz: data.Pstlz,
    };

    return res.json({ success: true, data: profile });
  } catch (error) {
    console.error('❌ SAP Profile Fetch Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch vendor profile',
      error: error.message,
      sapError: error.response?.data,
    });
  }
});

module.exports = router;
