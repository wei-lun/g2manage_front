export default function({ store, route }) {
  const nameMap = {
    multi_settings: '綜合設定',
    game_type_list: '營運類別設定',
    register: '管理員設定',
    platform: '站台管理',
    sitestatus: '站台列表',
    adminsite: '營運項目管理',
    finance: '貢獻金管理',
    site_info: '資料庫管理',
    gamelobby_management: '娛樂城管裡',
    gamelobby_list: '娛樂城列表',
    gamelobby_status: '狀態管理',
    game_management: '遊戲管理',
    game_list: '遊戲列表',
    game_status: '狀態管理',
    user_management: '使用者管理',
    user_list: '帳號列表',
    permission_setting: '權限設定管理',
    maintenance: '維護資訊',
    MaintenanceHistory: '歷史維護紀錄'
  }
  const nowRoute = route.path.substr(1).split('/')
  let breadCrumb = ''
  nowRoute.some(function(item, index, array) {
    if (typeof nameMap[item] !== 'undefined') breadCrumb += '/' + nameMap[item]
    else return false
  })
  store.commit('breadcrumb/setBreadCrumb', breadCrumb)
}
