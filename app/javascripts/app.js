// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

import "../stylesheets/main/style.css";
import "../stylesheets/main/main.css";

//import "../javascripts/Navigation.js";

//import "../images/02.jpg";

//import "../javascript/unslider.min.js";
//import "../javascript/jquery-1.11.1.min.js";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var indexArray = new Array();
var intoFunctionCount = 0;
var CreateCertUserEvent ; // 添加时间监听？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
var myLoalStorage = window.localStorage;
var temp = new Array();
temp[0] = 0;
temp[1] = 1;
myLoalStorage.setItem("0x6b5344B29E8E7e8e63f61321838f590fF9e7fB95",temp);   // temp -->[1,2]  temp[0]=1, temp[1]=,   ;
console.log(myLoalStorage.getItem("0x6b5344B29E8E7e8e63f61321838f590fF9e7fB95"));
console.log(myLoalStorage.getItem(0x6b5344B29E8E7e8e63f61321838f590fF9e7fB95));
window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    console.log(message);
  },

  setStatus2: function(message) {
    var status = document.getElementById("add_status");
    console.log(message);
  },
  setStatus3: function(message) {
    var status = document.getElementById("status3");
    console.log(message);
  },
    addDefaultCertUsers: function() {
    var self = this;
   // this.setStatus3("getCertUserFirst ......");
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.addDefaultCertUsers({from: account});
    }).then(function(username) {
       var a = document.getElementById("status3");
	  //a.innerHTML=username;
	  console.log(username);
    }).catch(function(e) {
      console.log(e);
	   var a = document.getElementById("status3");
	  //a.innerHTML="Error; see log.";
    });
  },
//	添加CA
   addCA:function() {
    var self = this;
    var meta;
	var receiver = document.getElementById("add_CAAddress").value;

    if(receiver==null ||receiver==""){
      alert("证书颁发机构地址不能为空!");
      return;
    }
	 console.log("Initiating transaction... (please wait)");

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.addCA(receiver,{from: account,nonce:4});
    }).then(function(data, istrue) {   //返回的数据怎么解析？？？所有的返回值都解析不了
		/*if(istrue) {
			document.getElementById("ca_status").innerHTML= data + "---add success";
		} else {
			document.getElementById("ca_status").innerHTML= data + "---add fail";
		}*/
	//	document.getElementById("ca_status").innerHTML= data + "---add success";
      alert("CA机构添加成功！");
      receiver = "";
       console.log("addCA" + data);
    }).catch(function(e) {
      console.log(e);
      receiver = "";
    //  alert("CA机构地址添加失败！");
    //   document.getElementById("ca_status").innerHTML= "error. see log";
    });
  },
//	获取CA
   getCAByAddress:function() {
    var self = this;
    var meta;
	var receiver = document.getElementById("add_CAAddress").value;

//	document.getElementById("ca_status").innerHTML= "Initiating transaction... (please wait)";

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getCAByAddress(receiver,{from: account});
    }).then(function(data) {
        if(data == 1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77) {
            data = "doesn't exists";
        }
	//	document.getElementById("ca_status").innerHTML= data + "---get success";
       console.log(data);
    }).catch(function(e) {
      console.log(e);
  //     document.getElementById("ca_status").innerHTML= "error. see log";
    });
  },
  //删除CA
   deleteCA:function() {
    var self = this;
    var meta;
	var receiver = document.getElementById("add_CAAddress").value;
//	document.getElementById("ca_status").innerHTML= "Initiating transaction... (please wait)";

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.deleteCA(receiver,{from: account});
    }).then(function(data) {
	//	document.getElementById("ca_status").innerHTML= data + "---delete success";
       console.log(data);
    }).catch(function(e) {
      console.log(e);
    //   document.getElementById("ca_status").innerHTML= "error. see log";
    });
  },


//添加证书
  createCertUser: function() {
    var self = this;
    var username = document.getElementById("username").value;
    var identityId = document.getElementById("identityId").value;
    var certnumber = document.getElementById("certnumber").value;
    var orgname = document.getElementById("orgname").value;
    var hashstr = "thisishashstring";
    var useraddress = document.getElementById("useraddress").value;
    var CA = document.getElementById("CA").value;
    var CAAddress = document.getElementById("CAAddress").value;

    if(identityId==null ||identityId==""){
      alert("身份证号码不能为空!");
      return;
    }
    if(certnumber==null ||certnumber==""){
      alert("证书编号不能为空!");
      return;
    }
    if(useraddress==null ||useraddress==""){
      alert("用户账户地址不能为空!");
      return;
    }
    if(CAAddress==null ||CAAddress==""){
      alert("证书颁发机构地址不能为空!");
      return;
    }

    console.log("Initiating createCertUser transaction... (please wait)");
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.createCertUser(username, identityId, certnumber, orgname, hashstr, useraddress, CA, CAAddress, {from: account});
    }).then(function(data) {
        alert("证书添加成功!");
		console.log(data);// 还是获取不到data
		 console.log(" CertUser Transaction finished:     " + data);
    }).catch(function(e) {
      console.log(e);
      console.log("Error createCertUser; see log.");
    });
  },

