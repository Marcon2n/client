import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://idm-dev.nexusti.pro/auth",
    realm: "nexusti",
    clientId: "app-collection",
});

export default keycloak

