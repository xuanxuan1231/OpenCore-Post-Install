# 用AppleALC修复音频

因此，首先，我们假设您已经安装了Lilu和AppleALC，如果您不确定它是否已正确加载，则可以在终端中运行以下命令（这也将检查AppleHDA是否已加载，因为没有这个AppleALC就没有什么可修补的）：

```sh
kextstat | grep -E "AppleHDA|AppleALC|Lilu"
```

如果3个都出现，您就可以开始了。并确保VoodooHDA **不存在**。否则，这将与AppleALC冲突。

如果您遇到问题，请参阅[问题排查部分](../universal/audio.md#troubleshooting)

## 查找你的layout ID

因此，对于此示例，我们假设您的编解码器为ALC1220。要验证您的，您有以下几种选择：

* 检查主板的规格页和手册
* 检查Windows中的“设备管理器”
* 检查Windows下的HWInfo64
  * 确保在打开时取消选择Summary-only和Sensors-only
* 在Windows中检查AIDA64 Extreme
* 在Linux的终端上运行`cat`
  * `cat /proc/asound/card0/codec#0 | less`

现在有了编解码器，我们想交叉引用它与AppleALC支持的编解码器列表:

* [AppleALC支持的编解码器](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs)

使用ALC1220，我们得到以下结果:

```
0x100003, layout 1, 2, 3, 5, 7, 11, 13, 15, 16, 21, 27, 28, 29, 34
```

因此，它告诉我们两件事:

* 支持哪个硬件版本(`0x100003`)，仅在列出具有不同布局的多个版本时相关
* 我们的编解码器支持的layout ID(`layout 1, 2, 3, 5, 7, 11, 13, 15, 16, 21, 27, 28, 29, 34`)

现在有了支持的layout ID列表，我们准备进行一些尝试

**Note**: 如果你的音频编解码器是ALC 3XXX，这很可能是假的，只是一个重新命名的控制器，做你的研究，看看真正的控制器是什么。

* 这方面的一个例子是ALC3601，但是当我们加载Linux时，显示的是真实名称：ALC 671

## 测试你的layout

为了测试我们的layout ID，我们将使用boot-arg`alcid=xxx`，其中xxx是您的layout。记住，**一次**尝试**一个**布局id 。不要添加多个ID或alcid启动参数，如果一个不工作，然后尝试下一个ID等

```
config.plist
├── NVRAM
  ├── Add
    ├── 7C436110-AB2A-4BBB-A880-FE41995C9F82
          ├── boot-args | String | alcid=11
```

如果没有布局ID工作，尝试为您的系统创建[SSDT-HPET修复](https://xuanxuan1231.github.io/Getting-Started-With-ACPI/Universal/irq.html)-AppleHDA为笔记本和一些台式机工作时需要。

## 使layout ID更永久

一旦你找到了一个与你的黑苹果工作的布局ID，我们可以创建一个更永久的解决方案，更接近真实的mac设置他们的布局ID。

在AppleALC中，有一个优先级结构，属性的优先级是这样的:

1. `alcid=xxx` boot-arg，用于调试并覆盖所有其他值
2. `alc-layout-id` 在DeviceProperties,，**应该只在苹果硬件上使用**
3. `layout-id` 在DeviceProperties，**应该在苹果和非苹果硬件上使用**

首先，我们需要找出音频控制器在PCI地图上的位置。为此，我们将使用一个名为[gfxutil](https://github.com/acidanthera/gfxutil/releases)的方便工具，然后在macOS终端上使用:

```sh
path/to/gfxutil -f HDEF
```

![](../images/post-install/audio-md/gfxutil-hdef.png)

然后将这个PciRoot和子配置`layout-id`添加到你的config.plist中DeviceProperties -> Add部分:

![](../images/post-install/audio-md/config-layout-id.png)

请注意，AppleALC可以接受十进制/数字和十六进制/数据，通常最好的方法是十六进制，因为你避免了任何不必要的转换。你可以使用一个简单的[十进制到十六进制计算器](https://www.rapidtables.com/convert/number/decimal-to-hex.html)来找到你的答案。`printf '%x\n' DECI_VAL`:

![](../images/post-install/audio-md/hex-convert.png)

所以在这个例子中，`alcid=11`可以变成:

* `layout-id | Data | <0B000000>`
* `layout-id | Number | <11>`

请注意，最终的HEX/Data值总共应该是4个字节（ `0B 00 00 00`，对于layout ID超过255（`FF 00 00 00`）将需要记住字节被交换。所以256就变成了`00 01 00 00`

* 使用十进制/数字方法可以完全忽略十六进制交换和数据大小


**提醒**:你之后**必须**删除boot-arg，因为它将始终具有最高优先级，不删除的话AppleALC将忽略所有如DeviceProperties的其他条目

## 其他问题

### AMD上没有麦克风

* 这是与AMD一起运行AppleALC时的常见问题，特别是没有补丁来支持麦克风输入。目前“最好”的解决方案是买一个USB DAC/麦克风。实际上VoodooHDA.kext方法也可以，但VoodooHDA的问题在于它不稳定，音质也比AppleALC差

### Clover中相同的layout ID不在OpenCore上工作

This is likely do to IRQ conflicts, on Clover there's a whole sweep of ACPI hot-patches that are applied automagically. Fixing this is a little bit painful but [SSDTTime](https://github.com/corpnewt/SSDTTime)'s `FixHPET` option can handle most cases.

For odd cases where RTC and HPET take IRQs from other devices like USB and audio, you can reference the [HP Compaq DC7900 ACPI patch](https://github.com/khronokernel/trashOS/blob/master/HP-Compaq-DC7900/README.md#dsdt-edits) example in the trashOS repo

### Kernel Panic on power state changes in 10.15

* Enable PowerTimeoutKernelPanic in your config.plist:
  * `Kernel -> Quirks -> PowerTimeoutKernelPanic -> True`

## Troubleshooting

So for troubleshooting, we'll need to go over a couple things:

* [Checking if you have the right kexts](#checking-if-you-have-the-right-kexts)
* [Checking if AppleALC is patching correctly](#checking-if-applealc-is-patching-correctly)
* [Checking AppleHDA is vanilla](#checking-applehda-is-vanilla)
* [AppleALC working inconsistently](#applealc-working-inconsistently)
* [AppleALC not working correctly with multiple sound cards](#applealc-not-working-correctly-with-multiple-sound-cards)
* [AppleALC not working from Windows reboot](#applealc-not-working-from-windows-reboot)

### Checking if you have the right kexts

To start, we'll assume you already have Lilu and AppleALC installed, if you're unsure if it's been loaded correctly you can run the following in terminal(This will also check if AppleHDA is loaded, as without this AppleALC has nothing to patch):

```sh
kextstat | grep -E "AppleHDA|AppleALC|Lilu"
```

If all 3 show up, you're good to go. And make sure VoodooHDA **is not present**. This will conflict with AppleALC otherwise. Other kexts to make sure you do not have in your system:

* RealtekALC.kext
* CloverALC.kext
* VoodooHDA.kext
* HDA Blocker.kext
* HDAEnabler#.kext(# can be 1, 2, or 3)

> Hey Lilu and/or AppleALC aren't showing up

Generally the best place to start is by looking through your OpenCore logs and seeing if Lilu and AppleALC injected correctly:

```
14:354 00:020 OC: Prelink injection Lilu.kext () - Success
14:367 00:012 OC: Prelink injection AppleALC.kext () - Success
```

If it says failed to inject:

```
15:448 00:007 OC: Prelink injection AppleALC.kext () - Invalid Parameter
```

Main places you can check as to why:

* **Injection order**: Make sure that Lilu is above AppleALC in kext order
* **All kexts are latest release**: Especially important for Lilu plugins, as mismatched kexts can cause issues

Note: To setup file logging, see [OpenCore Debugging](https://dortania.github.io/OpenCore-Install-Guide/troubleshooting/debug.html).

### Checking if AppleALC is patching correctly

So with AppleALC, one of the most easiest things to check if the patching was done right was to see if your audio controller was renamed correctly. Grab [IORegistryExplorer](https://github.com/khronokernel/IORegistryClone/blob/master/ioreg-302.zip) and see if you have an HDEF device:

![](../images/post-install/audio-md/hdef.png)

As you can see from the above image, we have the following:

* HDEF Device meaning our rename did the job
* AppleHDAController attached meaning Apple's audio kext attached successfully
* `alc-layout-id` is a property showing our boot-arg/DeviceProperty injection was successful
  * Note: `layout-id | Data | 07000000` is the default layout, and `alc-layout-id` will override it and be the layout AppleHDA will use

Note: **Do not rename your audio controller manually**, this can cause issues as AppleALC is trying to patch already. Let AppleALC do it's work.

**More examples**:

Correct layout-id           |  Incorrect layout-id
:-------------------------:|:-------------------------:
![](../images/post-install/audio-md/right-layout.png)  |  ![](../images/post-install/audio-md/wrong-layout.png)

As you can see from the above 2, the right image is missing a lot of AppleHDAInput devices, meaning that AppleALC can't match up your physical ports to something it can understand and output to. This means you've got some work to find the right layout ID for your system.

### Checking AppleHDA is vanilla

This section is mainly relevant for those who were replacing the stock AppleHDA with a custom one, this is going to verify whether or not yours is genuine:

```sh
sudo kextcache -i / && sudo kextcache -u /
```

This will check if the signature is valid for AppleHDA, if it's not then you're going to need to either get an original copy of AppleHDA for your system and replace it or update macOS(kexts will be cleaned out on updates). This will only happen when you're manually patched AppleHDA so if this is a fresh install it's highly unlikely you will have signature issues.

### AppleALC working inconsistently

Sometimes rare conditions can occur where your hardware isn't initialized in time for AppleHDAController resulting in no sound output. To get around this, you can either:

Specify in boot-args the delay:

```
alcdelay=1000
```

Or Specify via DeviceProperties(in your HDEF device):

```
alc-delay | Number | 1000
```

The above boot-arg/property will delay AppleHDAController by 1000 ms(1 second), note the ALC delay cannot exceed [3000 ms](https://github.com/acidanthera/AppleALC/blob/2ed6af4505a81c8c8f5a6b18c249eb478266739c/AppleALC/kern_alc.cpp#L373)

### AppleALC not working correctly with multiple sound cards

For rare situations where you have 2 sounds cards(ex. onboard Realtek and an external PCIe card), you may want to avoid AppleALC patching devices you either don't use or don't need patching(like native PCIe cards). This is especially important if you find that AppleALC will not patch you onboard audio controller when the external one is present.

To get around this, we'll first need to identify the location of both our audio controllers. The easiest way is to run [gfxutil](https://github.com/acidanthera/gfxutil/releases) and search for the PCI IDs:

```sh
/path/to/gfxutil
```

Now with this large output you'll want to find your PciRoot pathing, for this example, lets use a Creative Sound-Blaster AE-9PE PCIe audio card. For this, we know the PCI ID is `1102:0010`. So looking through our gfxutil output we get this:

```
66:00.0 1102:0010 /PC02@0/BR2A@0/SL05@0 = PciRoot(0x32)/Pci(0x0,0x0)/Pci(0x0,0x0)
```

From here, we can clearly see our PciRoot pathing is:

```
PciRoot(0x32)/Pci(0x0,0x0)/Pci(0x0,0x0)
```

* **Note**: This will assume you know both the Vendor and Device ID of the external sound card. For reference, these are the common Vendor IDs:
  * Creative Labs: `1102`
  * AsusTek: `1043`
* **Note 2**: Your ACPI and PciRoot path will look different, so pay attention to **your** gfxutil output

Now that we have our PciRoot pathing, we can finally open up our config.plist and add our patch.

Under DeviceProperties -> Add, you'll want to add your PciRoot(as a Dictionary) with the child called `external-audio`:

```
DeviceProperties
| --- > Add
 | --- > PciRoot(0x32)/Pci(0x0,0x0)/Pci(0x0,0x0)
  | ----> external-audio | Data | 01
```

![](../images/post-install/audio-md/external-audio.png)

And with this done, you can reboot and AppleALC should now ignore your external audio controller!

### AppleALC not working from Windows reboot

If you find that rebooting from Windows into macOS breaks audio, we recommend either adding `alctcsel=1` to boot-args or add this property to your audio device in DeviceProperties:

```
DeviceProperties
| --- > Add
 | --- > PciRoot(0x32)/Pci(0x0,0x0)/Pci(0x0,0x0)(Adjust to your device)
  | ----> alctcsel | Data | 01000000
```
