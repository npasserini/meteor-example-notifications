jsrsasign = Meteor.npmRequire('jsrsasign');

Meteor.methods({
  getLayerIdentityToken(nonce) {
    const layerKeyID = 'layer:///keys/72238120-c9ef-11e5-b013-c41ce00f3df8',
      layerProviderID = 'layer:///providers/55291a64-c9ca-11e5-ac55-80e4720f6b18',
      privateKey = Assets.getText('layer-key.pem').toString()

    var header = JSON.stringify({
      typ: 'JWT',           // Expresses a MIMEType of application/JWT
      alg: 'RS256',         // Expresses the type of algorithm used to sign the token, must be RS256
      cty: 'layer-eit;v=1', // Express a Content Type of application/layer-eit;v=1
      kid: layerKeyID
    });

    var currentTimeInSeconds = Math.round(new Date() / 1000);
    var expirationTime = currentTimeInSeconds + 10000;

    var claim = JSON.stringify({
      iss: layerProviderID,       // The Layer Provider ID
      prn: Meteor.userId(),                // User Identifier
      iat: currentTimeInSeconds,  // Integer Time of Token Issuance
      exp: expirationTime,        // Integer Arbitrary time of Token Expiration
      nce: nonce                  // Nonce obtained from the Layer Client SDK
    });

    return jsrsasign.jws.JWS.sign('RS256', header, claim, privateKey);
  }
})
