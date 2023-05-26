import {compose, indexMutate, selectReads} from './transform';

const _auctions = [
    "creator",
    "reserve",
    "startTime",
    "diffTime",
    "scheduled",
    "total",
    "topBidder",
    "price"
];

const _sale = [
    "seller",
    "currency",
    "amount",
    "deadline",
];

const formatStruct = keyParams=>_list=>_list && _list.reduce((acc, data, i)=>({...acc, [keyParams[i]]:data}),{});
const createStruct = indexMutate;

export const auctionStruct = formatStruct(_auctions);
export const saleStruct = formatStruct(_sale);

export const selectReadWithAuction =  (index)=>compose(createAuctionStruct(index), selectReads);

export const createSaleStruct = index=>createStruct(saleStruct, index)

export const createAuctionStruct = index=>createStruct(auctionStruct, index)






