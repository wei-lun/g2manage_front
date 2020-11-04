<template>
  <v-layout column justify-center align-center fill-height>
    <v-alert :value="true" color="error" dark>
      <v-layout column justify-center align-center>
        <svg width="90" height="90" fill="#DBE1EC" viewBox="0 0 48 48">
          <path
            d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
          ></path>
        </svg>
        <div class="title my-3">{{ message }}</div>
        <v-btn to="/" color="primary" small>回首頁</v-btn>
      </v-layout>
    </v-alert>
  </v-layout>
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
  name: 'NuxtError',
  components: {},
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      if (this.statusCode === 404) {
        return '此頁面不存在'
      }
      return this.error.message || `<%= messages.client_error %>`
    }
  },
  mounted() {},
  head() {
    return {
      title: this.message
    }
  }
}
</script>
