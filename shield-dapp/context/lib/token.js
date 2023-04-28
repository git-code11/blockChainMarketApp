
const cache_token_key = process.env.NEXT_CACHE_TOKEN || "app_key_token";

const getCacheToken = ()=>localStorage.getItem(cache_token_key);
const setCacheToken = (data)=>localStorage.setItem(cache_token_key, data);

export {getCacheToken, setCacheToken}