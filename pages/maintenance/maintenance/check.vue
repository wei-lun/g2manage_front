<template>
  <v-dialog :value="checkdl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        維運確認
      </v-card-title>
      <v-card-text>
        確定要開站
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="parentPage" color="danger">關閉</v-btn>
        <v-btn color="success" @click="callCheck">確定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    checkData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      parentPage: '/maintenance/maintenance',
      check_data: {},
      checkdl: false
    }
  },
  created() {
    if (!Object.keys(this.checkData).length) {
      this.$router.push(this.parentPage)
    } else {
      this.checkdl = true
      this.check_data = JSON.parse(JSON.stringify(this.checkData))
      this.check_data.weekly_byday = this.check_data.byday
    }
  },
  methods: {
    callCheck() {
      const data = JSON.parse(JSON.stringify(this.check_data))
      this.$emit('callCheck', data)
    }
  }
}
</script>
