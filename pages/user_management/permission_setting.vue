<template>
  <v-container fluid>
    <v-row>
      <v-btn color="success" small @click.stop="newPermission">
        新增角色
      </v-btn>
      <v-spacer></v-spacer>
      <v-card-title class="subtitle-1">
        權限設定管理(數量：{{ totalItems }})
      </v-card-title>
    </v-row>
    <v-row>
      <v-col class="pa-0" cols="12">
        <v-data-table
          :headers="headers"
          :items="permission"
          :server-items-length="totalItems"
          :options.sync="pagination"
          :loading="$store.state.loading.inprogress"
          :must-sort="true"
          item-key="permission"
          show-expand
          hide-default-footer
        >
          <template v-slot:item.type="{ item }">
            {{ userType(item.type) }}
          </template>
          <template v-slot:item.operation="{ item }">
            <v-btn
              v-if="item.type !== 'R'"
              color="primary"
              small
              @click.stop="editPermission(item)"
              >編輯</v-btn
            >
            <v-dialog v-model="item.dl_permission" width="500" dark>
              <template v-slot:activator="{ on }">
                <v-btn color="primary" small v-on="on">
                  權限
                </v-btn>
              </template>
              <v-card>
                <v-card-title primary-title>
                  查看權限：{{ userType(item.type) }} - {{ item.permission }}
                </v-card-title>
                <v-card-text>
                  <v-permission-setting v-model="item.setting" />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="success" @click.stop="copyPermission(item)">
                    複製權限並新增角色
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click.stop="item.dl_permission = false"
                  >
                    關閉
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:header.data-table-expand="{}">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn small text v-on="on">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  說明
                </v-btn>
              </template>
              <span
                ><v-chip small outlined color="success">
                  寫入
                </v-chip>
                <v-chip small outlined color="warning">
                  唯讀
                </v-chip>
                <v-chip small outlined color="grey">
                  無權限
                </v-chip>
              </span>
            </v-tooltip>
          </template>
          <template v-slot:item.data-table-expand="{ expand, isExpanded }">
            <v-row>
              <v-btn text small @click="expand(!isExpanded)">
                <v-icon left>{{
                  isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
                }}</v-icon>
                查看權限
              </v-btn>
            </v-row>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length">
              <v-container fluid>
                <v-row>
                  <!-- Object.keys(item.setting).length -->
                  <v-col
                    v-for="(value, index) in item.setting"
                    :key="index"
                    cols="auto"
                  >
                    <v-row no-gutters>
                      <v-col cols="auto">
                        <v-chip
                          :color="settingColorCompute(value.read, value.write)"
                          outlined
                          small
                        >
                          <v-icon left small>{{
                            settingIconCompute(value.read, value.write)
                          }}</v-icon>
                          {{ index }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <pagination
          :total-items="totalItems"
          :pagination="pagination"
          :sort="sort"
          @fetch="fetchData"
        />
      </v-col>
    </v-row>
    <v-row>
      <NuxtChild
        :edit-key="editKey"
        :edit-data="editData"
        :user-type-arr="userTypeArr"
        @fetchData="fetchData"
      />
    </v-row>
  </v-container>
</template>

<script>
import { permissionSetting } from '~/plugins/api_route'
import pagination from '~/components/pagination.vue'
import vPermissionSetting from '~/components/user_management/permission_setting_list.vue'

export default {
  components: {
    pagination,
    vPermissionSetting
  },
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    },
    userTypeArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentPage: '/user_management/permission_setting',
      permission: [],
      totalItems: 0,
      sort: {},
      pagination: {
        rowsPerPage: 10,
        sortBy: ['type'],
        sortDesc: [false]
      },
      headers: [
        // { text: '序號', value: 'id' },
        { text: '角色名稱', value: 'permission', sortable: false },
        { text: '權限', value: 'type', sortable: false },
        // { text: '娛樂城管理', value: '', sortable: false },
        // { text: '營運類別管理', value: 'type', sortable: false },
        // { text: '遊戲管理', value: '', sortable: false },
        // { text: 'CDN設定', value: 'cdn_setting' },
        // { text: '相關網址', value: 'relate_url', sortable: false },
        { text: '操作', value: 'operation', sortable: false },
        { text: '', value: 'data-table-expand' }
      ],
      editData: {},
      editKey: null
    }
  },
  methods: {
    settingColorCompute(read, write) {
      if (write) return 'success'
      else if (read) return 'warning'
      else return 'grey'
    },
    settingIconCompute(read, write) {
      if (write) return 'mdi-circle-edit-outline'
      else if (read) return 'mdi-eye'
      else return 'mdi-eye-off'
    },
    editPermission(item) {
      this.editKey = item.permission
      const temp = JSON.parse(JSON.stringify(item))
      this.editData = temp
      this.$router.push(this.currentPage + '/edit')
    },
    copyPermission(item) {
      this.editKey = item.permission
      const temp = JSON.parse(JSON.stringify(item))
      this.editData = temp
      this.$router.push(this.currentPage + '/add')
    },
    newPermission() {
      this.editKey = ''
      this.editData = null
      this.$router.push(this.currentPage + '/add')
    },
    userType(type) {
      const typenum = this.userTypeArr
        .map(function(item, index) {
          return item.value
        })
        .indexOf(type)
      if (typeof this.userTypeArr[typenum] !== 'undefined')
        return this.userTypeArr[typenum].name
      else return type
    },
    async fetchData() {
      await permissionSetting({
        ...this.filter,
        ...this.sort,
        page: this.pagination.page
      })
        .then((response) => {
          this.permission = response.data.data
          this.totalItems = response.data.meta.pagination.total
        })
        .catch((error) => {
          if (error) {
            this.permission = []
            this.totalItems = 0
          }
        })
    },
    setFilter() {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.fetchData()
      }
    }
  }
}
</script>
