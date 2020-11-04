<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        編輯站台
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="edit_data.maintenance_type"
                  label="維護種類"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex v-if="!frequencyTF" xs12 md6>
                <time-picker
                  v-model="edit_data.start_time"
                  :datetime="edit_data.start_time"
                  :disabled="dateTF"
                  :rules="dateTF ? [] : [FV.required]"
                  label="*開始時間"
                >
                </time-picker>
              </v-flex>
              <v-flex v-else xs12 md6>
                <v-datetime-picker
                  v-model="edit_data.start_date"
                  :error-messages="valid[1].start_date"
                  :datetime="edit_data.start_date"
                  :disabled="dateTF"
                  :rules="dateTF ? [] : [FV.required, start_dateCheck]"
                  label="*開始時間"
                >
                </v-datetime-picker>
              </v-flex>
              <v-flex v-if="!frequencyTF" xs12 md6>
                <time-picker
                  v-model="edit_data.end_time"
                  :datetime="edit_data.end_time"
                  :rules="[FV.required, end_dateCheck]"
                  label="*預計結束時間"
                >
                </time-picker>
              </v-flex>
              <v-flex v-else xs12 sm6>
                <v-datetime-picker
                  v-model="edit_data.end_date"
                  :error-messages="valid[1].end_date"
                  :datetime="edit_data.end_date"
                  :rules="[FV.required, end_dateCheck]"
                  label="*預計結束時間"
                >
                </v-datetime-picker>
              </v-flex>
              <v-flex xs6>
                <div>
                  <v-select
                    v-model="edit_data.cycle"
                    :items="frequency"
                    :disabled="frequencyTF"
                    label="頻率"
                    item-text="name"
                    item-value="value"
                  ></v-select>
                </div>
              </v-flex>
              <v-flex xs6>
                <div>
                  <v-select
                    v-model="edit_data.byday"
                    :items="edit_data.cycle === 'MONTHLY' ? bydate : byday"
                    :disabled="frequencyTF"
                    label="固定哪天"
                    item-text="name"
                    item-value="value"
                  ></v-select>
                </div>
              </v-flex>
              <v-flex xs12>
                <Website-picker
                  v-model="edit_data.website"
                  :web-list="edit_data.website"
                  :rules="[FV.required]"
                  label="*站台選擇"
                ></Website-picker>
              </v-flex>
              <v-flex xs12 md12>
                <v-textarea
                  v-model="edit_data.note"
                  outlined
                  label="備註"
                ></v-textarea>
              </v-flex>
              <v-radio-group
                v-model="edit_data.status"
                label="狀態"
                row
                class="d-flex justify-space-between"
              >
                <v-radio label="開始" value="start" color="primary"></v-radio>
                <v-radio label="暫停" value="pause" color="primary"></v-radio>
                <v-radio label="取消" value="cancel" color="primary"></v-radio>
              </v-radio-group>
            </v-layout>
          </v-container>
          <small>*為必填選項</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="parentPage" color="danger">關閉</v-btn>
        <v-btn color="success" @click="callEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import formValidation from '~/plugins/form_validation.js'
import vDatetimePicker from '~/components/date_time_picker.vue'
import timePicker from '~/components/time_picker.vue'
import WebsitePicker from '~/components/website_pick.vue'

export default {
  components: {
    vDatetimePicker,
    timePicker,
    WebsitePicker
  },
  props: {
    editData: {
      type: Object,
      default() {
        return {}
      }
    },
    maintenanceType: {
      type: Array,
      default() {
        return []
      }
    },
    frequency: {
      type: Array,
      default() {
        return []
      }
    },
    maintenanceStatus: {
      type: Array,
      default() {
        return []
      }
    },
    executionStatus: {
      type: Array,
      default() {
        return []
      }
    },
    byday: {
      type: Array,
      default() {
        return []
      }
    },
    bydate: {
      type: Array,
      default() {
        return []
      }
    },
    websiteList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      parentPage: '/maintenance/maintenance',
      edit_data: {},
      FV: formValidation.rules,
      dl: false,
      valid: {
        1: { start_date: '', end_date: '' }
      }
    }
  },
  computed: {
    frequencyTF() {
      if (this.edit_data.maintenance_type === 'regular') {
        return false
      } else {
        return true
      }
    },
    dateTF() {
      if (this.edit_data.maintenance_type === 'emergency') {
        return true
      } else {
        return false
      }
    },
    start_dateCheck() {
      if (this.edit_data.start_date === this.editData.start_date) {
        return true
      } else {
        return moment(this.edit_data.start_date).diff(moment(), 'hours', true) <
          1
          ? '開始時間必須至少在現在時間1小時後'
          : moment(this.edit_data.end_date).diff(
              moment(this.edit_data.start_date)
            ) < 1
          ? '開始時間必須早於結束時間'
          : true
      }
    },
    end_dateCheck() {
      if (this.edit_data.end_date === this.editData.end_date) {
        return true
      } else {
        return moment(this.edit_data.end_date).diff(
          moment(this.edit_data.start_date)
        ) < 1
          ? '結束時間必須晚於開始時間'
          : moment(this.edit_data.end_date).diff(moment(), true) < 1
          ? '結束時間不得早於現在時間'
          : true
      }
    }
  },
  created() {
    if (!Object.keys(this.editData).length) {
      this.$router.push(this.parentPage)
    } else {
      this.dl = true
      this.edit_data = JSON.parse(JSON.stringify(this.editData))
      this.edit_data.weekly_byday = this.edit_data.byday
    }
  },
  methods: {
    callEdit() {
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.editData))
        const editData = JSON.parse(JSON.stringify(this.edit_data))
        editData.website =
          !!editData.website === true ? JSON.stringify(editData.website) : '[]'
        if (data.start_date === editData.start_date) {
          delete editData.start_date
        } else {
          editData.start_date = moment(editData.start_date).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
        if (data.end_date === editData.end_date) {
          delete editData.end_date
        } else {
          editData.end_date = moment(editData.end_date).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
        if (editData.cycle === 'MONTHLY') {
          editData.monyhly_byday = editData.byday
          delete editData.weekly_byday
        } else if (editData.cycle === 'WEEKLY') {
          editData.weekly_byday = editData.byday
          delete editData.monyhly_byday
        }
        delete editData.id
        delete editData.byday
        delete editData.execution_status
        delete editData.last_end_date

        this.$emit('callEdit', editData)
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    }
  }
}
</script>
