import NextAuth from "next-auth"
import authOptions from '../lib/auth/options';


//export default NextAuth(authOptions)

export default async (req, res)=>{
 
  const isDefaultSigninPage = req.method === "GET" && req.query.nextauth.includes("signin")

  // Hide Sign-In with Ethereum from default sign page
  // if (isDefaultSigninPage) {
  //   providers.pop()
  // }

  return await NextAuth(req, res, authOptions)
}