# BitCheck
BitCheck-基于区块链的证书验证平台

git clone https://github.com/bochain/BitCheck.git

0、npm install

1、vim truffle.js(将ip更改为自己的ip)

2、truffle compile

3、truffle migrate --reset

4、npm run dev

Ps:注意事项：


规则

1、证书的CAAddress必须有效，证书才能添加成功

2、证书的所有者及CA机构可以查看自己的证书详情，其他用户仅可验证证书是否有效

3、当证书被锁定或过期，任何人（包括证书所有者，CA）验证真伪均返回false

4、证书所有者可以将证书锁定或解锁，CA可以将证书锁定，解锁或过期；当证书过期，只有CA可以解除过期状态


操作步骤：

1、CA账户添加

2、CA账户所属机构添加证书

3、验证证书有效性

4、锁定证书

5、解锁证书

6、吊销证书


Ps one：本系统暂时支持Chrome浏览器，需要安装MetaMask

Ps two:由于系统处于1.0版本，用户体验不够友好，还请谅解，有任何问题欢迎提Issues或者联系微信zhengpeng0725优化



