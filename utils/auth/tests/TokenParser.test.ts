import TokenParser from "../TokenParser";

describe("TokenParserTests", () => {
    it("should parse token claims", () => {
        let data = {
            exp: 1647285769,
            family_name: "A",
            alg: "RS256",
            kid: "5966c27282be2abd5a8f6e751ec582e3",
            typ: "JWT",
            full_name: "Phani A",
            given_name: "Phani",
            hearing_id: [],
            iat: 1647282169,
            iss: "authService",
            nbf: 1647282169,
            session_id: [],
            user_email: "phani29588@gmail.com",
            user_id: "74dedaaa-b965-421c-a31c-97793ba7f398",
        };
        let token =
            "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5NjZjMjcyODJiZTJhYmQ1YThmNmU3NTFlYzU4MmUzIiwidHlwIjoiSldUIn0.eyJleHAiOjE2NDcyODU3NjksImZhbWlseV9uYW1lIjoiQSIsImZ1bGxfbmFtZSI6IlBoYW5pIEEiLCJnaXZlbl9uYW1lIjoiUGhhbmkiLCJoZWFyaW5nX2lkIjpbXSwiaWF0IjoxNjQ3MjgyMTY5LCJpc3MiOiJhdXRoU2VydmljZSIsIm5iZiI6MTY0NzI4MjE2OSwic2Vzc2lvbl9pZCI6W10sInVzZXJfZW1haWwiOiJwaGFuaTI5NTg4QGdtYWlsLmNvbSIsInVzZXJfaWQiOiI3NGRlZGFhYS1iOTY1LTQyMWMtYTMxYy05Nzc5M2JhN2YzOTgifQ.x2S4vHddBpMg4gFyQ0XQsadUFH-OjmBuEQF8odGrj75n6a_JIx_YOca-vLTZsHLoG4xeHKqM_G2IKSlPS__HSQ38v0QPmyNhO_Z7LBvp7vU0ATK_BDEQhDVDxoDH-J1rjRGp8nWSjCEw0nxvimQLcacFt4yX1upOv33ul6rqi4oniJ8KiAajkUl6e-8f8RWvBhPOJDg1YqRYpXfjIa5Rod2k10HlmiQ_-KumLlPgZCVPnlouVYXoctyVIMpjNPZQH8CyxSOFTX2qMt9aPa3DbvKweXHIJZEt9MrcGperRNc_lW0OPng5ji-UPiOJannAZxJkUTKDVrAhPXSfe6uVZTys35vZmpjCzFlau31v95W1ZvspySktmolKWXOdwlBpCmIJD2nvOTICOPfjwN08R3qJ2JOA3g0Q1QQLUNY8bUAr3NImiLz5qLW7NpzjrN3t-Nc5GZiLm_GIzVDY33rJR0jq8wVGr8yDejgIXqVqfRGwqIHEblXSozXv97OFBzJP";
        let parsedClaim = TokenParser.ValidateToken(token);

        expect(parsedClaim).toStrictEqual(data);
    });
});
