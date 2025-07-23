// vendorRfqRoute.js
const express = require('express');
const axios = require('axios');
const https = require('https');
const xml2js = require('xml2js');

const router = express.Router();

const SAP_BASE_URL = 'http://AZKTLDS5CP.kcloud.com:8000';
const SERVICE_PATH = '/sap/opu/odata/SAP/ZVP_VENDOR_SRV/';
const ENTITY_SET = 'ZVENDOR_RFQSet';
const SAP_CREDS = { username: 'K901564', password: '06-Aug-030' };

const sapAgent = new https.Agent({ rejectUnauthorized: false });

router.get('/:vendorId', async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    const url = `${SAP_BASE_URL}${SERVICE_PATH}${ENTITY_SET}?$filter=Lifnr eq '${vendorId}'`;

    const response = await axios.get(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${SAP_CREDS.username}:${SAP_CREDS.password}`).toString('base64'),
        Accept: 'application/xml',
      },
      httpsAgent: sapAgent,
    });

    xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'XML parsing failed' });

      const entries = result.feed.entry;

      const rfqList = Array.isArray(entries) ? entries : [entries];

      const formatted = rfqList.map(entry => {
        const props = entry.content['m:properties'];
        return {
          Lifnr: props['d:Lifnr'],
          Ebeln: props['d:Ebeln'],
          Aedat: props['d:Aedat'],
          Bedat: props['d:Bedat'],
          Ekorg: props['d:Ekorg'],
          Matnr: props['d:Matnr'],
          Ktmng: props['d:Ktmng'],
          Netpr: props['d:Netpr'],
          Statu: props['d:Statu'],
          Txz01: props['d:Txz01'],
          Bstyp: props['d:Bstyp'],
        };
      });

      res.status(200).json({ success: true, data: formatted });
    });
  } catch (error) {
    console.error('🔴 RFQ Fetch Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch RFQ', error: error.message });
  }
});

module.exports = router;

