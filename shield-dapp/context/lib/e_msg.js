
export default _err=>_err?.reason?.match(/.*'(.*)'.*/)?.[1]||_err?.reason||_err?.message||_err;