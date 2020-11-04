<template>
  <v-flex xs12>
    <div>
      <v-combobox
        v-model="selectWeb"
        :items="websiteList"
        :label="label"
        :rules="[pickCheck]"
        counter="totalItems"
        chips
        multiple
        item-text="name"
      >
        <template v-slot:prepend-item>
          <v-text-field
            v-model="filter.search"
            class="input-height mx-3"
            height="30px"
            append-icon="mdi-magnify"
            flat
            clear-icon="mdi-close"
            clearable
            label="搜尋"
            hide-details
            @click:clear=";[delete filter.search, setFilter()]"
            @keyup.enter="setFilter()"
            @click:append="setFilter()"
          ></v-text-field>
        </template>
        <template v-slot:append-item>
          <pagination
            :total-items="totalItems"
            :pagination="pagination"
            :sort="sort"
            @fetch="website()"
          />
        </template>
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                搜尋不到資料
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </div>
  </v-flex>
</template>
<script>
import { websiteList } from '~/plugins/api_route'
import pagination from '~/components/pagination.vue'

export default {
  name: 'WebsitePicker',
  components: { pagination },
  props: {
    webList: {
      type: Array,
      default() {
        return []
      }
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      filter: {
        status: 'all'
      },
      sort: {},
      selectWeb: [],
      pagination: { rowsPerPage: 10, sortBy: [], sortDesc: [false] },
      totalItems: 0,
      sitestatus: [],
      websiteList: []
    }
  },
  computed: {
    pickCheck() {
      return this.selectWeb.length < 1 ? '請至少選擇一個站台' : true
    }
  },
  watch: {
    webList(val) {
      this.selectWeb = this.webList
    },
    selectWeb(val) {
      this.$emit('input', this.selectWeb)
    }
  },
  mounted() {
    this.website()
    this.selectWeb = this.webList
  },
  methods: {
    setFilter() {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.website()
      }
    },
    async website() {
      await websiteList({
        ...this.filter,
        ...this.sort,
        page: this.pagination.page
      })
        .then((response) => {
          this.sitestatus = response.data.data
          this.totalItems = response.data.meta.pagination.total
          this.websiteList = []
          for (let i = 0; i < this.sitestatus.length; i++) {
            this.websiteList.push({
              name: this.sitestatus[i].website_code,
              url:
                this.sitestatus[i].url.management_frontdesk +
                ',' +
                this.sitestatus[i].url.management_background
            })
          }
        })
        .catch((error) => {
          if (error) {
            this.sitestatus = []
            this.totalItems = 0
            this.websiteList = []
          }
        })
    }
  }
}
</script>
