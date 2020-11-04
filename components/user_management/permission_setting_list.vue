<template>
  <div>
    <v-card
      v-if="readonly"
      class="pa-3 mb-2"
      width="100%"
      outlined
      @click="alert"
    >
      <v-layout wrap>
        <v-flex v-for="(val, index) in settingKeys" :key="index" sm6 xs12>
          <p class="text-left ma-0">{{ val }}</p>
          <v-slider
            v-model="settingTracks[val]"
            :tick-labels="['無權限', '唯讀', '寫入']"
            :track-color="propertys.trackColor"
            :track-fill-color="propertys.trackFillColor"
            :thumb-color="propertys.thumbColor"
            :readonly="readonly"
            min="0"
            max="2"
            ticks="always"
            tick-size="3"
          >
            <template v-if="readonly" v-slot:prepend>
              <v-icon color="grey darken-1" small>mdi-lock</v-icon>
            </template>
          </v-slider>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card v-else class="pa-3 mb-2" width="100%" outlined>
      <v-layout wrap>
        <v-flex v-for="(val, index) in settingKeys" :key="index" sm6 xs12>
          <p class="text-left ma-0">{{ val }}</p>
          <v-slider
            v-model="settingTracks[val]"
            :tick-labels="['無權限', '唯讀', '寫入']"
            :track-color="propertys.trackColor"
            :track-fill-color="propertys.trackFillColor"
            :thumb-color="propertys.thumbColor"
            :readonly="readonly"
            min="0"
            max="2"
            ticks="always"
            tick-size="3"
          >
            <template v-if="readonly" v-slot:prepend>
              <v-icon color="grey darken-1" small>mdi-lock</v-icon>
            </template>
          </v-slider>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      propertys: {},
      returnSettingObj: {},
      settingKeys: [],
      settingTracks: {}
    }
  },
  watch: {
    settingTracks: {
      handler(val) {
        this.outputData()
      },
      deep: true
      // immediate: true
    },
    value: {
      handler(val) {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (this.readonly) {
      this.propertys = {
        trackColor: 'grey darken-2',
        trackFillColor: 'grey darken-2',
        thumbColor: 'blue-grey darken-1'
      }
    }
  },
  methods: {
    init() {
      this.settingKeys = Object.keys(this.value)
      this.settingToTrack(this.value)
    },
    settingToTrack(setting) {
      this.settingKeys.forEach((index) => {
        if (setting[index].write) this.$set(this.settingTracks, index, 2)
        else if (setting[index].read) this.$set(this.settingTracks, index, 1)
        else this.$set(this.settingTracks, index, 0)
      })
    },
    trackToSetting(setting) {
      this.settingKeys.forEach((index) => {
        switch (setting[index]) {
          case 2:
            this.returnSettingObj[index] = {
              read: true,
              write: true
            }
            break
          case 1:
            this.returnSettingObj[index] = {
              read: true,
              write: false
            }
            break
          default:
            this.returnSettingObj[index] = {
              read: false,
              write: false
            }
            break
        }
      })
    },
    outputData() {
      this.trackToSetting(this.settingTracks)
      this.$emit('input', this.returnSettingObj)
    },
    alert() {
      if (this.readonly) {
        this.$store.dispatch('alert/danger', "如欲修改請至'角色權限編輯'")
      }
    }
  }
}
</script>
