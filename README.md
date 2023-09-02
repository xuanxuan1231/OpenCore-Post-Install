---
lang: zh-CN
---
# OpenCore安装后

欢迎来到OpenCore安装后的教程！请注意：如果你还没有安装macOS，我们建议你跟随以下指南：

* [OpenCore安装教程](https://xuanxuan1231.github.io/OpenCore-Install-Guide/)

虽然这里的信息可以应用于OpenCore和Clover，但我们主要关注OpenCore的安装。因此，如果你遇到任何问题，你需要进行更多的研究。

## 如何遵循本指南
首先，并非本指南中的每一节都必须完整。取决于每个用户是否觉得自己想做最后的润色或解决某些问题.  
本指南分为8个部分：

* [通用](#通用)
  * 建议所有用户遵守
* [修复USB](#修复usb)
  * 建议所有用户最好遵守
* [安全性](#安全性)
  * 对于关心安全和隐私的人
* [笔记本的特殊性](#笔记本的特殊性)
  * 笔记本电脑用户除以上内容外，还建议遵循此项
* [美化](#美化)
  * 如加入GUI和关闭啰嗦模式（-v）
* [多重引导](#多重引导)
  * 针对多引导用户的建议
* [其他](#其他)
  * 其他错误修复，并非所有用户都需要这些修复
* [图形卡补丁](#图形卡补丁)
  * 一个更深入的研究支持各种GPU硬件的变化的macOS补丁

### 通用

* [修复声音](./universal/audio.md)
  * 对于需要解决音频问题。
* [不用USB引导](./universal/oc2hdd.md)
  * 允许您在没有安装USB的情况下启动OpenCore。
* [升级OpenCore，内核扩展和macOS](./universal/update.md)
  * 如何安全地更新您的内核扩展，OpenCore甚至macOS。
* [修复DRM](./universal/drm.md)
  * 对于那些有DRM问题的人，比如Netflix播放。
* [修复i服务](./universal/iservices.md)
  * 帮助修复像iMessage这样的i服务问题。
* [修复电源管理](./universal/pm.md)
  * 修复并帮助改善硬件空闲和增强状态。
* [修复睡眠](./universal/sleep.md)
  * 在修复睡眠时，需要检查很多地方。

### 修复USB

* [USB映射：介绍](./usb/README.md)
  * 解决USB接口丢失并帮助睡眠等问题的起点。

### 安全性

* [安全性和FileVault](./universal/security.md)
  * 在这里，我们将设置OpenCore的一些很好的安全功能。

### 笔记本的特殊性

* [修复电池读数](./laptop-specific/battery.md)
  * 如果你的电池不支持直接使用SMCBatteryManager。

### 美化

* [添加GUI和引导铃声](./cosmetic/gui.md)
  * 添加一个花哨的GUI到OpenCore，甚至一个启动铃声!
* [修复分辨率和啰嗦模式](./cosmetic/verbose.md)
  * 帮助修复OpenCore的分辨率，并允许您在启动时获得正常的苹果徽标!
* [修复在MacPro7,1上发生的内存问题](./universal/memory.md)
  * 修复了MacPro7.1启动时的内存错误。

### 多重引导

* [OpenCore多重引导](https://xuanxuan1231.github.io/OpenCore-Multiboot/)
  * 专用OpenCore多重引导指南
* [设置启动器选项](./multiboot/bootstrap.md)
  * 确保Windows不会从我们的系统中删除OpenCore。
* [安装BootCamp](./multiboot/bootcamp.md)
  * 允许我们安装Bootcamp，方便启动切换。

### 其他

* [修复RTC](./misc/rtc.md)
  * 帮助解决RTC/CMOS/安全模式重启问题。
* [修复CFG锁](./misc/msr-lock.md)
  * 允许删除一些内核补丁以获得更好的稳定性
* [模拟NVRAM](./misc/nvram.md)
  * 对于已经损坏NVRAM或需要测试它的用户。

### 图形卡补丁

* [深度的图形卡补丁](./gpu-patching/README.md)
