import {SWRConfig} from 'swr';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();

const baseURL = process.env.NEXT_PUBLIC_WEB_SERVER;

// const client = wrapper(axios.create({
//     baseURL,
//     jar
//     //withCredentials:true
// }));

const client = axios.create({
    baseURL,
    withCredentials:true
});

export {client};
export default ({children})=><SWRConfig>{children}</SWRConfig>;