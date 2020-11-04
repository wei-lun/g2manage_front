<template>
  <div class="ml-sm-5">
    <v-btn color="primary" small @click.stop="addDialog = true"
      >新增娛樂城</v-btn
    >
    <v-dialog v-model="addDialog" dark persistent max-width="650px">
      <v-card>
        <v-card-title>
          新增娛樂城
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="dl_new.gameid"
                    :rules="[FV.required]"
                    label="*娛樂城代碼"
                    hint="*必填選項"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field
                    v-model="dl_new.cn_name"
                    :rules="[FV.required, FV.min2, FV.max20]"
                    label="*娛樂城名稱(簡中)"
                    hint="*必填選項"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field
                    v-model="dl_new.tw_name"
                    :rules="[FV.required, FV.min2, FV.max20]"
                    label="*娛樂城名稱(繁中)"
                    hint="*必填選項"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field
                    v-model="dl_new.en_name"
                    :rules="[FV.required, FV.min2, FV.max20]"
                    label="*娛樂城名稱(英文)"
                    hint="*必填選項"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-file-input
                    v-model="dl_new.file"
                    label="logo圖檔"
                  ></v-file-input>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="dl_new.cdn_url"
                    :rules="[FV.required, FV.url]"
                    label="*URL"
                    hint="*必填選項"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="dl_new.category"
                    :items="lobbyType"
                    label="營運類別(多選)"
                    item-text="name"
                    chips
                    deletable-chips
                    hide-selected
                    multiple
                  >
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-switch
                    v-model="dl_new.game_switch"
                    color="primary"
                    label="開關"
                  ></v-switch>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*為必填選項</small>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="danger" @click="closeAddDialog">關閉</v-btn>
          <v-btn color="success" @click="callAddNewSite">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import formValidation from '~/plugins/form_validation.js'

export default {
  props: {
    lobbyType: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      moment,
      addDialog: false,
      dl_new: {
        website_switch: false
      },
      FV: formValidation.rules
      // datetime: '2019-01-01 00:00'
    }
  },
  mounted() {
    this.dl_new.creat_time = this.moment().format('YYYY-MM-DD hh:mm')
  },
  methods: {
    callAddNewSite() {
      if (this.$refs.form.validate()) {
        this.$emit('callAddNewSite', this.dl_new)
      } else {
        this.$store.dispatch('alert/danger', '必填選項未填')
      }
    },
    closeAddDialog() {
      this.addDialog = false
      this.clearForm()
    },
    clearForm() {
      // this.$refs.form.reset()
      this.dl_new = {
        date: this.moment().format('YYYY-MM-DD hh:mm'),
        website_switch: false
      }
      this.$refs.form.resetValidation()
    },
    updateDatetime(datetime) {}
  }
}
</script>
