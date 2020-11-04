<template>
  <v-dialog v-model="editDialog" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        編輯遊戲
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.gameid"
                  :rules="[FV.required]"
                  label="*遊戲代碼"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.game_name"
                  :rules="[FV.required]"
                  label="*遊戲名稱"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  v-model="edit_data.game_type"
                  :items="lobbyType"
                  :rules="[FV.required]"
                  item-text="name"
                  item-value="value"
                  label="*遊戲類別"
                  hint="*必填選項"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  v-model="edit_data.gamelobby_name"
                  :items="lobbyType"
                  :rules="[FV.required]"
                  item-text="name"
                  item-value="value"
                  label="*娛樂城"
                  hint="*必填選項"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-switch
                  v-model="edit_data.game_switch"
                  color="primary"
                  label="遊戲開關"
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*為必填選項</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="editDialog = false"
          >關閉</v-btn
        >
        <v-btn color="blue darken-1" flat @click="callEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidation from '~/plugins/form_validation.js'

export default {
  props: {
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
    }
  },
  data() {
    return {
      editDialog: false,
      edit_data: {},
      FV: formValidation.rules
    }
  },
  methods: {
    selectRemove(item) {
      const index = this.edit_data.operate.indexOf(item.value)
      if (index >= 0) this.edit_data.operate.splice(index, 1)
    },
    callEdit() {
      if (this.$refs.form.validate()) {
        this.$emit('callEdit', this.edit_data)
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    },
    openEdit(data) {
      this.editDialog = true
      this.edit_data = data
    },
    closeEdit() {
      this.editDialog = false
      this.edit_data = {}
    }
  }
}
</script>
