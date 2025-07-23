const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const https = require('https');

const router = express.Router();

const sapUsername = 'K901564';
const sapPassword = '06-Aug-030';
const baseURL = 'http://AZKTLDS5CP.kcloud.com:8000';
const servicePath = '/sap/opu/odata/SAP/ZVP_VENDOR_SRV/ZPDF_VPSet';

const agent = new https.Agent({ rejectUnauthorized: false });

router.get('/:belnr', async (req, res) => {
  const { belnr } = req.params;
  console.log('Requested BELNR:', belnr); // Log the requested belnr
  const url = `${baseURL}${servicePath}('${belnr}')`;

  try {
    const response = await axios.get(url, {
      httpsAgent: agent,
      auth: {
        username: sapUsername,
        password: sapPassword,
      },
      headers: {
        'Accept': 'application/xml',
      },
    });

    const xmlData = response.data;

    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'XML Parse Error', error: err });
      }

      try {
        const pdfBase64 = result['entry']['content']['m:properties']['d:Pdfdata'];
        console.log('PDF Base64 length:', pdfBase64 ? pdfBase64.length : 'No PDF data'); // Log PDF length
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=Invoice_${belnr}.pdf`,
          'Content-Length': pdfBuffer.length,
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        });

        return res.send(pdfBuffer);
      } catch (extractError) {
        return res.status(500).json({
          message: 'Failed to extract PDF data',
          error: extractError,
          raw: result,
        });
      }
    });
  } catch (error) {
    console.error('SAP PDF Fetch Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: 'SAP PDF Fetch Failed',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
