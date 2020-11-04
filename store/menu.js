export const state = () => ({
  list: [
    {
      id: 'multi_settings',
      icon: 'apps',
      title: '綜合設定',
      child: [
        {
          icon: 'diamond-stone',
          title: '營運類別設定',
          to: '/multi_settings/game_type_list'
        }
      ]
    },
    {
      id: 'platform_operation',
      icon: 'cog',
      title: '站台管理',
      child: [
        {
          icon: 'format-list-bulleted',
          title: '站台列表',
          permission: 'WebsiteList',
          to: '/platform/sitestatus'
        },
        {
          icon: 'ballot',
          title: '資料庫管理',
          permission: 'DBSetting',
          to: '/platform/site_info'
        },
        {
          icon: 'dip-switch',
          title: '營運項目設定',
          permission: 'BusinessProject',
          to: '/platform/adminsite'
        }
      ]
    },
    {
      id: 'game_lobby_management',
      icon: 'diamond-stone',
      title: '娛樂城管理',
      child: [
        {
          icon: 'diamond-stone',
          title: '娛樂城列表',
          to: '/gamelobby_management/gamelobby_list'
        },
        {
          icon: 'tune',
          title: '狀態管理',
          to: '/gamelobby_management/gamelobby_status'
        }
      ]
    },
    {
      id: 'game_management',
      icon: 'gamepad-variant',
      title: '遊戲管理',
      child: [
        {
          icon: 'dice-5',
          title: '遊戲列表',
          to: '/game_management/game_list'
        },
        {
          icon: 'tune',
          title: '狀態管理',
          to: '/game_management/game_status'
        }
      ]
    },
    {
      id: 'user_management',
      icon: 'account',
      title: '使用者管理',
      child: [
        {
          icon: 'account-box-multiple',
          title: '帳號列表',
          permission: 'UserManagement',
          to: '/user_management/user_list'
        },
        {
          icon: 'tune',
          title: '權限設定管理',
          permission: 'PermissionSetting',
          to: '/user_management/permission_setting'
        }
      ]
    },
    {
      id: 'maintenance',
      icon: 'cog',
      title: '維護資訊',
      child: [
        {
          icon: 'cog',
          title: '站台維護資訊',
          permission: 'MaintenanceSetting',
          to: '/maintenance/maintenance'
        },
        {
          icon: 'cog',
          title: '歷史維護紀錄',
          permission: 'MaintenanceHistory',
          to: '/maintenance/maintenance_history'
        }
      ]
    },
    {
      id: 'finance',
      icon: 'cash',
      title: '贡献金管理',
      child: [
        {
          icon: 'cash',
          title: '彩池贡献金',
          to: '/finance/jackpotpool'
        }
      ]
    }
    // {
    //   id: 'announce_management',
    //   icon: 'bullhorn',
    //   title: '公告管理',
    //   child: [
    //     {
    //       icon: 'format-list-bulleted',
    //       title: '公告訊息',
    //       to: '/announce_management/announce'
    //     }
    //   ]
    // }
    // {
    //   id: 'platform_operation_2',
    //   icon: 'apps',
    //   title: '範例頁面',
    //   child: [
    //     {
    //       icon: 'apps',
    //       title: '不可用',
    //       to: '/none'
    //     },
    //     {
    //       icon: 'apps',
    //       title: '預設首頁未使用Welcome',
    //       to: '/'
    //     },
    //     {
    //       icon: 'home',
    //       title: '預設範例頁面Inspire',
    //       to: '/inspire'
    //     }
    //   ]
    // }
  ],
  menulist: []
})

export const getters = {
  // list: (state) => (userSetting) => {
  // }
}

export const actions = {}

export const mutations = {
  setMenulist(state, userSetting) {
    const list = JSON.parse(JSON.stringify(state.list))

    const localData = JSON.parse(userSetting)

    if (!localData) {
      state.menulist = []
      return true
    }

    const userPermission = Object.keys(localData).reduce(function(acc, cur, i) {
      if (localData[cur].read === true) acc.push(cur)
      return acc
    }, [])

    const returnList = list.reduce(function(acc, cur, i) {
      const child = cur.child.reduce(function(acc, cur, i) {
        if (
          process.env.dev &&
          (!cur.permission || userPermission.includes(cur.permission))
        )
          acc.push(cur)
        else if (userPermission.includes(cur.permission)) acc.push(cur)

        return acc
      }, [])

      if (child.length !== 0) {
        cur.child = child
        acc.push(cur)
      }

      return acc
    }, [])

    state.menulist = returnList
  }
}
