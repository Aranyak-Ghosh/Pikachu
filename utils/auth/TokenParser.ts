import { TokenClaims } from "../../types/Claims";
import { TokenValidationError } from "../../types/Errors";

class TokenParser {
    private static ParseToken(token: string): TokenClaims {
        let parts = token.split(".");
        if (parts.length !== 3) throw new TokenValidationError();
        let claims: TokenClaims;
        claims = {
            ...JSON.parse(Buffer.from(parts[0], "base64").toString()),
            ...JSON.parse(Buffer.from(parts[1], "base64").toString()),
        };
        return claims;
    }

    // private static ParseKey(publicKey: string) {
    //     // let key = Buffer.from(publicKey,'base64')

    //     // let length  = key.readUInt32BE()
    //     // const format = key.subarray(4, 4 + length)				// ...and get format identifier...
    //     // 	.toString('ascii');

    //     let cert = new X509Certificate(publicKey);
    //     console.log("Parsed certificate", cert);
    // }

    private static ValidateSignature(
        token: string,
        claims: TokenClaims
    ): boolean {
        //TODO: Implement signature verification
        console.log(token, claims);
        return true;
    }

    public static ValidateToken(token: string): TokenClaims {
        let claims = TokenParser.ParseToken(token);
        let validSignature = TokenParser.ValidateSignature(token, claims);
        let currentTime = Math.floor(Date.now() / 1000);

        if (
            validSignature &&
            claims.nbf != null &&
            claims.nbf != undefined &&
            claims.nbf <= currentTime &&
            claims.exp != null &&
            claims.exp != undefined &&
            claims.exp > currentTime
        )
            return claims;
        else throw new TokenValidationError();
    }
}

export default TokenParser;
