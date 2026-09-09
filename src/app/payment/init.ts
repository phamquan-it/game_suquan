import { SePayPgClient } from 'sepay-pg-node';

const isLive = true;
const live = new SePayPgClient({
  env: 'production',
  merchant_id: 'SP-LIVE-S4BA494',
  secret_key: 'spsk_live_hFDzMqv6jcbZUESLKPZMxhfX12jttcaP'
});



const client = isLive? live: new SePayPgClient({
  env: 'sandbox',
  merchant_id: 'SP-TEST-S392693',
  secret_key: 'spsk_test_CCQSuMVMABuvFQpmA5v93EcusLBWmkrF'
});


export default client;
