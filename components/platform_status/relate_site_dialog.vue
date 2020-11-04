<template>
  <div>
    <v-btn color="primary" small @click="RelateDialog = !RelateDialog"
      >網址</v-btn
    >
    <v-dialog v-model="RelateDialog" dark persistent max-width="650px">
      <v-card>
        <v-card-title>
          相關網址
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-layout wrap>
                  <v-text-field
                    v-model="sitestatus.management_frontdesk"
                    label="管端網址前台"
                    readonly
                  >
                  </v-text-field>
                  <v-btn
                    :href="sitestatus.management_frontdesk"
                    icon
                    target="_blank"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6>
                <v-layout wrap>
                  <v-text-field
                    v-model="sitestatus.management_background"
                    label="管端網址後台"
                    readonly
                  ></v-text-field>
                  <v-btn
                    :href="sitestatus.management_background"
                    icon
                    target="_blank"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6>
                <v-layout wrap>
                  <v-text-field
                    v-model="sitestatus.management_frontdesk_spare"
                    label="管端網址前台(備用)"
                    readonly
                  ></v-text-field>
                  <v-btn
                    :href="sitestatus.management_frontdesk_spare"
                    icon
                    target="_blank"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6>
                <v-layout wrap>
                  <v-text-field
                    v-model="sitestatus.management_background_spare"
                    label="管端網址後台(備用)"
                    readonly
                  ></v-text-field>
                  <v-btn
                    :href="sitestatus.management_background_spare"
                    icon
                    target="_blank"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="danger" @click="RelateDialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    sitestatus: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      RelateDialog: false
    }
  }
  /* methods: {
    CopyTextToClipboard(id) {
      const el = document.getElementById(id)
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      document.execCommand('copy')
      alert('已複製到剪貼簿!!')
    },
    copy() {
      const input = this.$refs.adminsiteurlsub
      const range = document.createRange()
      range.selectNodeContents(input)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      document.execCommand('copy')
      alert('已複製到剪貼簿!!')

      input.focus()
      document.execCommand('selectAll')
      this.copied = document.execCommand('copy') 
    }
  } */
}
</script>
