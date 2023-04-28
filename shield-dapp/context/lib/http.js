import axios from 'axios';
// import { wrapper } from 'axios-cookiejar-support';
// import { CookieJar } from 'tough-cookie';
import { getCacheToken } from './token';
//const jar = new CookieJar();

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

const getClient = ()=>{
    const token = getCacheToken();
    return axios.create({
        baseURL,
        headers:{
            Authorization:(token?`Bearer ${token}`:'')
        }
    });
}

export {client, getClient};