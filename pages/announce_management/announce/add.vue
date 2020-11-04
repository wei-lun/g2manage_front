<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        新增公告
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-autocomplete
                v-model="dl_new.selectedsites"
                :items="siteName"
                filled
                chips
                color="blue-grey lighten-2"
                label="*發送站台"
                multiple
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="toggle">
                    <v-list-item-action>
                      <v-icon
                        :color="
                          selectedsites.length > 0 ? 'indigo darken-4' : ''
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
              <v-flex xs12>
                <v-text-field
                  v-model="dl_new.title"
                  :rules="[FV.max200]"
                  label="*標題"
                  filled
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-datetime-picker
                  v-model="dl_new.update_time"
                  :error-messages="valid[1].date"
                  :datetime="dl_new.update_time"
                  :rules="[FV.required]"
                  label="*開始時間"
                >
                </v-datetime-picker>
              </v-flex>
              <v-flex xs12 md6>
                <v-datetime-picker
                  v-model="dl_new.end_time"
                  :error-messages="valid[1].date"
                  :datetime="dl_new.end_time"
                  :rules="[FV.required]"
                  label="*結束時間"
                >
                </v-datetime-picker>
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="dl_new.note"
                  :rules="[FV.max200]"
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
        <v-btn color="success" @click="callAddNewAnnounce">新增</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
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
    lobbyType: {
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
    },
    siteName: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      moment,
      edit_data: {},
      FV: formValidation.rules,
      dl: false,
      dl_new: {
        date: null,
        cdn_setting: 'off',
        casino: '[]'
      },
      selectedsites: [],
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
      return this.selectedsites.length === this.siteName.length
    },
    selectSomesites() {
      return this.selectedsites.length > 0 && !this.selectAllsites
    },
    icon() {
      if (this.selectAllsites) return 'mdi-close-box'
      if (this.selectSomesites) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  created() {
    this.dl = true
    this.edit_data = JSON.parse(JSON.stringify(this.editData))
    this.dl_new.update_time = this.moment().format('YYYY-MM-DD HH:mm:ss')
  },
  methods: {
    callAddNewAnnounce() {
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.dl_new))
        data.operate =
          !!data.operate === true ? JSON.stringify(data.operate) : '[]'
        delete data.website_code
        delete data.website_name
        this.$emit('callEdit', data)
        this.edit_data = {}
        this.$router.push('/announce_management/announce')
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    },
    selectRemove(item) {
      const index = this.selectedsites.indexOf(item)
      if (index >= 0) this.selectedsites.splice(index, 1)
    },
    toggle() {
      this.$nextTick(() => {
        if (this.selectAllsites) {
          this.selectedsites = []
        } else {
          this.selectedsites = this.siteName.slice()
        }
      })
    }
  }
}
</script>
