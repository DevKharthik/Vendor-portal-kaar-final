
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const https = require('https');

const router = express.Router();

const sapUser = 'K901564';
const sapPass = '06-Aug-030';
const baseUrl = 'http://AZKTLDS5CP.kcloud.com:8000';
const servicePath = '/sap/opu/odata/SAP/ZVP_VENDOR_SRV/';
const entitySet = 'ZVENDOR_PORTALSet';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

router.post('/', async (req, res) => {
  const { VENDOR_ID, PASSWORD } = req.body;
  console.log('Received payload:', req.body);

  if (!VENDOR_ID || !PASSWORD) {
    return res.status(400).json({ success: false, MESSAGE: 'Missing vendor_id or password' });
  }

  try {
    const tokenResponse = await axios.get(`${baseUrl}${servicePath}`, {
      auth: { username: sapUser, password: sapPass },
      headers: { 'X-CSRF-Token': 'Fetch', Accept: 'application/xml' },
      httpsAgent,
    });

    const csrfToken = tokenResponse.headers['x-csrf-token'];
    const cookies = tokenResponse.headers['set-cookie'];

    const response = await axios.post(
      `${baseUrl}${servicePath}${entitySet}`,
      { VENDOR_ID, PASSWORD },
      {
        auth: { username: sapUser, password: sapPass },
        headers: {
          'X-CSRF-Token': csrfToken,
          Cookie: cookies.join(';'),
          'Content-Type': 'application/json',
          Accept: 'application/xml',
        },
        httpsAgent,
      }
    );

    const xml = response.data;

    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, MESSAGE: 'Failed to parse SAP response' });
      }

      try {
        const props = result?.entry?.content?.['m:properties'];
        const MESSAGE = props?.['d:MESSAGE'];
        const VENDOR_ID = props?.['d:vendor_id'];

        return res.status(200).json({ success: true, MESSAGE, vendor_id: VENDOR_ID });
      } catch (parseErr) {
        return res.status(500).json({ success: false, MESSAGE: 'Unexpected SAP response format' });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      MESSAGE: 'SAP login request failed',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
