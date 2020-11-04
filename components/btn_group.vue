<template>
  <v-btn-toggle v-model="returnVal" mandatory color="blue lighten-1">
    <v-btn
      v-for="(item, index) in items"
      :key="index"
      :value="item[itemValue]"
      :small="small"
    >
      <span>{{ item[itemText] }}</span>
      <v-icon v-if="!!item.icon" left>{{ item.icon }}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ' '
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    items: {
      type: Array,
      default() {
        return []
      }
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      returnVal: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.init()
      },
      deep: true,
      immediate: true
    },
    returnVal: {
      handler(val) {
        this.outputData()
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    init() {
      if (this.value) this.returnVal = this.value
      else this.returnVal = 0
    },
    outputData() {
      if (this.returnVal === 0) this.$emit('input', '')
      else this.$emit('input', this.returnVal)
    }
  }
}
</script>
