// eslint-disable-next-line no-unused-vars
let axios, vuex

export default function({ $axios, store }) {
  axios = $axios
  vuex = store
}
// api
// const userRequest = axios.create()

// User 相關的 api
export const userLogin = (data) => axios.post('/api/user/sign-in', data)
export const userLogout = (data) => axios.get('/api/user/sign-out')
export const refreshToken = (data) =>
  axios.post('/api/user/refresh-token', data)

// 新增使用者
export const userSignUp = (data) => axios.post('/api/user/sign-up', data)
// 使用者管理列表
export const userList = (data) =>
  axios.get('/api/management/user/list', {
    params: data
  })
// 取得使用者資料
export const getUserConf = (data) =>
  axios.get('/api/management/user/list/configuration/' + data)
// 更新使用者資料
export const userConfiguration = (index, data) =>
  axios.put('/api/management/user/list/configuration/' + index, data)
// 新增角色權限
export const permissionSettingAddition = (data) =>
  axios.post('/api/management/user/permission-setting/addition', data)
// 權限設定列表
export const permissionSetting = (data) =>
  axios.get('/api/management/user/permission-setting', {
    params: data
  })
// 更新權限設定列表
export const permissionSettingConfiguration = (index, data) =>
  axios.put(
    '/api/management/user/permission-setting/configuration/' + index,
    data
  )

// 站台管理相關 api (management)
// 新增站台
export const websiteAddition = (data) =>
  axios.post('/api/management/website/addition', data)
// 取得站台資料
export const getWebsiteConf = (data) =>
  axios.get('/api/management/website/configuration/' + data)
// 更新站台資料
export const websiteConfiguration = (index, data) =>
  axios.put('/api/management/website/configuration/' + index, data)
// 站台列表
export const websiteList = (data) =>
  axios.get('/api/management/website/list', {
    params: data
  })
// 資料庫設定列表
export const DBSetting = (data) =>
  axios.get('/api/management/website/db-setting', {
    params: data
  })
// 營運項目列表
export const businessProject = (data) =>
  axios.get('/api/management/website/business-project', {
    params: data
  })
// 維護設定列表
export const maintenanceList = (data) =>
  axios.get('/api/management/maintenance/setting', {
    params: data
  })
// 更新維護設定
export const maintenanceConfiguration = (index, data) =>
  axios.put('/api/management/maintenance/setting/configuration/' + index, data)
// 新增維護設定
export const maintenanceAddition = (data) =>
  axios.post('/api/management/maintenance/setting/addition', data)
// 維護確認
export const csConfirmation = (index) =>
  axios.post('/api/management/maintenance/setting/cs-confirmation/' + index)
// 維護完成
export const csChangeExecutionStatus = (index, data) =>
  axios.put(
    '/api/management/maintenance/it-notify/change-execution-status/' + index,
    data
  )
// 歷史維護設定列表
export const maintenanceHistoryList = (data) =>
  axios.get('/api/management/maintenance/history', {
    params: data
  })
// 彩池貢獻金
export const jackpot = (data) =>
  axios.get('/api/jackpotpoolList/jackpotpool', {
    params: data
  })
// 娛樂城管理設定列表
export const casinoList = (data) =>
  axios.get('/api/casino/list', {
    params: data
  })
// 新增娛樂城
export const cassinoAddition = (data) =>
  axios.post('/api/casino/addition', data)
// 公告列表
export const announceList = (data) =>
  axios.get('/api/announceList/announce-list', {
    params: data
  })
// 公告管理設定列表
export const announceSetting = (data) =>
  axios.get('/api/announceList/announce-setting', {
    params: data
  })
// 更新公告資料
export const announceEdit = (index, data) =>
  axios.put('/api/announceList/announce-edit/' + index, data)

export const gamesList = (data) =>
  axios.get('/api/casino/gamesList', {
    params: data
  })
