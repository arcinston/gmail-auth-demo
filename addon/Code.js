var scopes = [
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.addons.execute',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
];

function getService() {
  return OAuth2.createService('Demo Auth')
    .setAuthorizationBaseUrl('https://f597-104-29-66-25.in.ngrok.io/login')
    .setTokenUrl('https://f597-104-29-66-25.in.ngrok.io/token')
    .setClientId(
      '579347907843-bb3htr50m5rm4iagn8b0q9tldeardbbi.apps.googleusercontent.com'
    )
    .setClientSecret('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')
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setScope(scopes.join(' '));
}

function create3PAuthorizationUi() {
  var service = getService();
  const hasAcc = service.hasAccess();
  console.log('Has access :', hasAcc);
  var authUrl = service.getAuthorizationUrl();
  console.log('Auth url :', authUrl);
  var loginButton = CardService.newTextButton()
    .setText('Login')
    .setAuthorizationAction(
      CardService.newAuthorizationAction().setAuthorizationUrl(authUrl)
    );
  var callbackUri = getService().getRedirectUri();
  Logger.log('Callback uri :', callbackUri);
  console.log('Callback uri :', callbackUri);

  var promptText = 'Please login first';

  var card = CardService.newCardBuilder()
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(promptText))
        .addWidget(loginButton)
    )
    .build();
  return [card];
}

function authCallback(callbackRequest) {
  Logger.log('Run authcallback!');
  console.log('Run authcallback!');
  console.log({ cb: JSON.stringify(callbackRequest) });
  const authorized = getService().handleCallback(callbackRequest);
  console.log(authorized);
  return HtmlService.createHtmlOutput(
    'Success! <script>setTimeout(function() { top.window.close() }, 1)</script>'
  );
}

function checkAuth() {
  var service = getService();
  const hasAcc = service.hasAccess();
  console.log('Has access :', hasAcc);
  if (service.hasAccess()) return;

  CardService.newAuthorizationException()
    .setAuthorizationUrl(service.getAuthorizationUrl())
    .setResourceDisplayName('Display name to show to the user')
    .setCustomUiCallback('create3PAuthorizationUi')
    .throwException();
}

function buildAddOn(e) {
  //   var accessToken = e.messageMetadata.accessToken;
  //   GmailApp.setCurrentMessageAccessToken(accessToken);
  // // log the accesstoken
  //   Logger.log('Accesss token :',accessToken)
  //   console.log('Accesss token :',accessToken)
  checkAuth();
  var section = CardService.newCardSection();

  var textWidget = CardService.newTextParagraph().setText('Hello World');

  section.addWidget(textWidget);

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle('Addon Demo'))
    .addSection(section)
    .build();

  return [card];
}
