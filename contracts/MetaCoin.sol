pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

import "./ConvertLib.sol";
import "./ownable.sol";

contract MetaCoin is Ownable{


	address ownerOfContract = 0x6b5344B29E8E7e8e63f61321838f590fF9e7fB95;   //不是迅雷链

	address nullAddress = 0x0;  //0地址

	uint nullIndex = uint(-1); //没有在数组中找到

	uint cooldownTime = 1 minutes;  //修改证书状态的冷却时间：CA修改无冷却

	CertUser[] public certusers;    //  证书数组   长度有限吗，可能越界吗？

	mapping (address => uint[]) mapToCertUserIndex; // 证书所有者地址-->证书数组

	address[] public CAs;  // CA机构数组

	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	event CreateCertUser(
		address indexed userAddress,
		uint indexed certIndex
	);

	// 防重入------------------------------------------------------------------------
	bool locked;
	modifier noReentrancy() {
		if(locked) throw;
		locked = true;
		_;
		locked = false;
	}
	//-------------------------------------------------------------------------------

	function MetaCoin() public {

		balances[tx.origin] = 100000;
		CAs.push(ownerOfContract);
		addDefaultCertUsers();
	}

	function addDefaultCertUsers() public {
		createCertUser("username", "11", "11", "11", "11", ownerOfContract, "CA", ownerOfContract);
		createCertUser("username", "22", "22", "22", "22", ownerOfContract, "CA", ownerOfContract);
		createCertUser("username", "33", "33", "33", "33", ownerOfContract, "CA", ownerOfContract);
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}

	function getCertUserFirst() public view returns(string){
		return certusers[0].CA;
	}


	//-------------------------------------------------------------------------------
	struct CertUser {
		string username;   // 姓名：王二
		string identityId;  //身份证号
		string certnumber; //证书编号
		string orgname;  //团队名称：火毛依
		string hashstr;   //
		address useraddress; // 王二的地址
		string CA;  // 发证机构 ： 人民政府
		address CAAddress;
		uint userstate; // 0   1  锁定   2失效
		uint readyTime;
	}

	//合约拥有着设置CA和取消CA       数组的新增和删除返回的数据索引都无法获得
	// CA 操作

	function addCA(address CAAddress) public payable returns (uint CAIndex, bool error){
		//require(msg.sender == ownerOfContract);
		if(getCAByAddress(CAAddress) != nullIndex) {
			return (nullIndex, false);
		}
		return (CAs.push(CAAddress),true);
	}

	function getCAByAddress(address CAAddress) public view returns (uint CAIndex) {
		require(CAAddress != nullAddress);
		for(uint i = 0; i < CAs.length; i++ ) {
			if(CAs[i] == CAAddress) {
				return i;
			}
		}
		return nullIndex;
	}
	function deleteCA(address CAAddress) public payable returns (uint CAIndex) {
		uint index = getCAByAddress(CAAddress);
		if(index != nullIndex) {
			for(uint i = index + 1; i < CAs.length; i++) {
				CAs[i - 1] = CAs[i];
			}
			CAs[CAs.length - 1] = nullAddress;
			CAs.length--;
		}
		return index;   // CA存在与否都能删除成功
	}


	//创建证书， 可以创建成功 ，其它数据为null仍可创建成功
	function createCertUser(string _username, string _identityId, string _certnumber, string _orgname, string _hashstr
	, address _useraddress, string _CA, address _CAAddress) public payable returns(string)  {
		require(_useraddress != nullAddress);
		require(_CAAddress != nullAddress);
		if(getCAByAddress(_CAAddress) == nullIndex) {
			return "invalid CA address, please add CA address to CAs first";
		}
		uint index = _getUniqueCertUserPos(_identityId, _certnumber);
		if(index != nullIndex) {
			return  "add false, the CertUser has added before.";
		}
		uint certUserIndex = certusers.push(CertUser({username:_username, identityId:_identityId, certnumber:_certnumber, orgname:_orgname
			, hashstr:_hashstr,useraddress: _useraddress, CA:_CA, CAAddress:_CAAddress, userstate:0, readyTime:now}));
		mapToCertUserIndex[_useraddress].push(certUserIndex);
		CreateCertUser(_useraddress, certUserIndex);
		return "add success";
	}

	//获取证书数组
	function _getCertuses() public  view returns (CertUser[]) {
		return certusers;
	}

	//通过身份证和证书编号获取指定证书索引
	function _getUniqueCertUserPos(string identityId, string certnumber) private view returns (uint) {
		CertUser[] memory allCertusers = _getCertuses();
		for(uint i = 0; i < allCertusers.length; i++) {
			if(keccak256(allCertusers[i].identityId) == keccak256(identityId)
			&& keccak256(allCertusers[i].certnumber) == keccak256(certnumber)) {
				return i;
			}
		}
		return nullIndex;
	}
	//获取指定地址的证书个数
	function getArrayIndex(address _useraddress) public  view returns (uint[] rtn) {
		return  mapToCertUserIndex[_useraddress];
	}

	// 王二 和人民政府可以获取证书
	function getFirstCertUser(string identityId, string certnumber) public view returns
	(string username, string identityId1, string certnumber1, string orgname, string hashstr
	, address useraddress1, string CA, address CAAddress,uint32 userstate, uint32 readyTime) {
		//命名为index，会报DeclarationError: Identifier already declared，和下面声明冲突

		CertUser[] memory allCertusers = _getCertuses();
		uint index = _getUniqueCertUserPos(identityId, certnumber);
		require(index != nullIndex);
//		require(allCertusers[index].useraddress == msg.sender || allCertusers[index].CAAddress == msg.sender);
		return (allCertusers[index].username, allCertusers[index].identityId, allCertusers[index].certnumber, allCertusers[index].orgname
		, allCertusers[index].hashstr, allCertusers[index].useraddress, allCertusers[index].CA, allCertusers[index].CAAddress
		, uint32(allCertusers[index].userstate), uint32(allCertusers[index].readyTime));

	}

	function getCertUserByAddressAndIndex(address certUserAddress, uint index) public view returns
	(string username, string identityId1, string certnumber1, string orgname, string hashstr
	, address useraddress1, string CA, address CAAddress,uint32 userstate, uint32 readyTime){
		require(index != nullIndex);
		CertUser memory currentCertUser = _getCertuses()[index];

		return (currentCertUser.username, currentCertUser.identityId, currentCertUser.certnumber, currentCertUser.orgname
		, currentCertUser.hashstr, currentCertUser.useraddress, currentCertUser.CA, currentCertUser.CAAddress
		, uint32(currentCertUser.userstate), uint32(currentCertUser.readyTime));
	}

	//改变证书状态
	function changeCertUserState(string identityId, string certnumber, uint state) public payable returns (bool isChanged) {
		CertUser storage certUser = certusers[_getUniqueCertUserPos(identityId, certnumber)];
		require(certUser.userstate != state);
		if(certUser.userstate == 2 ) {
			require(certUser.CAAddress == msg.sender);
			certUser.userstate = state;
		} else {
			//require(_isReady(certUser));   //冷却时间
			certUser.userstate = state;
		}

		_triggerCooldown(certUser);
	}


	// 获取用户的所有证书
	function getAllCertUsers(address addr) public view returns (string) {

		uint[] memory arr = getArrayIndex(addr);
		if(arr.length == 0) return "no CertUser exist!";
		string[] memory rst = new string[](arr.length);
		for (uint i = 0; i < arr.length; i++) {
			CertUser memory cur = certusers[arr[i]];
			string memory s0 = _stringMerge(cur.username,"!");
			string memory s1 = _stringMerge(cur.identityId,"!");
			string memory s2 =  _stringMerge(cur.certnumber,"!");
			string memory s3 =  _stringMerge(cur.orgname,"!");
			// string memory s4 = cur.hashstr;
			//string memory s5 = string(cur.useraddress);
			string memory s6 = _stringMerge(cur.CA,"!");
			string memory s8;
			// string memory s7 = cur.CAAddress;
			if(cur.userstate == 0) {
				s8 = "0???";
			} else if(cur.userstate == 1) {
				s8 = "1???";
			} else {
				s8 = "2???";
			}

			string[] memory inner = new string[](6);
			inner[0] = s0;
			inner[1] = s1;
			inner[2] = s2;
			inner[3] = s3;
			inner[6] = s6;
			inner[8] = s8;

			string memory tmp = _stringArrayMerge(inner);
			return tmp;
			//rst =_stringMerge(_stringMerge(rst,_stringMerge(_stringMerge(_stringMerge(_stringMerge(_stringMerge(s0,s1),s2),s3),s6),s8)),"&");
		}

		return _stringArrayMerge(rst);
	}

	// sha3(s1) == sha3(s2) sha3(s1,s2) == sha3(s1,s2,s3,s4)
	function _stringEquals(string s1, string s2) private pure returns (bool istrue) {
		if(bytes(s1).length != bytes(s2).length) return false;
		for(uint i = 0; i < bytes(s1).length; i++) {
			if(bytes(s1)[i] != bytes(s2)[i])
				return false;
		}
		return true;
	}
	// 变长的storage数组和bytes（不包括string）有一个push()方法。可以将一个新元素附加到数组末端，返回值为当前长度。
	// 123  uint8  memory数组长度必须固定，storate才可调整
	function _stringMerge(string s1, string s2) private pure returns (string) {
		//byte8 fixedLengthBytesArray = 0x1122334455667788;
		//if(bytes(s1).length == 0) return s2;    == 不能用？
		//if(bytes[s2].length == 0) return s1;
		bytes memory rtn = new bytes(bytes(s1).length + bytes(s2).length);
		for(uint i = 0; i < bytes(s1).length; i++) {
			rtn[i] = bytes(s1)[i];
		}
		for(uint j = 0; j < bytes(s2).length; j++) {
			rtn[bytes(s1).length + j] = bytes(s2)[j];
		}
		return string(rtn);
	}

	function _stringArrayMerge(string[] memory arr)  private pure returns (string) {
		uint len = 0;
		uint curLen = 0;
		for(uint i = 0; i < arr.length; i++) {
			len += bytes(arr[i]).length;
		}
		bytes memory rtn = new bytes(len);
		for(uint count = 0; count < len; count++) {
			for(uint j = 0; j < bytes(arr[count]).length; j++) {
				rtn[curLen + j] = bytes(arr[count])[j];
			}
			curLen = bytes(arr[count]).length;
		}
		return string(rtn);
	}

	function verifyCertUser(string identityId, string certnumber) public view returns (bool istrue) {
		for(uint i = 0; i < certusers.length; i++) {
			if(_stringEquals(certusers[i].identityId,identityId) && _stringEquals(certusers[i].certnumber,certnumber)
			&& certusers[i].userstate == 0)
				return true;
		}

		return false;
	}

	function _triggerCooldown(CertUser storage certUser) internal {
		certUser.readyTime = uint32(now + cooldownTime);
	}

	function _isReady(CertUser storage certUser) internal view returns (bool) {
		return (certUser.readyTime <= now);
	}

}
