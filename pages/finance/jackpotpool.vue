<template>
  <v-layout row justify-center align-center>
    <v-flex xs10 md10 xg12>
      <v-card-title>
        彩池貢獻金
        <v-spacer></v-spacer>
        <div>
          <v-btn
            v-for="(buttondates, index) in monthday(buttondate)"
            :key="index"
            small
            class="mr-3"
            @click="monthbt(buttondates)"
          >
            {{
              buttondates.slice(5, 6) === '0'
                ? buttondates.slice(6) + '月'
                : buttondates.slice(5) + '月'
            }}
          </v-btn>
          <v-btn small @click="halfyear()">近半年</v-btn>
        </div>
      </v-card-title>
      <v-card v-if="sitestatusfilter.length > 0" class="pa-5 py-3 mb-5">
        <div class="row justify-center">
          <div class="col-12 px-5">
            您当前应缴金额有: $<span class="display-1">50</span>.6
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn class="px-0" x-small text v-on="on">
                  <v-icon dark small>mdi-help-circle</v-icon>
                </v-btn>
              </template>
              <span>
                <p
                  v-for="(toolarrays, index) in toolarray"
                  :key="index"
                  class="mb-0"
                >
                  {{ toolarrays.text }}
                </p>
              </span>
            </v-tooltip>
          </div>
          <div class="col-12">
            <template>
              <ve-bar
                :data="chartData"
                :settings="chartSettings"
                :theme="chartTheme"
                :extend="extend"
                :events="events"
                height="160px"
                class="mx-auto"
              ></ve-bar>
            </template>
          </div>
          <div class="col-12">
            <div class="d-sm-flex">
              <div class="mr-3 sm-mb-5 selectlist">
                <v-select
                  v-model="selectheader"
                  :items="selectarraytype"
                  label="娛樂城分類"
                  dense
                  solo
                  filled
                  item-text="text"
                  item-value="id"
                  @change="gameselect"
                ></v-select>
              </div>
              <v-btn
                v-for="(jackpottables, index) in jackpottable"
                :key="index"
                class="header_bt mr-3"
                @click="jackpotswitch(jackpottables.id, jackpottables.value)"
              >
                <span :class="{ 'text--disabled': !jackpottables.value }">
                  <v-badge
                    v-if="jackpottables.update"
                    color="red darken-2"
                    dot
                    offset-x="-3"
                  >
                    {{ jackpottables.text }}
                  </v-badge>
                  <div v-else>
                    {{ jackpottables.text }}
                  </div>
                </span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
      <v-data-table
        v-if="sitestatusfilter.length > 0"
        v-resize="onResize"
        :items="everydayarray"
        :headers="dayheaders"
        :options.sync="pagination"
        :class="{ 'd-none': !jackpottable[0].value }"
        class="mb-5 daysumtable"
      >
        <template v-slot:item="{ item }">
          <tr
            :class="{
              'v-data-table__mobile-table-row': windowSize.x < rwdsize
            }"
          >
            <td :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }">
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ dayheaders[0].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.id }}
              </div>
            </td>
            <td :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }">
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ dayheaders[1].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.date }}
              </div>
            </td>
            <td :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }">
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ dayheaders[2].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.contribution }}
              </div>
            </td>
            <td
              v-for="(gametypes, index) in gametype"
              :key="index"
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !gametypes.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ dayheaders[index + 3].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item[gametypes.text] }}
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:footer>
          <table>
            <tr
              :class="{
                'v-data-table__mobile-table-row': windowSize.x < rwdsize
              }"
            >
              <td
                v-if="windowSize.x > rwdsize"
                :width="dayheaders[0].width"
              ></td>
              <td
                :width="windowSize.x < rwdsize ? '' : dayheaders[1].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                總計
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : dayheaders[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'contribution') }}
              </td>
              <td
                v-for="(gametypes, index) in gametype"
                :key="index"
                :width="
                  windowSize.x < rwdsize ? '' : dayheaders[index + 3].width
                "
                :class="{
                  'v-data-table__mobile-row': windowSize.x < rwdsize,
                  'grey--text text--darken-2': !gametypes.showalone
                }"
              >
                {{
                  '$ ' + gamemothsum(sitestatusfilter, 'contribution', index)
                }}
              </td>
            </tr>
          </table>
        </template>
      </v-data-table>
      <v-alert v-else class="white--text" color="grey darken-3 text-center">
        無資料
      </v-alert>
      <v-data-table
        :items="casinosumarray"
        :headers="headers"
        :options.sync="pagination"
        :class="{ 'd-none': !jackpottable[1].value }"
        class="mb-5"
      >
        <template v-slot:item="{ item }">
          <tr
            :class="{
              'v-data-table__mobile-table-row': windowSize.x < rwdsize
            }"
          >
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[0].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.id }}
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[1].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.text }}
                <v-btn
                  class="ml-2"
                  depressed
                  x-small
                  @click="casinosumbt(item.id - 1, item.text, 'btn')"
                >
                  详细
                </v-btn>
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[2].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.contribution }}
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[3].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.bonus }}
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[4].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.pay }}
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[5].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.profit_loss }}
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[5].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.bet }}
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[6].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.amount }}
              </div>
            </td>
            <td
              :class="{
                'v-data-table__mobile-row': windowSize.x < rwdsize,
                'grey--text text--darken-2': !item.showalone
              }"
            >
              <div
                v-if="windowSize.x < rwdsize"
                class="v-data-table__mobile-row__header"
              >
                {{ headers[7].text }}
              </div>
              <div
                :class="{
                  'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                }"
              >
                {{ item.member }}
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:footer>
          <table>
            <tr
              :class="{
                'v-data-table__mobile-table-row': windowSize.x < rwdsize
              }"
            >
              <td v-if="windowSize.x > rwdsize" :width="headers[0].width"></td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[1].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                總計
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'contribution') }}
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'bonus') }}
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'pay') }}
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'profit_loss') }}
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'amount') }}
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'bet') }}
              </td>
              <td
                :width="windowSize.x < rwdsize ? '' : headers[2].width"
                :class="{ 'v-data-table__mobile-row': windowSize.x < rwdsize }"
              >
                {{ '$ ' + allsum(sitestatusfilter, 'member') }}
              </td>
            </tr>
          </table>
        </template>
      </v-data-table>
      <div :class="{ 'd-none': !jackpottable[2].value }">
        <v-data-table
          :items="gamekindsum(sitestatusfilter, onlygametype, 'null')"
          :headers="headersmore(onlygametype)"
          :class="{ 'd-none': gamestatistics[1].value }"
          class="mb-5"
        >
          <template v-slot:footer>
            <table>
              <tr
                v-for="(items, index) in gamekindsum(
                  sitestatusfilter,
                  onlygametype,
                  'sum'
                )"
                :key="index"
                :class="{
                  'v-data-table__mobile-table-row': windowSize.x < rwdsize
                }"
              >
                <td
                  v-if="windowSize.x > rwdsize"
                  :width="headersmore(onlygametype)[0].width"
                ></td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[1].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  總計
                </td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[2].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ headersmore(onlygametype)[2].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + items.contributionsum }}
                  </div>
                </td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[3].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ headersmore(onlygametype)[3].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + items.bonussum }}
                  </div>
                </td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[4].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ headersmore(onlygametype)[4].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + items.paysum }}
                  </div>
                </td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[5].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ headersmore(onlygametype)[5].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + items.profit_losssum }}
                  </div>
                </td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[6].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ headersmore(onlygametype)[6].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + items.amountsum }}
                  </div>
                </td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[7].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ headersmore(onlygametype)[7].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + items.betsum }}
                  </div>
                </td>
                <td
                  :width="
                    windowSize.x < rwdsize
                      ? ''
                      : headersmore(onlygametype)[8].width
                  "
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ headersmore(onlygametype)[8].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ items.membersum }}
                  </div>
                </td>
              </tr>
            </table>
          </template>
        </v-data-table>
        <v-data-table
          :items="gamelistall"
          :headers="gameheaders"
          :class="{ 'd-none': gamestatistics[0].value }"
          class="mb-5"
        >
          <template v-slot:footer>
            <table>
              <tr
                :class="{
                  'v-data-table__mobile-table-row': windowSize.x < rwdsize
                }"
              >
                <td
                  v-if="windowSize.x > rwdsize"
                  :width="gameheaders[0].width"
                ></td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[1].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  總計
                </td>
                <td
                  v-if="windowSize.x > rwdsize"
                  :width="gameheaders[2].width"
                ></td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[3].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ gameheaders[1].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + allsum(sitestatusfilter, 'contribution') }}
                  </div>
                </td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[4].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ gameheaders[2].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + allsum(sitestatusfilter, 'bonus') }}
                  </div>
                </td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[5].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ gameheaders[3].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + allsum(sitestatusfilter, 'pay') }}
                  </div>
                </td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[6].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ gameheaders[4].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + allsum(sitestatusfilter, 'profit_loss') }}
                  </div>
                </td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[7].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ gameheaders[5].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + allsum(sitestatusfilter, 'amount') }}
                  </div>
                </td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[8].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ gameheaders[6].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + allsum(sitestatusfilter, 'bet') }}
                  </div>
                </td>
                <td
                  :width="windowSize.x < rwdsize ? '' : gameheaders[9].width"
                  :class="{
                    'v-data-table__mobile-row': windowSize.x < rwdsize
                  }"
                >
                  <div
                    v-if="windowSize.x < rwdsize"
                    class="v-data-table__mobile-row__header"
                  >
                    {{ gameheaders[7].text }}
                  </div>
                  <div
                    :class="{
                      'v-data-table__mobile-row__cell': windowSize.x < rwdsize
                    }"
                  >
                    {{ '$ ' + allsum(sitestatusfilter, 'member') }}
                  </div>
                </td>
              </tr>
            </table>
          </template>
        </v-data-table>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { jackpot } from '~/plugins/api_route'

