// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "./TransferHelper.sol";


contract MultiSenderV1 is OwnableUpgradeable {
  using SafeERC20Upgradeable for IERC20Upgradeable;
  using TransferHelper for address;
  uint256 public arrayLimit;
  uint256 public feePerAccount;

  event Sent(address _token, address _sender, uint256 _totalAmount);
  event FeePerAccountChanged(address _operator, uint256 _feePerAccount);
  event ArrayLimitChanged(address _operator, uint256 _arrayLimit);
  event Withdrawn(
    address indexed _operator,
    address indexed _to,
    uint256 _balance
  );

  function initialize(uint256 _arrayLimit, uint256 _feePerAccount)
    public
    initializer
  {
    __Ownable_init();

    arrayLimit = _arrayLimit;
    feePerAccount = _feePerAccount;

    emit ArrayLimitChanged(msg.sender, _arrayLimit);
    emit FeePerAccountChanged(msg.sender, _feePerAccount);
  }

  function withdraw(address _to) external onlyOwner {
    require(_to != address(0), "can't withdraw to zero address");
    uint256 _balance = address(this).balance;
    address(_to).safeTransferETH(_balance);
    emit Withdrawn(msg.sender, _to, _balance);
  }

  function setFeePerAccount(uint256 _feePerAccount) external onlyOwner {
    feePerAccount = _feePerAccount;
    emit FeePerAccountChanged(msg.sender, _feePerAccount);
  }

  function setArrayLimit(uint256 _arrayLimit) external onlyOwner {
    arrayLimit = _arrayLimit;
    emit ArrayLimitChanged(msg.sender, _arrayLimit);
  }

  function multiSend(
    address _token,
    address[] memory _accounts,
    uint256[] memory _amounts
  ) public payable {
    _multiSend(_token,_accounts, _amounts);
  }

  function _multiSend(
    address _token,
    address[] memory _accounts,
    uint256[] memory _amounts
  ) internal {
    _requireEnoughFee(_accounts.length);
    require(
      _accounts.length == _amounts.length,
      "the accounts size and amounts size not equals"
    );
    require(
      _accounts.length <= arrayLimit,
      "array size exceed the array limit"
    );

    if (_token == 0xeFEfeFEfeFeFEFEFEfefeFeFefEfEfEfeFEFEFEf) {
      _multiSendETH(_accounts, _amounts);
    } else {
      _multiSendToken(_token, _accounts, _amounts);
    }
  }

  function _multiSendToken(
    address _token,
    address[] memory _accounts,
    uint256[] memory _amounts
  ) internal {
    uint256 _transferredTokens;
    for (uint256 i = 0; i < _accounts.length; i++) {
      IERC20Upgradeable(_token).safeTransferFrom(msg.sender, _accounts[i], _amounts[i]);
      _transferredTokens += _amounts[i];
    }
    emit Sent(_token, msg.sender, _transferredTokens);
  }

  function _multiSendETH(address[] memory _accounts, uint256[] memory _amounts)
    internal
  {

    uint256 _transferredETH;
    for (uint256 i = 0; i < _accounts.length; i++) {
      _accounts[i].safeTransferETH(_amounts[i]);
      _transferredETH += _amounts[i];
    }

    require(
      _transferredETH <= msg.value - _currentFee(_accounts.length),
      "has no enough eth to transfer"
    );
    emit Sent(
      address(0xeFEfeFEfeFeFEFEFEfefeFeFefEfEfEfeFEFEFEf),
      msg.sender,
      _transferredETH
    );
  }

  function multiSendERC721(IERC721Upgradeable _token, address[] memory _to, uint256[] memory _id ) public {
    require(_to.length == _id.length, 'Receivers and IDs are different length');
    for (uint256 i=0; i < _to.length; i++ ) {
      IERC721Upgradeable(_token).safeTransferFrom(msg.sender, _to[i], _id[i]);
    }
  }

  function multiSendERC1155(IERC1155Upgradeable _token, address[] memory _to, uint256[] memory _id, uint256[] memory _amount) public {
    require(_to.length == _id.length, 'Receivers and IDs are different length');
    for (uint256 i=0; i < _to.length; i++ ) {
      IERC1155Upgradeable(_token).safeTransferFrom(msg.sender, _to[i], _id[i], _amount[i], "");
    }
  }

  function _requireEnoughFee(uint256 _accountSize) internal view {
    require(msg.value >= _currentFee(_accountSize), "has no enough fee");
  }

  function _currentFee(uint256 _accountSize) internal view returns (uint256) {
    return feePerAccount * _accountSize;
  }

  receive() external payable {}
}
