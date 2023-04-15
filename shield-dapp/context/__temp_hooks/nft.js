import { useContractRead, useContractWrite, usePrepareContractWrite, useContractReads, useAccount} from 'wagmi'

const nftContractAddress = "";
const marketContractAddress = "";


const tokenApproveABI = "";
function useTokenApprove(tokenAddress, to, price){
    const { config } = usePrepareContractWrite({
        address: tokenAddress,
        abi: tokenApproveABI,
        functionName: 'approve',
        args:[to, price]
     });
     
     const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
     return { data, isLoading, isSuccess, write };
}


const mintABI = "";
function useMint(cid){
    const { config } = usePrepareContractWrite({
        address: nftContractAddress,
        abi: mintABI,
        functionName: 'mint',
        args:[cid]
     });
     
     const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
     return { data, isLoading, isSuccess, write };
}

const approveABI = "";
function useApprove(to, itemId){
    const { config } = usePrepareContractWrite({
        address: nftContractAddress,
        abi: mintNftABI,
        functionName: 'approve',
        args:[to, itemId]
     });
     
     const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
     return { data, isLoading, isSuccess, write };
}


const approvedABI = "";
function useApproved(itemId){
    const {data, isError, isLoading} = useContractRead({
        address: nftContractAddress,
        abi: approvedABI,
        functionName:"getApproved",
        args:[itemId]
     });
  
    return {data, isError, isLoading};
}

const sellItemABI = "";
function useSellItem(itemId, price, isBNB){
    const { config } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: sellItemABI,
        functionName: 'sellItem',
        args:[itemId, price, isBNB]
    });
     
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
    return { data, isLoading, isSuccess, write };
}

const toggleForSaleABI = "";
function useToggleForSale(itemId){
    const { config } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: toggleForSaleABI,
        functionName: 'toggleForSale',
        args:[itemId]
    });
     
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
    return { data, isLoading, isSuccess, write };
}

const purchaseItemBNBABI = "";
function usePurchaseItemBNB(itemId, price){
    const { config } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: purchaseItemBNBABI,
        functionName: 'purchaseItemBNB',
        args:[itemId],
        overrides:{
            value:price
        }
    });
     
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
    return { data, isLoading, isSuccess, write };
}

const purchaseItemBUSDABI = "";
function usePurchaseItemBUSD(itemId){
    const { config } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: purchaseItemBNBABI,
        functionName: 'purchaseItemBUSD',
        args:[itemId]
    });
     
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
    return { data, isLoading, isSuccess, write };
}

const productInfoABI = "";
const itemInfoABI = "";
const ownerOfABI = "";

function useitemInfo(itemId){
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: marketContractAddress,
        abi: productInfoABI,
        functionName: 'productInfo',
      },
      {
        address: nftContractAddress,
        abi: itemInfoABI,
        functionName: 'itemInfo',
      },
      {
        address: nftContractAddress,
        abi: ownerOfABI,
        functionName: 'ownerOf',
      },
    ],
    allowFailure:false //Fetch even if one fails
  })
  
    return {data, isError, isLoading};
}

/**
 * Description: List of owned NFT ID
 */
const itemCreatedABI = "";
function useItemCreated(){
    const {data, isError, isLoading} = useContractRead({
        address: nftContractAddress,
        abi: itemCreatedABI,
        functionName:"itemCreated",
     });
  
    return {data, isError, isLoading};
}

/**
 * Description: Provides address of contract owner
 */
 const marketOwnerABI = "";
 function useMarketOwner(){
 
    const {data, isError, isLoading} = useContractRead({
       address: marketContractAddress,
       abi: marketOwnerABI,
       functionName:"owner"
    });
 
    return {data, isError, isLoading};
 }



/**
 * Description: Total Interest Earned BNB
 */
 const totalInterestBNBABI = "";
 function useTotalInterestBNB(){
    const {data, isError, isLoading} = useContractRead({
         address: marketContractAddress,
         abi: totalInterestBNBABI,
         functionName:"totalInterestBNB",
    });
   
     return {data, isError, isLoading};
 }


/**
 * Description: Total Interest Earned BUSD
 */
const totalInterestBUSDABI = "";
function useTotalInterestBUSD(){
    const {data, isError, isLoading} = useContractRead({
         address: marketContractAddress,
         abi: totalInterestBUSDABI,
         functionName:"totalInterestBUSD",
      });
   
    return {data, isError, isLoading};
}

/**
 * Description: Withdraw Earned Interest BNB
 */
const withdrawBNBABI = "";
function usewithdrawBNB(){
    const { config } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: withdrawBNBABI,
        functionName: 'withdrawBNB'
    });
     
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
     
    return { data, isLoading, isSuccess, write };
}

/**
 * Description: Withdraw Earned Interest BUSD
 */
 const withdrawBUSDABI = "";
 function usewithdrawBUSD(){
     const { config } = usePrepareContractWrite({
         address: marketContractAddress,
         abi: withdrawBUSDABI,
         functionName: 'withdrawBUSD'
     });
      
     const { data, isLoading, isSuccess, write } = useContractWrite(config);
      
     return { data, isLoading, isSuccess, write };
}