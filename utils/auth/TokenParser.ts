import { TokenClaims } from "../../types/Claims";
import { TokenValidationError } from "../../types/Errors";

class TokenParser {
    private static ParseToken(token: string): TokenClaims {
        let components = token.split(".");
        let claims: TokenClaims;
        claims = {
            ...JSON.parse(Buffer.from(components[1], "base64").toString()),
            ...JSON.parse(Buffer.from(components[0], "base64").toString()),
        };
        return claims;
    }

    public static ValidateToken(token: string): TokenClaims {
        let claims = TokenParser.ParseToken(token);

        let currentTime = Math.floor(Date.now() / 1000);

        if (
            claims.nbf != null &&
            claims.nbf != undefined &&
            claims.nbf < currentTime
        )
            return claims;
        else throw new TokenValidationError();
    }
}

export default TokenParser;
