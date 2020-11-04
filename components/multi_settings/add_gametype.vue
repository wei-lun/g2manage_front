<template>
  <div class="ml-sm-5">
    <v-btn color="primary" small @click.stop="addDialog = true"
      >新增遊戲分類</v-btn
    >
    <v-dialog v-model="addDialog" dark persistent max-width="650px">
      <v-card>
        <v-card-title>
          新增遊戲分類
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="dl_new.game_type_id"
                    :rules="[FV.required, FV.alpha_num]"
                    label="*類別代號"
                    hint="*必填選項"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="dl_new.game_type"
                    :rules="[FV.required]"
                    label="*類別名稱"
                    hint="*必填選項"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*為必填選項</small>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAddDialog">關閉</v-btn>
          <v-btn color="blue darken-1" text @click="callAddNewSite">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import formValidation from '~/plugins/form_validation.js'

export default {
  props: {},
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
    selectRemove(item) {
      const index = this.dl_new.type.indexOf(item.value)
      if (index >= 0) this.dl_new.type.splice(index, 1)
    },
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
