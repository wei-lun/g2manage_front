<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        取消維護
      </v-card-title>
      <v-card-text>
        確定要取消？
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="parentPage" color="danger">關閉</v-btn>
        <v-btn color="success" @click="callCancel">確定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    editData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      parentPage: '/maintenance/maintenance',
      edit_data: {},
      dl: false,
      valid: {
        1: { start_date: '', end_date: '' }
      }
    }
  },
  created() {
    if (!Object.keys(this.editData).length) {
      this.$router.push(this.parentPage)
    } else {
      this.dl = true
      this.edit_data = JSON.parse(JSON.stringify(this.editData))
    }
  },
  methods: {
    callCancel() {
      const editData = JSON.parse(JSON.stringify(this.edit_data))

      editData.status = 'cancel'

      delete editData.start_date
      delete editData.end_date
      delete editData.website
      delete editData.id
      delete editData.weekly_byday
      delete editData.monyhly_byday
      delete editData.byday
      delete editData.execution_status
      delete editData.last_end_date

      this.$emit('callCancel', editData)
    }
  }
}
</script>
