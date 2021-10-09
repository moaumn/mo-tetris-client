## 双人联机对战俄罗斯方块
> 本项目为客户端，[服务端项目在此](https://github.com/moaumn/mo-tetris-server.git) ，  [点击测试地址查看效果](http://103.216.154.42:3500)

游戏支持单人和双人模式，单人模式无需联网，双人模式通过链接邀请加入游戏。

#### 游戏道具说明
通过消除行来获取游戏道具，一次消除行数越多，获得道具几率越高。
道具分为增益和减益两种，增益道具对自己生效，减益道具对对手生效。

#### 增益道具：
1. 绿色小方格图标：从最底层开始填充3个空格。
2. 绿色长条图标：将下一个方块替换为长条。
3. 绿色表图标：当前和后面两个方块下落速度减半。

#### 减益道具：
1. 红色旋转图标：对手下一个方块无法旋转。
2. 红色表图标：对手当前和后面两个方块下落速度加倍。

#### 项目运行方式
```
// 开发
yarn dev

// 测试
yarn test

// 打包
yarn build
```
需要在src/common/config中指定服务端地址