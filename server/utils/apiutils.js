const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { ethers } = require('ethers');

async function retryApiCall(apiCall, maxRetries = 5, delayBetweenRetries = 1000) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const result = await apiCall();
            return result; 
        } catch (error) {
            console.error(`API call failed: ${error.message}`);
            retries++;
            if (retries < maxRetries) {
                console.log(`Retrying API call (${retries}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, delayBetweenRetries)); 
            } else {
                console.error('Max retries reached, giving up.');
                throw error; 

            }
        }
    }
return
}

async function accessSecret(secretName) {
    const client = new SecretManagerServiceClient();
  
    try {
      const name = client.secretVersionPath('ethrhub', secretName, 'latest')
      const [version] = await client.accessSecretVersion({ name });
      const payload = version.payload.data.toString('utf8');
      return payload;
    } catch (error) {
      console.error('Error accessing secret:', error);
      throw error;
    }
  }


function verifySignature(message, signature, address) {
    const signerAddress = ethers.utils.verifyMessage(message, signature);
    return signerAddress.toLowerCase() === address.toLowerCase();
  }

  async function checkEnsName(address){
    const INFURA_URI = await retryApiCall(() => accessSecret('INFURA_URI'));
    console.log(INFURA_URI);

  }
  checkEnsName('test')

  module.exports = { retryApiCall, accessSecret, verifySignature }