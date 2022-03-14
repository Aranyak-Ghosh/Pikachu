import TokenParser from "../tokenParser";

describe("TokenParserTests", () => {
    it("should parse token claims", () => {
        let data = {
            exp: 1647278087,
            family_name: "A",
            alg: "RS256",
            kid: "5966c27282be2abd5a8f6e751ec582e3",
            typ: "JWT",
            full_name: "Phani A",
            given_name: "Phani",
            hearing_id: [],
            iat: 1647274487,
            iss: "authService",
            nbf: 1647274487,
            session_id: [],
            user_email: "phani29588@gmail.com",
            user_id: "74dedaaa-b965-421c-a31c-97793ba7f398",
        };
        let token =
            "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5NjZjMjcyODJiZTJhYmQ1YThmNmU3NTFlYzU4MmUzIiwidHlwIjoiSldUIn0.eyJleHAiOjE2NDcyNzgwODcsImZhbWlseV9uYW1lIjoiQSIsImZ1bGxfbmFtZSI6IlBoYW5pIEEiLCJnaXZlbl9uYW1lIjoiUGhhbmkiLCJoZWFyaW5nX2lkIjpbXSwiaWF0IjoxNjQ3Mjc0NDg3LCJpc3MiOiJhdXRoU2VydmljZSIsIm5iZiI6MTY0NzI3NDQ4Nywic2Vzc2lvbl9pZCI6W10sInVzZXJfZW1haWwiOiJwaGFuaTI5NTg4QGdtYWlsLmNvbSIsInVzZXJfaWQiOiI3NGRlZGFhYS1iOTY1LTQyMWMtYTMxYy05Nzc5M2JhN2YzOTgifQ.Bz7pY7mc4CxjZA4qGO7O1qtDJ_aiohvxjZNkf3qwHCWIKGADIcGPqU9updy6YewhpVHNvy2kwlMecrx1fdJ8SvYh7Yyeki2vHD1fJD5jvKUhYj5Q-h-x6dV8FuHdeKuuaNhxhp9hg-7XoyctLNT-JZ0J1HrUws4WJD_qlDuIrnO-xPlcanAHMsZV9FA3wsVt3McUswg-QL-3f5Ygh5QrL0Qx2AnWAuedElPlcqvRSBlA56ErFVFiHriDj59wzXn2iX_OVKXlCaf-aSmRel646ZLOogggA0fx11yljdi_t6fERvn6z4Mu4puq2sW1_sJQgsZqa0tfy2eacs6xpAyqr_SIKjPoNcPM6YXYjPMsI3n7DRcGsOExWZkxrzih5Lw5NP14mpjJD_PgVBQ8CNyhD5f28lYj2m-O7kPXEy21PAXmIy3KmC0CEZYatzAIdWEZbE3BgP3mMgJA08fYr3ShtYKFbH1UZlsWiVElSLXVeXVAvW5JB07pbtjAYFhanXGL";
        let parsedClaim = TokenParser.ValidateToken(token);

        expect(parsedClaim).toStrictEqual(data);
    });
});
