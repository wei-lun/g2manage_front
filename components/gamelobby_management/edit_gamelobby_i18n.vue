<template>
  <v-dialog v-model="dialog" dark persistent max-width="650px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" v-on="on">
        更多語系
      </v-btn>
    </template>
    <v-card>
      <v-card-title> 多語系娛樂城名稱 </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container>
            <v-row>
              <v-col v-for="(val, id) in langList" :key="id" cols="4">
                <v-text-field
                  v-model="data[val.code]"
                  :label="val.text"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="danger" @click="dialog = false">關閉</v-btn>
        <v-btn color="success" @click="callEdit">儲存</v-btn>
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
      dialog: false,
      data: {},
      FV: formValidation.rules,
      langList: [
        { text: '繁體中文', code: 'cnt' },
        { text: '簡體中文', code: 'cn' },
        { text: 'english', code: 'en' },
        { text: 'id', code: 'id' }
      ]
    }
  },
  methods: {
    callEdit() {
      if (this.$refs.form.validate()) {
        // this.$emit('callEdit', this.edit_data)
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    },
    openEdit(data) {
      this.dialog = true
      this.data = data
    },
    closeEdit() {
      this.dialog = false
      this.data = {}
    }
  }
}
</script>
