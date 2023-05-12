import { SessionProvider } from "next-auth/react"

export default({session, children})=>{
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}