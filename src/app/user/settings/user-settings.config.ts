import * as connection from "../../core/env.js";

function configure(
    $authProvider: any
) {

    $authProvider.httpInterceptor = function() { return true; };
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.baseUrl =  connection.protocol.rest + connection.server; //null;//_connection.server + '/oauth/';
    $authProvider.loginUrl = "/login";
    $authProvider.signupUrl = "/signup";
    $authProvider.unlinkUrl = "/unlink/";
    $authProvider.tokenName = "token";
    $authProvider.tokenPrefix = "staminty";
    $authProvider.tokenHeader = "Authorization";
    $authProvider.tokenType = "Bearer";
    $authProvider.storageType = "localStorage";

    // Facebook
    $authProvider.facebook({
        clientId: "660665060767427",
        url: "/oauth",
        redirectUri: window.location.origin + "/",
        requiredUrlParams: ["scope"],
        scope: ["email"],
        scopeDelimiter: ",",
        display: "popup",
        oauthType: "2.0", //,
        //popupOptions: { width: 580, height: 400 }
    });

    // Google
    $authProvider.google({
        clientId: "641818101376-hn150qbnmkecpd4k5kelme69q7ihcrnj.apps.googleusercontent.com",
        url: "/oauth",
        redirectUri: window.location.origin + "/",
        requiredUrlParams: ["scope"],
        optionalUrlParams: ["display"],
        scope: ["profile", "email"],
        scopePrefix: "openid",
        scopeDelimiter: " ",
        display: "popup",
        oauthType: "2.0", //,
        //popupOptions: { width: 452, height: 633 }
    });

    // VKontakte
    $authProvider.oauth2({
        name: "vkontakte",
        url: "/oauth",
        redirectUri: window.location.origin + "/",
        clientId: "6031874",
        authorizationEndpoint: "https://oauth.vk.com/authorize",
        scope: "friends, email",
        display: "popup",
        responseType: "code",
        requiredUrlParams: ["response_type", "client_id", "redirect_uri", "display", "scope", "v"],
        scopeDelimiter: ",",
        oauthType: "2.0",
        v: "5.37",
    });

    // Generic OAuth 2.0
    $authProvider.oauth2({
        name: "strava",
        url: "/oauth", //'http:/' + _connection.server + '/oauth/',
        clientId: 17981, //17981 - prd,//15712 - test,
        redirectUri: window.location.origin,
        authorizationEndpoint: "https://www.strava.com/oauth/authorize",
        defaultUrlParams: ["client_id", "response_type", "redirect_uri"],
        //requiredUrlParams: ['response_type','client_id'],
        optionalUrlParams: ["approval_prompt", "scope", "state"],
        approvalPrompt: "force",
        scope: "view_private",
        state: "mystate",
        oauthType: "2.0",
        responseType: "code",
        responseParams: {
            code: "code",
            clientId: "clientId",
            redirectUri: "redirectUri",
        },
    });
}

configure.$inject = ["$authProvider"];

export default configure;
