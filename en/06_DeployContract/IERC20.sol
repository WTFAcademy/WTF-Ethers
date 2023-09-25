// SPDX-License-Identifier: MIT
// WTF Solidity by 0xAA

pragma solidity ^0.8.4;

/**
 * @dev ERC20 Interface Contract.
 */
interface IERC20 {
    /**
     * @dev Event: When `value` units of currency are transferred from account (`from`) to another account (`to`).
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Event: When `value` units of currency are approved from account (`owner`) to another account (`spender`).
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the total token supply.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the account balance of `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Transfers `amount` units of tokens from the caller's account to another account `to`.
     *
     * Returns `true` if successful.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the amount of tokens approved by the `owner` account to the `spender` account.
     * Default is 0.
     *
     * The allowance can change when {approve} or {transferFrom} is called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Allows the caller's account to approve `amount` tokens to the `spender` account.
     *
     * Returns `true` if successful.
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Transfers `amount` tokens from the `from` account to the `to` account using the allowance mechanism.
     * The portion of the transfer from the caller's allowance will be deducted.
     *
     * Returns `true` if successful.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}