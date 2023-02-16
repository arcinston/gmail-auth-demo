const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID =
  '579347907843-bb3htr50m5rm4iagn8b0q9tldeardbbi.apps.googleusercontent.com';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  console.log({ ticket });
  const payload = ticket.getPayload();
  console.log({ ticket });
  const userid = payload['sub'];
  console.log({ userid });
  // If request specified a G Suite domain:
  const domain = payload['hd'];
  console.log({ domain });
}
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.use(bodyParser.urlencoded());

app.get('/login', (req, res) => {
  const { client_id, redirect_uri, response_type, state, scope } = req.query;
  console.log({ q_params: req.query });
  res.render('pages/login', {
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: redirect_uri,
    state,
    responseType: response_type,
  });
});

app.post('/token', (req, res) => {
  const credential = req.body.code;
  const result = {};
  console.log({ req_body: req.body });

  // verify(credential);
  // const {code ,grant_type, redirect_uri, client_id, client_secret} = req.body;

  if (!credential || credential.length <= 0) {
    result.error = 'no valid code!';
  } else {
    result.expires_in = 2592000;
  }

  res.status(200).send(JSON.stringify(result));
});

app.listen(port, () => console.log(`Listing on port: ${port}!`));
