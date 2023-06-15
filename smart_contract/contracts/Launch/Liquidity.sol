// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;
pragma abicoder v2;

import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '../INonfungiblePositionManager.sol';
import '../TransferHelper.sol';
import '../TickMath.sol';

contract Liquidity is IERC721Receiver {

    uint24 public constant poolFee = 3000;

    INonfungiblePositionManager private nonfungiblePositionManager;
    address managerWeth;

    function setManager(
        address _nonfungiblePositionManager,
        address _managerWeth
    ) internal{
        nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
        managerWeth = _managerWeth;
    }

    // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
    function onERC721Received(
        address,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {

        return this.onERC721Received.selector;
    }

    /// @notice Calls the mint function defined in periphery
    /// @return tokenId The id of the newly minted ERC721
    function addLiquidity(
        address token0_,
        address token1_,
        uint256 amount0_,
        uint256 amount1_
    )
        internal
        returns (
            uint256 tokenId
        )
    {
        // Providing liquidity in both assets means liquidity will be earning fees and is considered in-range.

        // Approve the position manager
        TransferHelper.safeApprove(token0_, address(nonfungiblePositionManager), amount0_);
        TransferHelper.safeApprove(token1_, address(nonfungiblePositionManager), amount1_);

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0_,
                token1: token1_,
                fee: poolFee,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: amount0_,
                amount1Desired: amount1_,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            });

        // Note that the pool defined by DAI/USDC and fee tier 0.3% must already be created and initialized in order to mint
        (tokenId, , , ) = nonfungiblePositionManager.mint(params);
        
        return tokenId;
    }
    
    /// @notice Collects the fees associated with provided liquidity
    /// @dev The contract must hold the erc721 token before it can collect fees
    /// @param tokenId The id of the erc721 token
    /// @return amount0 The amount of fees collected in token0
    /// @return amount1 The amount of fees collected in token1
    function removeLiquidity(uint256 tokenId) internal returns (uint256, uint256){
        // Caller must own the ERC721 position, meaning it must be a deposit
        // set amount0Max and amount1Max to uint256.max to collect all fees
        // alternatively can set recipient to msg.sender and avoid another transaction in `sendToOwner`
        INonfungiblePositionManager.CollectParams memory params =
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        (uint256 amount0, uint256 amount1) = nonfungiblePositionManager.collect(params);

        // send collected feed back to owner
        return (amount0, amount1);
    }

    /// @notice Transfers the NFT to the owner
    /// @param tokenId The id of the erc721
    function transferLp(address owner_, uint256 tokenId) internal {
        // transfer ownership from contract to original owner
        nonfungiblePositionManager.safeTransferFrom(address(this), owner_, tokenId);
    }
}