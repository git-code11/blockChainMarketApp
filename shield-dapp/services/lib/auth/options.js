import CredentialsProvider from "next-auth/providers/credentials"
import { validateMessage } from '../../lib/siwes';
//import authAdaptor from '../../lib/auth/adaptor';
import {findOrCreate} from '../../model/User';
import { verifyNonce } from "../nonce";

const providers = [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        message: { label: "message", type: "text", placeholder: "0x0" },
        signature: { label: "signature", type: "text", placeholder: "0x0" },
        sig: { label: "sig", type: "text" }
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const fields = await validateMessage(JSON.parse(credentials.message||"{}"), credentials.signature);
        if(!verifyNonce(fields.nonce, fields.address, credentials.sig))
          return false;
        const user = await findOrCreate(fields.address);
        return {uid:fields.address};
      }
    })
];

const authOptions = {
  // Configure one or more authentication providers
  providers,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token, user}){
        if(user)
            token.sub = user;
        return token;
    },
    async session({ session, token }) {
      session.user.uid = token.sub.uid;
      return session
    },
  },
  //adapter: authAdaptor,
}


export default authOptions;