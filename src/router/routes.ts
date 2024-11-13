// 对外暴露配置路由
export const constantRoute = [
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: "登录", //菜单标题
            hidden: true,
            icon: 'Promotion'//菜单文字左侧的图标,支持element-plus所有图标
        }
    },
    {
        name: 'layout',
        path: '/',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: 'layout',
            hidden: true,
            icon: ''
        },
        redirect: '/home',//路由重定向
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'HomeFilled'
                }
            }
        ]
    },
    {
        path: '/screen',
        name: 'Screen',
        component: () => import('@/views/screen/index.vue'),
        meta: {
            title: '数据大屏',
            icon: 'DataAnalysis'
        }
    },
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',
        redirect: '/acl/user',//路由重定向
        meta: {
            title: '权限管理',
            icon: 'Lock'
        },
        children: [
            {
                path: '/acl/user',
                name: 'Acl',
                component: () => import("@/views/acl/user/index.vue"),
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'User'
                },
            },
            {
                path: '/acl/role',
                name: 'Role',
                component: () => import("@/views/acl/role/index.vue"),
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'UserFilled'
                }
            },
            {
                path: '/acl/permission',
                name: 'Permission',
                component: () => import("@/views/acl/permission/index.vue"),
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'Grid'
                }
            }
        ]
    },
    {
        path: '/product',
        name: 'Product',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '商品管理',
            icon: 'Goods'
        },
        redirect: '/product/trademark',//路由重定向
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCart'
                }
            },
            {
                path: '/product/attr',
                component: () => import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'Wallet'
                }
            },
            {
                path: '/product/spu',
                component: () => import('@/views/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'spu管理',
                    icon: 'Ship'
                }
            },
            {
                path: '/product/sku',
                component: () => import('@/views/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'Sku管理',
                    icon: 'Flag'
                }
            }
        ]
    },
    {
        name: '404',
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '404',
            hidden: true,
            icon: 'FolderDelete'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
            title: "任意路由",
            hidden: true,
            icon: 'BellFilled'
        }
    }
]