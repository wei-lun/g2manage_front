<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        公告信息
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.title"
                  label="*標題"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  v-model="edit_data.sitename"
                  :items="siteName"
                  filled
                  chips
                  color="blue-grey lighten-2"
                  label="站台"
                  multiple
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggle">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            edit_data.sitename.length > 0
                              ? 'indigo darken-4'
                              : ''
                          "
                          >{{ icon }}</v-icon
                        >
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Select All</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      :input-value="data.selected"
                      close
                      class="chip--select-multi"
                      @click:close="selectRemove(data.item)"
                    >
                      {{ data.item }}
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-flex>
              <!-- <v-flex xs12 sm12>
                <v-flex xs12 md6>
                  <v-select
                    v-model="edit_data.status"
                    :items="websiteStatus"
                    item-text="name"
                    item-value="value"
                    label="狀態"
                    hint="*必填選項"
                    :rules="[FV.required]"
                  ></v-select>
                </v-flex>
              </v-flex> -->
              <v-flex xs12 md6>
                <v-datetime-picker
                  v-model="edit_data.update_time"
                  :error-messages="valid[1].date"
                  :datetime="edit_data.update_time"
                  :rules="[FV.required]"
                  label="*開始時間"
                >
                </v-datetime-picker>
              </v-flex>
              <v-flex xs12 md6>
                <v-datetime-picker
                  v-model="edit_data.end_time"
                  :error-messages="valid[1].date"
                  :datetime="edit_data.end_time"
                  :rules="[FV.required]"
                  label="*結束時間"
                >
                </v-datetime-picker>
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="edit_data.note"
                  label="*公告內容"
                  filled
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*為必填選項</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="danger" to="/announce_management/announce">關閉</v-btn>
        <v-btn color="success" @click="callEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidation from '~/plugins/form_validation.js'
import vDatetimePicker from '~/components/date_time_picker.vue'

export default {
  components: {
    vDatetimePicker
  },
  props: {
    editData: {
      type: Object,
      default() {
        return {}
      }
    },
    siteName: {
      type: Array,
      default() {
        return []
      }
    },
    platformType: {
      type: Array,
      default() {
        return []
      }
    },
    websiteStatus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      edit_data: {},
      FV: formValidation.rules,
      dl: false,
      dl_new: {
        date: null,
        cdn_setting: 'off',
        casino: '[]'
      },
      valid: {
        1: { website_code: '', website_name: '', date: '' },
        2: {},
        3: {
          /* management_frontdesk: '',
          management_background: '',
          management_frontdesk_spare: '',
          management_background_spare: '',
          ccdb_ip: '',
          brdb_ip: '',
          bwdb_ip: '' */
        }
      }
    }
  },
  computed: {
    selectAllsites() {
      return this.edit_data.sitename.length === this.siteName.length
    },
    selectSomesites() {
      return this.edit_data.sitename.length > 0 && !this.selectAllsites
    },
    icon() {
      if (this.selectAllsites) return 'mdi-close-box'
      if (this.selectSomesites) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  created() {
    if (!Object.keys(this.editData).length) {
      this.$router.push('/announce_management/announce')
    } else {
      this.dl = true
      this.edit_data = JSON.parse(JSON.stringify(this.editData))
    }
  },
  methods: {
    callEdit() {
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.edit_data))
        // data.operate =
        //   !!data.operate === true ? JSON.stringify(data.operate) : '[]'
        // delete data.website_code
        // delete data.website_name
        this.$emit('callEdit', data)
        this.edit_data = {}
        this.$router.push('/announce_management/announce')
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    },
    selectRemove(item) {
      const index = this.edit_data.sitename.indexOf(item)
      if (index >= 0) this.edit_data.sitename.splice(index, 1)
    },
    toggle() {
      this.$nextTick(() => {
        if (this.selectAllsites) {
          this.edit_data.sitename = []
        } else {
          this.edit_data.sitename = this.siteName.slice()
        }
      })
    }
  }
}
</script>
