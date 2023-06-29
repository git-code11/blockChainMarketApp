import { formatBytes32String } from "ethers/lib/utils.js";


const names = [
    "Art", "eCoupon", "eReciept", "eContract"
];

const _list = names.reduce((acc, name)=>{
    acc[name] = formatBytes32String(name.toLowerCase());
    return acc;
},{});

export default _list;