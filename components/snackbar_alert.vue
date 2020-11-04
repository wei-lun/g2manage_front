<template>
  <v-snackbar
    v-model="isshow"
    :color="$store.state.alert.snackbar.status"
    :bottom="true"
    :right="true"
    :timeout="0"
  >
    {{ $store.state.alert.snackbar.text }}
    <v-btn text small @click="disableAlert()">
      關閉
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      isshow: false
    }
  },
  computed: {
    snackbar() {
      return this.$store.state.alert.snackbar
    }
  },
  watch: {
    'snackbar.isshow': {
      handler(newValue) {
        this.isshow = newValue
      }
    }
  },
  methods: {
    disableAlert() {
      this.$store.commit('alert/disableAlert')
    }
  }
}
</script>
