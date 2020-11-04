<template>
  <v-layout row justify-center>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{ text }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="danger" small @click="close">
            取消
          </v-btn>

          <v-btn color="success" small @click="confirmed">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      confirmDialog: false,
      data: null
    }
  },
  methods: {
    confirmDlg(data) {
      this.confirmDialog = true
      this.data = data
    },
    confirmed() {
      this.$emit('confirmed', this.data)
      this.confirmDialog = false
    },
    close() {
      this.confirmDialog = false
      this.data = null
    }
  }
}
</script>
