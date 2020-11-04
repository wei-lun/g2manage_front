<template>
  <v-container align-content-center justify-center fluid>
    <template>
      <v-tabs
        v-if="
          !!submenu &&
            submenu.child.find((item) => item.to === $route.path) != undefined
        "
        color="blue darken-1"
        slider-color="primary"
        fixed-tabs
      >
        <template v-slot:default>
          <v-tab v-for="(n, index) in submenu.child" :key="index" :to="n.to">
            {{ n.title }}
          </v-tab>
        </template>
      </v-tabs>
    </template>
    <NuxtChild />
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    submenu() {
      return this.$store.state.menu.menulist.find(
        (item) => item.id === 'multi_settings'
      )
    }
  },
  mounted() {},
  methods: {}
}
</script>