// 验证证书有效
  verrifyCertUser:function() {
	var self = this;
	var meta;
	var identityId = document.getElementById("verify_identityId").value;
	var certnumber = document.getElementById("verify_certnumber").value;
	var isValid = document.getElementById("verify_status");

  if(identityId==null ||identityId==""){
        alert("身份证号码不能为空!");
        return;
    }
      if(certnumber==null ||certnumber==""){
        alert("证书编号不能为空!");
        return;
      }

	console.log("wait！！！");
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.verifyCertUser(identityId, certnumber, {from: account});
    }).then(function(index) {
      if(index){
		      alert("证书验证成功");
    }  else{
      	alert("证书验证失败");
    }
		console.log(index);
    }).catch(function(e) {
      console.log(e);
      	alert("证书验证失败");

    });

  },
  // 获取用户的第一个证书
  getFirstCertUser:function() {
	var self = this;
	var meta;
  var strHtml = "";
  var strStatus = "";

	var identityId = document.getElementById("qry_identityId").value;
	var certnumber = document.getElementById("qry_certnumber").value;
	//var isValid = document.getElementById("verify_status");
  var certValid = document.getElementById("cert_status");
	console.log("wait！！！");
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getFirstCertUser(identityId, certnumber, {from: account});
    }).then(function(index) {
	//	isValid.innerHTML = index;
    var odiv = document.getElementsByClassName("button");
  //  odiv[6].style.display = "block";//注销
  //  odiv[5].style.display = "block";//解锁
    //odiv[4].style.display = "block";//锁定
      var status = index[8].valueOf();
      if(status == 2){
        strStatus = "已注销";
        odiv[5].style.display = "block";//解锁
      }else if(status == 1){
        strStatus = "已锁定";
        odiv[5].style.display = "block";//解锁
      }else{
        strStatus = "正常";
        odiv[6].style.display = "block";//注销
        odiv[4].style.display = "block";//锁定
      }
      strHtml = "<table class='bitcheckTable'>" +
                    "<tr><th>用户名称：</th><td>"+ index[0] +"</td></tr>" +
                    "<tr><th>证书编号：</th><td>"+ index[2] +"</td></tr>" +
                    "<tr><th>证书名称：</th><td>"+ index[3] +"</td></tr>" +
                    "<tr><th>所属用户地址：</th><td>"+ index[5] +"</td></tr>" +
                    "<tr><th>证书颁发机构：</th><td>"+ index[6] +"</td></tr>" +
                    "<tr><th>颁发机构地址：</th><td>"+ index[7] +"</td></tr>" +
                    "<tr><th>证书状态：</th><td>"+ strStatus +"</td></tr>" +
                "</table>"
    certValid.innerHTML = strHtml;
		console.log(index);
    }).catch(function(e) {
      console.log(e);
    //  isValid.innerHTML="Error verify; see log.";
    });
  },
// 列出某用户的所有证书的数组长度及索引
    getArrayIndex:function() {
        var self = this;
        var meta;
        var userAddress = document.getElementById("listall_cert").value;
        MetaCoin.deployed().then(function(instance) {
            meta = instance;
            return meta.getArrayIndex(userAddress, {from: account});
        }).then(function(list) {
            console.log("return:"+list);    //一定要用字符串拼接来把结果转成字符串，不然一直显示BigNumber
            console.log("0:" + list[0]);
        }).catch(function(e) {
            console.log(e);
        });
    },

