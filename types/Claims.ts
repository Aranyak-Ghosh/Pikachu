"use strict";

interface TokenClaims {
    alg: string;
    exp: number;
    family_name: string;
    full_name: string;
    given_name: string;
    hearing_id: Array<string>;
    iat: number;
    iss: string;
    kid: string;
    nbf: number;
    session_id: Array<string>;
    typ: string;
    user_email: string;
    user_id: string;
}

export { TokenClaims };
