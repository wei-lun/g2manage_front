<template>
  <v-dialog :value="finishdl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        維運完成
      </v-card-title>
      <v-card-text>
        確定已完成？
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="parentPage" color="danger">關閉</v-btn>
        <v-btn color="success" @click="callFinish">確定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    finishData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      parentPage: '/maintenance/maintenance',
      finish_data: {},
      finishdl: false
    }
  },
  created() {
    if (!Object.keys(this.finishData).length) {
      this.$router.push(this.parentPage)
    } else {
      this.finishdl = true
      this.finish_data = JSON.parse(JSON.stringify(this.finishData))
      this.finish_data.weekly_byday = this.finish_data.byday
    }
  },
  methods: {
    callFinish() {
      const finishData = JSON.parse(JSON.stringify(this.finish_data))

      finishData.execution_status = 'finish'
      finishData.last_end_date = moment()
        .add(1, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')
      finishData.maintenanc_type = finishData.maintenance_type

      delete finishData.byday
      delete finishData.cycle
      delete finishData.end_date
      delete finishData.note
      delete finishData.start_date
      delete finishData.status
      delete finishData.website
      delete finishData.weekly_byday
      delete finishData.maintenance_type

      this.$emit('callFinish', finishData)
      console.log(finishData)
    }
  }
}
</script>
