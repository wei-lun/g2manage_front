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
                  v-model="edit_data.game_type_id"
                  :rules="[FV.required, FV.alpha_num]"
                  label="*類別代號"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.game_type"
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
        <v-btn color="blue darken-1" text @click="editDialog = false"
          >關閉</v-btn
        >
        <v-btn color="blue darken-1" text @click="callEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidation from '~/plugins/form_validation.js'

export default {
  props: {},
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
