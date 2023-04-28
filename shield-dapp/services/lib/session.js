import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOption = {
    cookieName: "myapp_cookiename",
    password: process.env.SESSION_SECRET_KEY,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: false//process.env.NODE_ENV === "production",
    },
}

const withSessionApi = (_route)=>withIronSessionApiRoute(_route, sessionOption);
const withSessionSsr = (_route)=>withIronSessionSsr(_route, sessionOption);

export {withSessionApi, withSessionSsr}