<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="500" dark>
      <template v-slot:activator="{ on }">
        <v-btn small color="primary" v-on="on">選擇角色</v-btn>
      </template>

      <v-card>
        <v-card-title>
          更換角色
        </v-card-title>

        <v-card-text>
          <v-select
            v-model="filter.type"
            :items="[
              {
                name: '全部',
                value: ''
              },
              ...userTypeArr
            ]"
            item-text="name"
            item-value="value"
            label="帳號類型"
            hide-details
            @input="setFilter"
          />
        </v-card-text>
        <v-card-text>
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
                single-select
                show-select
                hide-default-footer
              >
                <template v-slot:item.type="{ item }">
                  {{ userType(item.type) }}
                </template>
                <template
                  v-slot:item.data-table-select="{ item, select, isSelected }"
                >
                  <v-icon
                    :color="isSelected ? 'primary' : 'grey'"
                    @click=";[select(!isSelected), viewPermissionSetting(item)]"
                    >{{
                      isSelected ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'
                    }}</v-icon
                  >
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12">
              <pagination
                :total-items="totalItems"
                :pagination="pagination"
                :sort="sort"
                @fetch="init()"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              查看權限
              <v-permission-setting v-model="permissionSettings" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="danger" link @click="dialog = false">
            關閉
          </v-btn>
          <v-btn color="success" link @click="permissionConfirm()">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import formValidation from '~/plugins/form_validation.js'
import { permissionSetting } from '~/plugins/api_route'
import pagination from '~/components/pagination.vue'
import vPermissionSetting from '~/components/user_management/permission_setting_list.vue'

export default {
  components: {
    vPermissionSetting,
    pagination
  },
  props: {
    userTypeArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialog: false,
      FV: formValidation.rules,
      permission: [],
      totalItems: 0,
      permissionSettings: {},
      filter: { type: '' },
      sort: {},
      pagination: {
        rowsPerPage: 10,
        sortBy: ['type'],
        sortDesc: [false]
      },
      headers: [
        { text: '角色名稱', value: 'permission', sortable: false },
        { text: '權限', value: 'type', sortable: false }
        // { text: '操作', value: 'operation', sortable: false }
      ],
      output: null
    }
  },
  watch: {},
  created() {},
  methods: {
    openPermissionDialog() {
      this.dialog = true
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
    async init() {
      await permissionSetting({
        ...this.filter,
        ...this.sort,
        page: this.pagination.page
      })
        .then((response) => {
          this.permission = response.data.data.filter(
            (item) => item.type !== 'R'
          )
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
        this.init()
      }
    },
    viewPermissionSetting(item) {
      this.permissionSettings = item.setting
      this.output = {
        type: item.type,
        permission: item.permission,
        setting: item.setting
      }
    },
    permissionConfirm() {
      if (this.output) {
        this.dialog = false
        this.$emit('output', this.output)
      } else this.$store.dispatch('alert/danger', '請選擇角色')
    }
  }
}
</script>
