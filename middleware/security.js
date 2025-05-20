// Add any security middleware needed (CSRF protection, etc.)
module.exports = {
    verifySignature: (req, res, next) => {
        // Implement your signature verification logic here
        next();
    }
};


const crypto = require('crypto');

// Using environment variables for security


/**
 * Main signing function
 * @param {Object} params - Payment parameters
 * @returns {string} - Generated signature
 */
function sign(params) {
    const secretKey = "3845f144e0714fe082640cc1dec7a84cf6959faace874416b130ac479ecdda28764cd6ad1a65484d857d6963230bd74ea9d1351198a949b2945ac89abdee694a24ca53044acc46f6902ce999f3ca411f30e8ca5a72504b2cb3ddff56b9c231d8b8181b4e4e244ebb8a0ee26b817050d8b0ced5dea0a54250991c78f112871718";
    const signedFieldNames = params.signed_field_names.split(',');
    const dataToSign = signedFieldNames.map(field => `${field}=${params[field]}`).join(',');
    
    return crypto.createHmac('sha256', secretKey)
                .update(dataToSign)
                .digest('base64');
}

module.exports = { sign };

/**
 * HMAC-SHA256 signing
 * @param {string} data - Data to sign
 * @param {string} secretKey - Merchant secret key
 * @returns {string} - Base64 encoded signature
 */
function signData(data, secretKey) {
  return crypto
    .createHmac(HMAC_SHA256, secretKey)
    .update(data)
    .digest('base64');
}

/**
 * Prepares the data string for signing
 * @param {Object} params - Payment parameters
 * @returns {string} - Comma-separated key=value pairs
 */
function buildDataToSign(params) {
  if (!params.signed_field_names) {
    throw new Error('Missing signed_field_names in parameters');
  }

  const signedFieldNames = params.signed_field_names.split(',');
  const dataToSign = signedFieldNames.map(field => {
    if (!(field in params)) {
      throw new Error(`Missing required field: ${field}`);
    }
    return `${field}=${params[field]}`;
  });

  return commaSeparate(dataToSign);
}

/**
 * Joins array elements with commas
 * @param {Array} dataToSign - Array of key=value strings
 * @returns {string} - Comma-separated string
 */
function commaSeparate(dataToSign) {
  return dataToSign.join(',');
}

module.exports = {
  sign,
  signData,
  buildDataToSign,
  commaSeparate
};