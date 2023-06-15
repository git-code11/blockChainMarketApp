
// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "hardhat/console.sol";


contract EnTest {

    function decode(bytes memory sig) external view returns(uint256, uint256, uint256) {
        
        console.log("signature length=>", sig.length);

        uint256 a;
        uint256 b;
        uint256 c;

        assembly {
            a := mload( add(sig, mul(32, 1) ) )
            b := mload( add(sig, mul(32, 2) ) )
            c := mload( add(sig, mul(32, 3) ) )
        }

        console.log("a=>", a);
        console.log("b=>", b);
        console.log("c=>", c);
        return (a, b, c);
    }
}