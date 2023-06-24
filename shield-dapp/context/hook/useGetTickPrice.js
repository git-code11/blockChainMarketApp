import { useSwapTickerPrice } from '../swap/hooks/binanceTicker';
import { constants } from 'ethers';

export default ({currency, amount})=>{
    //console.log({currency})
    const _currency = currency &&
        ({
            symbol:currency?.symbol,
            chainId:currency?.chainId ?? 56,
            isNative:!Boolean(currency.address && currency.address !== constants.AddressZero)
    })
    
    const tickPrice = useSwapTickerPrice({
        currency:_currency
    });

    amount = Number(amount);
    return tickPrice && amount && (tickPrice * amount);
}
