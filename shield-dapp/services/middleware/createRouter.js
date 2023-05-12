import nextConnect from 'next-connect'
import dbConnect from './dbConnect';

//set beforeRequest
export default ()=>nextConnect().use(dbConnect);