// 列出某用户的所有证书   certUsers                     ????????????????????????????????????? ?????????????????????????????????????
  getAllCertUsers:function() {
      var self = this;
      var meta;
      var userAddress = document.getElementById("listall_cert").value;
      var arr1 = new Array;
      arr = myLoalStorage.getItem(userAddress);
      console.log("getAllCertUsers:" + myLoalStorage.getItem(userAddress));
      console.log(myLoalStorage.getItem(userAddress)[0]);
      console.log(myLoalStorage.getItem(userAddress)[1]);
      console.log(myLoalStorage.getItem(userAddress)[2]);
      console.log(myLoalStorage.getItem(userAddress)[3]);
      console.log(myLoalStorage.getItem(userAddress)[4]);
      //console.log(myLoalStorage.getItem(userAddress)[2] + "");
      console.log(arr1.length);
      var arr = new Array;
      arr = [1,2];



      for (var theindex = 0; theindex < arr.length; theindex++) {
          var tempIndex = theindex;
          MetaCoin.deployed().then(function (instance, tempIndex) {
              meta = instance;
              console.log('tempIndex: ' + tempIndex);  //parseInt(arr[index++])
              return meta.getCertUserByAddressAndIndex(userAddress, parseInt(arr[tempIndex]), {from: account});
          }).then(function (index) {
              console.log("index: " + index);
              var state;
              var i = 1;
              if (index[8].valueOf() == 0) state = "正常";
              else if (index[8].valueOf() == 1) state = "已锁定";
              else if (index[8].valueOf() == 2) state = "已失效";
              isValid.innerHTML += index[0] + '&emsp;' + index[3] + '&emsp;' + '<button onclick="App.changeCertUserState(1)">' + state + '</button><br/>';
          }).catch(function (e) {
              console.log(e);
          //    document.getElementById("listDetails").innerHTML = "Error verify; see log.";
          });
      }
  },


    // 通过索引遍历证书                          ????????????????????????????????????? ?????????????????????????????????????
  getCertUserByAddressAndIndex:function() {
    var self = this;
    var meta;
    var isValid = document.getElementById("listDetails");
    var certUserAddress = document.getElementById("listall_cert").value;
    var count =0;
    MetaCoin.deployed().then(function(instance) {
        meta = instance;
        return meta.getCertUserByAddressAndIndex(certUserAddress, indexArray[intoFunctionCount++], {from: account});
    }).then(function(index) {
        console.log(index);
        var state;
        var i = 1;
        if(index[8].valueOf() == 0) state = "正常";
        else if(index[8].valueOf() == 1) state = "已锁定";
        else if(index[8].valueOf() == 2) state = "已失效";
        isValid.innerHTML += index[0]+ '&emsp;' + index[3] + '&emsp;' + '<button onclick="App.changeCertUserState(1)">' +state +'</button><br/>';
    }).catch(function(e) {
        console.log(e);
      //  document.getElementById("listDetails").innerHTML="Error verify; see log.";
    });
  },

  // 弃用-----------列出用户的第一个证书，可改变状态，需要添加按钮
  listFirstCertUser:function() {
	var self = this;
	var meta;
	var identityId = document.getElementById("listall_identityId").value;
	var certnumber = document.getElementById("listall_certnumber").value;
	var isValid = document.getElementById("listDetails");
	var innerHtml="";
	isValid.innerHTML = "wait！！！";
	var count =0;
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getFirstCertUser(identityId, certnumber, {from: account});
    }).then(function(index) {
		var state;
		var i = 1;
		if(index[8].valueOf() == 0) state = "正常";
		else if(index[8].valueOf() == 1) state = "已锁定";
		else if(index[8].valueOf() == 2) state = "已失效";
		innerHtml += index[0]+ '&emsp;' + index[3] + '&emsp;' + '<button onclick="App.changeCertUserState(1)">' +state +'</button><br/>';
		isValid.innerHTML = innerHtml;
		console.log(index);
    }).catch(function(e) {
      console.log(e);
    //  document.getElementById("listDetails").innerHTML="Error verify; see log.";
    });
  },

  // 改变证书状态
  changeCertUserState:function(state) {
    var self = this;
	var meta;
	console.log("----------wait");
	var identityId = document.getElementById("qry_identityId").value;
	var certnumber = document.getElementById("qry_certnumber").value;
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.changeCertUserState(identityId, certnumber, state, {from: account});
    }).then(function(data) {
		console.log(data);
    alert("状态修改成功！");
		//document.getElementById("list_status").innerHTML="result of change state" + data;
    }).catch(function(e) {
      alert("状态修改失败！");
      console.log(e);
    //  document.getElementById("list_status").innerHTML=="Error; see log.";
    });
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      //balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },


  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }


};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask");
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

    if(!window.localStorage){
        alert("浏览器不支持localstorage");
    }else{
        var storage=window.localStorage;
        storage.setItem("hello", "test localstorage: hello world");
        console.log(storage.getItem("hello"));
        console.log(typeof storage["hello"]);
        storage.removeItem("hello");
        console.log(storage.getItem("hello"));
    }

  App.start();
});