export default {
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    },
    lobbyType: {
      type: Array,
      default() {
        return []
      }
    },
    siteName: {
      type: Array,
      default() {
        return []
      }
    },
    platformType: {
      type: Array,
      default() {
        return []
      }
    },
    websiteStatus: {
      type: Array,
      default() {
        return []
      }
    },
    datetime: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    this.chartSettings = {
      digit: 8,
      stack: {
        xxx: ['MG', 'PT', 'RG', 'BG', 'JPK']
      },
      label: {
        show: true
      }
    }
    this.chartTheme = {
      legend: {
        show: true,
        top: '0',
        textStyle: {
          color: '#FFF',
          fontSize: '16',
          padding: [0, 20, 0, 5]
        }
      }
    }
    return {
      selected: '',
      unit: {},
      extend: {
        color: ['#455a64', '#78909c', '#ff8a65', '#9ccc65', '#bcaaa4'],
        legend: {
          selected: {}
        },
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        textStyle: {
          textBorderColor: '#666',
          textBorderWidth: 2,
          textShadowColor: '#333',
          textShadowBlur: 2
        }
      },
      dataEmpty: true,
      allsumclass: false,
      allsumvaule: null,
      casinostatistics: false,
      conallsumtable: [],
      contributionsum: [],
      panel: [0, 1],
      disabled: false,
      readonly: false,
      flat: true,
      editData: {},
      search: '',
      sitestatus: [],
      sitestatusfilter: [],
      sitestatusday: [],
      sitestatusItem: [],
      totalItems: null,
      sort: {},
      pagination: {
        rowsPerPage: 0,
        sortBy: ['announce_code'],
        sortDesc: [false]
      },
      nodataheaders: [{ text: '', value: 'text', total: '' }],
      nodata: [{ text: '無資料', value: 'text', total: '' }],
      headers: [
        { text: '序号', value: 'id', total: '', width: '10%' },
        { text: '全部', value: 'gametype', total: '', width: '15%' },
        { text: '贡献金', value: 'contribution', total: '', width: '10%' },
        { text: '彩池奖金', value: 'bonus', total: '', width: '10%' },
        { text: '应缴金额', value: 'pay', total: '', width: '10%' },
        { text: '损益', value: 'profit_loss', total: '', width: '10%' },
        { text: '有效投注', value: 'bet', total: '', width: '10%' },
        { text: '投注单量', value: 'amount', total: '', width: '10%' },
        { text: '会员数', value: 'member', total: '', width: '10%' }
      ],
      singleheaders: [
        { text: '序号', value: 'id', total: '', sortable: false, width: '10%' },
        { text: '', value: 'gamename', total: '', width: '15%' },
        { text: '贡献金', value: 'contribution', total: '', width: '10%' },
        { text: '彩池奖金', value: 'bonus', total: '', width: '10%' },
        { text: '应缴金额', value: 'pay', total: '', width: '10%' },
        { text: '损益', value: 'profit_loss', total: '', width: '10%' },
        { text: '有效投注', value: 'bet', total: '', width: '10%' },
        { text: '投注单量', value: 'amount', total: '', width: '10%' },
        { text: '会员数', value: 'member', total: '', width: '10%' }
      ],
      gameheaders: [
        { text: '序号', value: 'id', total: '', sortable: false, width: '10%' },
        { text: '娛樂城', value: 'gametype', total: '', width: '10%' },
        { text: '遊戲', value: 'gamename', total: '', width: '10%' },
        { text: '贡献金', value: 'contribution', total: '', width: '10%' },
        { text: '彩池奖金', value: 'bonus', total: '', width: '10%' },
        { text: '应缴金额', value: 'pay', total: '', width: '10%' },
        { text: '损益', value: 'profit_loss', total: '', width: '10%' },
        { text: '有效投注', value: 'bet', total: '', width: '10%' },
        { text: '投注单量', value: 'amount', total: '', width: '10%' },
        { text: '会员数', value: 'member', total: '', width: '10%' }
      ],
      dayheaders: [],
      buttondate: [],
      percentagecolor: [
        {
          color: 'blue-grey darken-2'
        },
        {
          color: 'blue-grey lighten-1'
        },
        {
          color: 'deep-orange lighten-2'
        },
        {
          color: 'blue-grey darken-2'
        }
      ],
      toolarray: [
        {
          text:
            '1.当月累积彩金 (贡献金) 折抵当月彩池奖金 = 负数(则在当月报表扣除)',
          value: ''
        },
        {
          text: '2.当月累积彩金 (贡献金) 折抵当月彩池奖金 = 正数(则需缴纳费用)',
          value: ''
        },
        {
          text: '3.當前資料統計至前一天',
          value: ''
        }
      ],
      thismoth: false,
      dl_status: null,
      dialog: false,
      gametype: [],
      gamelistall: [],
      gametypesum: [],
      jackpottable: [
        { id: 1, text: '每日统计', value: true, update: false },
        { id: 2, text: '娱乐城统计', value: false, update: false },
        { id: 3, text: '游戏统计', value: false, update: false }
      ],
      gamestatistics: [
        { text: '全部顯示', switch: 'open', value: false, button: false },
        { text: '單個顯示', switch: 'close', value: true }
      ],
      selectheader: {
        text: '娛樂城分類'
      },
      dailystatistics: false,
      onlyonegamesum: [],
      onlygametype: [],
      thismontharray: [],
      thismonthstyle: false,
      selectmonthstyle: null,
      selectarraytype: [],
      everydayarray: [],
      casinosumarray: [],
      windowSize: { x: 0, y: 0 },
      rwdsize: 600,
      test: [],
      test2: []
    }
  },
  watch: {
    pagination: {
      handler() {
        this.sort.order_by =
          !!this.pagination.sortBy[0] === true ? this.pagination.sortBy[0] : ''
        this.sort.sort = !!this.pagination.sortDesc[0] === true ? 'DESC' : 'ASC'
        this.init()
      }
    }
  },
  created() {
    this.chartData = {
      columns: [],
      rows: []
    }
    this.events = {
      legendselectchanged: (v) => {
        this.selected = v.name
        this.chartSettings.yAxisName = [this.unit[v.name]]
        this.changeSelect(v.name)
        this.gameselect(v.name)
      }
    }
  },
  mounted() {
    this.onResize()
  },
  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    changeSelect(name) {
      const selected = {}
      Object.keys(this.unit).forEach((key) => {
        selected[key] = false
      })
      selected[name] = true
      this.extend.legend.selected = selected
    },
    allchangeSelect() {
      const selected = {}
      Object.keys(this.unit).forEach((key) => {
        selected[key] = true
      })
      this.extend.legend.selected = selected
    },
    dailyarray(array) {
      const dayarraylist = []
      for (let i = 0; i < array.length; i++) {
        dayarraylist.push({
          id: array[i].id,
          date: array[i].date,
          contribution: ''
        })
      }
      for (let j = 0; j < array.length; j++) {
        for (let i = 0; i < this.gametype.length; i++) {
          dayarraylist[j][this.gametype[i].text] =
            '$ ' + array[j].jackpot[i].contribution
        }
      }
      let oneday = 0
      for (let j = 0; j < array.length; j++) {
        for (let i = 0; i < this.gametype.length; i++) {
          oneday += parseFloat(array[j].jackpot[i].contribution)
        }
        dayarraylist[j].contribution = '$ ' + oneday.toFixed(2)
        oneday = 0
      }
      this.everydayarray = dayarraylist
    },
    casinosumarr(data) {
      const casino = []
      const array = this.sitestatusfilter
      for (let j = 0; j < this.gametype.length; j++) {
        casino.push({
          id: j + 1,
          text: this.gametype[j].text,
          contribution: '',
          bonus: '',
          pay: '',
          profit_loss: '',
          bet: '',
          amount: '',
          member: '',
          showalone: true
        })
      }
      let consum = 0
      for (let i = 0; i < this.gametype.length; i++) {
        for (let j = 0; j < array.length; j++) {
          consum += parseFloat(array[j].jackpot[i].contribution)
        }
        casino[i].contribution = '$ ' + consum.toFixed(2)
        consum = 0
      }
      let bonussum = 0
      for (let i = 0; i < this.gametype.length; i++) {
        for (let j = 0; j < array.length; j++) {
          bonussum += parseFloat(array[j].jackpot[i].contribution)
        }
        casino[i].bonus = '$ ' + bonussum.toFixed(2)
        bonussum = 0
      }
      let paysum = 0
      for (let i = 0; i < this.gametype.length; i++) {
        for (let j = 0; j < array.length; j++) {
          paysum += parseFloat(array[j].jackpot[i].contribution)
        }
        casino[i].pay = '$ ' + paysum.toFixed(2)
        paysum = 0
      }
      let losssum = 0
      for (let i = 0; i < this.gametype.length; i++) {
        for (let j = 0; j < array.length; j++) {
          losssum += parseFloat(array[j].jackpot[i].contribution)
        }
        casino[i].profit_loss = '$ ' + losssum.toFixed(2)
        losssum = 0
      }
      let betsum = 0
      for (let i = 0; i < this.gametype.length; i++) {
        for (let j = 0; j < array.length; j++) {
          betsum += parseFloat(array[j].jackpot[i].contribution)
        }
        casino[i].bet = '$ ' + betsum.toFixed(2)
        betsum = 0
      }
      let amountsum = 0
      for (let i = 0; i < this.gametype.length; i++) {
        for (let j = 0; j < array.length; j++) {
          amountsum += parseFloat(array[j].jackpot[i].contribution)
        }
        casino[i].amount = '$ ' + amountsum.toFixed(2)
        amountsum = 0
      }
      let membersum = 0
      for (let i = 0; i < this.gametype.length; i++) {
        for (let j = 0; j < array.length; j++) {
          membersum += parseFloat(array[j].jackpot[i].contribution)
        }
        casino[i].member = membersum.toFixed(2)
        membersum = 0
      }
      if (data !== '') {
        this.casinosumarray = casino
      }
    },
    flatbt(data) {
      if (this.panel.length < 2) {
        return false
      } else {
        return true
      }
    },
    gameselect(data) {
      const id = this.gametype
        .map(function(item, index) {
          return item.text
        })
        .indexOf(data)
      const color = []
      if (id < 0) {
        this.openchart()
      } else {
        color.push(this.gametype[id].color)
        this.closechart(id, data, color)
        this.casinosumbt(id, data, '')
        for (let i = 0; i < this.jackpottable.length; i++) {
          this.jackpottable[i].update = true
        }
      }
      if (data === '全部') {
        this.allchangeSelect()
        this.casinosumbt(id, data, '')
      } else {
        this.changeSelect(data)
      }
    },
    selectarray(array) {
      const header = { text: '全部' }
      this.selectarraytype.push(header)
      for (let i = 0; i < array.length; i++) {
        this.selectarraytype[i + 1] = array[i]
      }
    },
    jackpotswitch(id, data) {
      for (let i = 0; i < this.jackpottable.length; i++) {
        this.jackpottable[i].value = false
      }
      this.jackpottable[id - 1].value = !data
      this.jackpottable[id - 1].update = false
    },
    monthbt(data) {
      const array = this.sitestatus
      const filtermoment = array.filter(function(item, index, array) {
        return item.date.slice(0, 7) === data
      })
      if (filtermoment.length > 0) {
        this.sitestatusfilter = filtermoment
        this.gametypelist(filtermoment)
        this.gamekindsum(filtermoment)
        this.gameliststatistics(filtermoment)
        this.dailyarray(filtermoment)
        this.casinosumarr(filtermoment)
      } else {
        this.sitestatusfilter = ''
        for (let i = 0; i < this.jackpottable.length; i++) {
          this.jackpottable[i].value = false
        }
        this.jackpottable[0].value = true
      }
      this.selectmonthstyle = data
      this.allchangeSelect()
      this.gameselect('全部')
    },
    halfyear() {
      const moment = require('moment')
      const todaymonth = moment()
        .month(moment().month() - 6)
        .format('YYYY-MM')
      const filtermoment = this.sitestatus.filter(function(item, index, array) {
        return item.date.slice(0, 7) >= todaymonth
      })
      if (filtermoment.length > 0) {
        this.sitestatusfilter = filtermoment
        this.gametypelist(filtermoment)
        this.gamekindsum(filtermoment)
        this.gameliststatistics(filtermoment)
        this.dailyarray(filtermoment)
        this.casinosumarr(filtermoment)
      } else {
        this.sitestatusfilter = ''
      }
      this.gameselect('全部')
    },
    monthlist(array) {
      const thismonth = this.thismontharray
      const filtermoment = array.filter(function(item, index, array) {
        return item.date.slice(0, 7) === thismonth
      })
      for (let i = 0; i < filtermoment.length; i++) {
        filtermoment[i].sort = i + 1
        for (let j = 0; j < this.gametype.length; j++) {
          filtermoment[i].jackpot[j].csort = j + 1
        }
      }
      this.sitestatusfilter = filtermoment
      const daylist = {}
      for (let i = 0; i < filtermoment.length; i++) {
        daylist.data = filtermoment[i].id
        daylist.date = filtermoment[i].date
      }
    },
    headersmore(data) {
      const header = this.singleheaders
      header[1].text = data
      return header
    },
    gamemothsum(array, name, index) {
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += parseFloat(array[i].jackpot[index][name])
      }
      return parseFloat(sum.toFixed(2))
    },
    allsum(array, name) {
      const sumarray = []
      for (let j = 0; j < this.gametype.length; j++) {
        let sum = 0
        for (let i = 0; i < array.length; i++) {
          sum += parseFloat(array[i].jackpot[j][name])
        }
        sumarray.push(parseFloat(sum.toFixed(2)))
      }
      let sumall = 0
      for (let i = 0; i < sumarray.length; i++) {
        sumall += parseFloat(sumarray[i])
      }
      return parseFloat(sumall.toFixed(2))
    },
    goldsum(id) {
      const array = this.sitestatus
      const typelength = this.gametype
      const conarray = []
      for (let i = 0; i < typelength.length; i++) {
        conarray[i] = array[id - 1].jackpot[i].contribution
      }
      let sum = 0
      for (let i = 0; i < conarray.length; i++) {
        sum += parseFloat(conarray[i])
      }
      return parseFloat(sum.toFixed(2))
    },
    gamesum(date) {
      const array = this.sitestatus
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += parseFloat(array[i].jackpot[date].contribution)
      }
      return parseFloat(sum.toFixed(2))
    },
    gameliststatistics(array) {
      const gamejackpotarray = []
      for (let j = 0; j < this.gametype.length; j++) {
        for (let i = 0; i < array.length; i++) {
          gamejackpotarray.push(array[i].jackpot[j])
        }
      }
      for (let i = 0; i < gamejackpotarray.length; i++) {
        gamejackpotarray[i].id = i + 1
      }
      this.gamelistall = gamejackpotarray
    },
    day(data) {
      const day = data.slice(0, 10)
      return day
    },
    monthday(array) {
      const moment = require('moment')
      const month = parseInt(moment().format('MM'))
      const year = parseInt(moment().format('YYYY'))
      const buttondate = []
      for (let i = 0; i < 6; i++) {
        if (parseInt(month - i) <= 0) {
          if (parseInt(month - i + 12).toString().length < 2) {
            buttondate[i] =
              parseInt(year - 1) + '-' + '0' + parseInt(month - i + 12)
          } else {
            buttondate[i] = parseInt(year - 1) + '-' + parseInt(month - i + 12)
          }
        } else if (parseInt(month - i) > 0) {
          if (parseInt(month - i).toString().length < 2) {
            buttondate[i] = year + '-' + '0' + parseInt(month - i)
          } else {
            buttondate[i] = year + '-' + parseInt(month - i)
          }
        }
      }
      return buttondate
    },
    closechart(id, data, color) {
      for (let i = 0; i < this.dayheaders.length; i++) {
        this.dayheaders[i].class = 'grey--text text--darken-2'
      }
      for (let i = 0; i < 3; i++) {
        this.dayheaders[i].class = ''
      }
      const header = parseInt(id + 3)
      this.dayheaders[header].class = ''
      this.onlygametype = data
      this.allsumclass = true
      this.allsumvaule = data
      for (let i = 0; i < this.gametype.length; i++) {
        this.gametype[i].show = false
        this.gametype[i].buttonbg = false
        this.gametype[i].showalone = false
      }
      this.gametype[id].showalone = true
      this.gametype[id].show = true
      this.gametype[id].buttonbg = true
      this.gamestatistics[0].value = true
      this.gamestatistics[1].value = false
      this.selectheader = this.selectarraytype.find(
        (item) => item.text === data
      )
    },
    casinosumbt(id, data, num) {
      if (id >= 0) {
        for (let i = 0; i < this.gametype.length; i++) {
          this.casinosumarray[i].showalone = false
        }
        this.casinosumarray[id].showalone = true
      }
      if (num !== '') {
        this.gameselect(data)
        this.jackpottable[1].value = false
        this.jackpottable[2].value = true
      }
      if (data === '全部') {
        for (let i = 0; i < this.gametype.length; i++) {
          this.casinosumarray[i].showalone = true
        }
      }
    },
    openchart() {
      for (let i = 0; i < this.dayheaders.length; i++) {
        this.dayheaders[i].class = ''
      }
      for (let i = 0; i < this.gametype.length; i++) {
        this.gametype[i].show = true
        this.gametype[i].buttonbg = true
        this.gametype[i].showalone = true
      }
      this.gamestatistics[0].value = false
      this.gamestatistics[1].value = true
      this.onlygametype = this.gametype[0].text
      this.allsumvaule = null
      this.selectheader = '全部'
    },
    gamekindsum(array, data, text) {
      const gamename = []
      const result = this.gametype
        .map(function(item, index) {
          return item.text
        })
        .indexOf(data)
      const name = result
      if (name >= 0)
        for (let i = 0; i < array.length; i++) {
          gamename.push({
            gamename: array[i].jackpot[name].gamename,
            contribution: array[i].jackpot[name].contribution,
            bonus: array[i].jackpot[name].bonus,
            pay: array[i].jackpot[name].pay,
            profit_loss: array[i].jackpot[name].profit_loss,
            amount: array[i].jackpot[name].amount,
            bet: array[i].jackpot[name].bet,
            member: array[i].jackpot[name].member
          })
        }
      const set = new Set()
      const filteredrepeat = gamename.filter((item) =>
        !set.has(item.gamename) ? set.add(item.gamename) : false
      )
      const gamenamelist = []
      for (let i = 0; i < filteredrepeat.length; i++) {
        gamenamelist[i] = filteredrepeat[i].gamename
      }
      const gamearray = []
      for (let i = 0; i < gamenamelist.length; i++) {
        const filteredarray = gamename.filter(function(item) {
          return item.gamename === gamenamelist[i]
        })
        let contributiosum = 0
        let bonussum = 0
        let paysum = 0
        let profitsum = 0
        let amountsum = 0
        let betsum = 0
        let membersum = 0
        for (let i = 0; i < filteredarray.length; i++) {
          contributiosum += parseFloat(filteredarray[i].contribution)
          bonussum += parseFloat(filteredarray[i].bonus)
          paysum += parseFloat(filteredarray[i].pay)
          profitsum += parseFloat(filteredarray[i].profit_loss)
          amountsum += parseFloat(filteredarray[i].amount)
          betsum += parseFloat(filteredarray[i].bet)
          membersum += parseFloat(filteredarray[i].member)
        }
        gamearray.push({
          id: parseInt(i + 1),
          gamename: gamenamelist[i],
          contribution: parseFloat(contributiosum.toFixed(3)),
          bonus: parseFloat(bonussum.toFixed(3)),
          pay: parseFloat(paysum.toFixed(3)),
          profit_loss: parseFloat(profitsum.toFixed(3)),
          amount: parseFloat(amountsum.toFixed(3)),
          bet: parseFloat(betsum.toFixed(3)),
          member: parseFloat(membersum.toFixed(3))
        })
      }
      const gamearraysum = []
      let arraycontributiosum = 0
      let arraybonussum = 0
      let arraypaysum = 0
      let arrayprofitsum = 0
      let arrayamountsum = 0
      let arraybetsum = 0
      let arraymembersum = 0
      for (let i = 0; i < gamearray.length; i++) {
        arraycontributiosum += parseFloat(gamearray[i].contribution)
        arraybonussum += parseFloat(gamearray[i].bonus)
        arraypaysum += parseFloat(gamearray[i].pay)
        arrayprofitsum += parseFloat(gamearray[i].profit_loss)
        arrayamountsum += parseFloat(gamearray[i].amount)
        arraybetsum += parseFloat(gamearray[i].bet)
        arraymembersum += parseFloat(gamearray[i].member)
      }
      if (text === 'sum')
        gamearraysum.push({
          contributionsum: parseFloat(arraycontributiosum.toFixed(3)),
          bonussum: parseFloat(arraybonussum.toFixed(3)),
          paysum: parseFloat(arraypaysum.toFixed(3)),
          profit_losssum: parseFloat(arrayprofitsum.toFixed(3)),
          amountsum: parseFloat(arrayamountsum.toFixed(3)),
          betsum: parseFloat(arraybetsum.toFixed(3)),
          membersum: parseFloat(arraymembersum.toFixed(3))
        })

      if (text === 'null') return gamearray
      else if (text === 'sum') return gamearraysum
    },
    gametypelist(array) {
      const set = new Set()
      const gametype = array.filter((item) =>
        !set.has(item.jackpot.gametype) ? set.add(item.jackpot.gametype) : false
      )
      const gamejackpot = gametype[0].jackpot
      const type = []
      for (let i = 0; i < gamejackpot.length; i++) {
        type[i] = gametype[0].jackpot[i].gametype
      }
      const sumall = []
      for (let j = 0; j < type.length; j++) {
        let sum = 0
        for (let i = 0; i < array.length; i++) {
          sum += parseFloat(array[i].jackpot[j].contribution)
        }
        sumall.push(parseFloat(sum.toFixed(3)))
      }
      this.gametypesum = sumall
      let percentagesum = 0
      for (let i = 0; i < sumall.length; i++) {
        percentagesum += sumall[i]
      }
      this.contributionsum = parseFloat(percentagesum.toFixed(3))
      const percentage = []
      for (let i = 0; i < sumall.length; i++) {
        percentage.push(Math.round((sumall[i] / percentagesum) * 100))
      }
      const arraynew = []
      const poolscolorarray = [
        'blue-grey darken-2',
        'blue-grey lighten-1',
        'deep-orange lighten-2',
        'light-green lighten-1',
        'brown lighten-3'
      ]
      for (let i = 0; i < type.length; i++) {
        const poolscolor = poolscolorarray[i % poolscolorarray.length]
        arraynew.push({
          text: type[i],
          value: percentage[i],
          width: percentage[i],
          color: poolscolor,
          show: true,
          buttonbg: true,
          showalone: true
        })
      }
      this.onlygametype = arraynew[0].text
      this.gametype = arraynew
      const chartarray = []
      for (let i = 0; i < this.gametype.length; i++) {
        chartarray.push(arraynew[i].text)
      }
      chartarray.unshift('比例')
      this.chartData.columns = chartarray
      const chartlist = {}
      chartlist['比例'] = '比例: 100%'
      for (let i = 0; i < this.gametype.length; i++) {
        chartlist[chartarray[i + 1]] = this.gametype[i].value
      }
      const chartrows = []
      chartrows.push(chartlist)
      this.chartData.rows = chartrows
      this.unit = chartlist
      const header = []
      header.push(
        {
          text: '序号',
          value: 'id',
          total: '',
          width: '10%'
        },
        { text: '日期', value: 'date', total: '', width: '15%' },
        {
          text: '贡献金',
          value: 'contribution',
          total: '',
          width: '10%'
        }
      )
      for (let i = 0; i < arraynew.length; i++) {
        header.push({
          text: arraynew[i].text,
          value: arraynew[i].text,
          total: '',
          class: '',
          width: '10%'
        })
      }
      this.dayheaders = header
      this.selectarray(arraynew)
      return this.gametype
    },
    montharray() {
      const moment = require('moment')
      const year = moment().format('YYYY-')
      const month = moment().format('MM')
      const thismonth = []
      if (month.toString().length <= 1) thismonth[0] = '0' + month
      else thismonth[0] = month
      this.thismontharray = year + thismonth
    },
    async init() {
      const self = this
      await jackpot({
        ...this.filter,
        ...this.sort,
        page: this.pagination.page
      })
        .then(function(response) {
          self.sitestatus = response.data.data
        })
        .catch(function(error) {
          if (error) {
            if (error.response.status !== 401) {
              self.sitestatus = []
              self.$store.dispatch('alert/danger', error.response.data.message)
            }
            self.totalItems = 0
          }
        })
      this.montharray()
      this.monthlist(this.sitestatus)
      if (this.sitestatusfilter.length > 0) {
        this.gametypelist(this.sitestatusfilter)
        this.gamekindsum(this.sitestatusfilter)
        this.gameliststatistics(this.sitestatusfilter)
        this.dailyarray(this.sitestatusfilter)
        this.casinosumarr(this.sitestatusfilter)
      } else {
        this.sitestatusfilter = ''
      }
    }
  }
}
</script>
