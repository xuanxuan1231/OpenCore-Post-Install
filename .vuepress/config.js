const {
    description
} = require('../package')

module.exports = {
    title: 'OpenCore安装后',
    head: [
        ['meta', {
            name: 'theme-color',
            content: '#3eaf7c'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
        }],
        ["link", {
            rel: "'stylesheet",
            href: "/styles/website.css"
        }],
        ["link", {
            rel: "shortcut icon",
            type: "image/x-icon",
            href: "/favicon.ico"
        }]
    ],
    base: '/OpenCore-Post-Install/',

    watch: {
        $page(newPage, oldPage) {
            if (newPage.key !== oldPage.key) {
                requestAnimationFrame(() => {
                    if (this.$route.hash) {
                        const element = document.getElementById(this.$route.hash.slice(1));

                        if (element && element.scrollIntoView) {
                            element.scrollIntoView();
                        }
                    }
                });
            }
        }
    },

    markdown: {
        extendMarkdown: md => {
            md.use(require('markdown-it-multimd-table'), {
                rowspan: true,
            });
        }
    },

    theme: 'vuepress-theme-succinct',
    globalUIComponents: [
        'ThemeManager'
    ],

    themeConfig: {
        lastUpdated: true,
        repo: 'https://github.com/xuanxuan1231/OpenCore-Post-Install',
        editLinks: true,
        editLinkText: '帮助我们改进此页！',
        logo: '/homepage.png',
        nav: [{
            text: 'Dortania指南翻译',
            items: [{
                text: '主页',
                link: 'https://xuanxuan1231.github.io/'
            },
            {
                text: 'OpenCore安装指南',
                link: 'https://xuanxuan1231.github.io/OpenCore-Install-Guide/'
            },
            {
                text: 'OpenCore多重引导',
                link: 'https://xuanxuan1231.github.io/OpenCore-Multiboot/'
            },
            {
                text: 'ACPI入门',
                link: 'https://xuanxuan1231.github.io/Getting-Started-With-ACPI/'
            },
            {
                text: '图形卡购买指南',
                link: 'https://xuanxuan1231.github.io/GPU-Buyers-Guide/'
            },
            {
                text: '无线网卡购买指南',
                link: 'https://xuanxuan1231.github.io/Wireless-Buyers-Guide/'
            },
            {
                text: '购买踩坑指南',
                link: 'https://xuanxuan1231.github.io/Anti-Hackintosh-Buyers-Guide/'
            },
            ]
        },],
        sidebar: [{
            title: '介绍',
            collapsable: false,
            sidebarDepth: 1,
            children: [
                '',
            ]

        },
        {
            title: '通用',
            collapsable: false,
            sidebarDepth: 2,
            children: [

                ['/universal/audio', '修复声音'],
                ['/universal/oc2hdd', '不用USB引导'],
                ['/universal/update', '升级OpenCore，内核扩展和macOS'],
                ['/universal/drm', '修复 DRM'],
                ['/universal/iservices', '修复i服务'],
                ['/universal/pm', '修复电源管理'],
                ['/universal/sleep', '修复睡眠'],
            ]
        },
        {
            title: '修复USB',
            collapsable: false,
            sidebarDepth: 1,
            children: [
                ['/usb/', 'USB映射：介绍'],
                ['/usb/system-preparation', '准备系统'],
                {
                    title: 'USB映射',
                    collapsable: true,
                    sidebarDepth: 2,
                    children: [
                        ['/usb/intel-mapping/intel', 'Intel USB映射'],
                        ['/usb/manual/manual', '手动映射'],
                    ]
                },
                {
                    title: '其他修复',
                    collapsable: true,
                    sidebarDepth: 1,
                    children: [
                        ['/usb/misc/power', '修复USB电源'],
                        ['/usb/misc/shutdown', '修复关机/重启'],
                        ['/usb/misc/instant-wake', '修复瞬间唤醒'],
                        ['/usb/misc/keyboard', '修复键盘唤醒问题'],
                    ]
                },
            ]
        },
        {
            title: '安全性',
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['/universal/security', '安全性和FileVault'],
                {
                    title: '',
                    collapsable: false,
                    sidebarDepth: 2,
                    children: [
                        ['/universal/security/filevault', 'FileVault'],
                        ['/universal/security/vault', 'Vault'],
                        ['/universal/security/scanpolicy', 'ScanPolicy（扫描策略）'],
                        ['/universal/security/password', 'OpenCore菜单密码'],
                        ['/universal/security/applesecureboot', 'Apple安全启动'],
                    ]
                },
            ]
        },
        {
            title: '笔记本的特殊性',
            collapsable: false,
            children: [
                ['/laptop-specific/battery', '修复电池读数'],

            ]
        },
        {
            title: '美化',
            collapsable: false,
            children: [
                ['/cosmetic/verbose', '修复分辨率和啰嗦模式'],
                ['/cosmetic/gui', '添加GUI和引导铃声'],
                ['/universal/memory', '修复在MacPro7,1上发生的内存问题'],
            ]
        },
        {
            title: '多重引导',
            collapsable: false,
            children: [
                ['https://xuanxuan1231.github.io/OpenCore-Multiboot/', 'OpenCore多重引导（未翻译）'],
                ['/multiboot/bootstrap', '设置启动器选项'],
                ['/multiboot/bootcamp', '安装BootCamp'],
            ]
        },
        {
            title: '其他',
            collapsable: false,
            children: [
                ['/misc/rtc', '修复RTC'],
                ['/misc/msr-lock', '修复CFG锁'],
                ['/misc/nvram', '模拟NVRAM'],
            ]
        },
        {
            title: '图形卡补丁',
            collapsable: false,
            children: [
                ['/gpu-patching/', '深度的图形卡补丁'],
                {
                    title: '现代Intel核芯显卡',
                    collapsable: false,
                    children: [
                        ['/gpu-patching/intel-patching/', '核芯显卡补丁介绍'],
                        ['/gpu-patching/intel-patching/vram', '显存补丁'],
                        ['/gpu-patching/intel-patching/connector', '连接器类型补丁'],
                        ['/gpu-patching/intel-patching/busid', 'BusID补丁'],
                    ]
                },
                {
                    title: '旧版Intel核芯显卡',
                    collapsable: false,
                    children: [
                        ['/gpu-patching/legacy-intel/', 'GMA补丁'],
                    ]
                },
                {
                    title: '旧版Nvidia',
                    collapsable: false,
                    children: [
                        ['/gpu-patching/nvidia-patching/', 'Nvidia补丁'],
                    ]
                },
            ]
        },

        ],
    },
    plugins: [
        '@vuepress/back-to-top',
        'vuepress-plugin-smooth-scroll',
        'vuepress-plugin-fulltext-search',
        ['@vuepress/medium-zoom',
            {
                selector: ".theme-succinct-content :not(a) > img",
                options: {
                    background: 'var(--bodyBgColor)'
                }
            }],
    ]
}
