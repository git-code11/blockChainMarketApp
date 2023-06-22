import { constants } from 'ethers';
import useERC20Token from './app/erc20/useERC20Token';

export default (address=constants.AddressZero)=>{
    return useERC20Token({address});
}