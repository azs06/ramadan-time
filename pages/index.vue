<template>
  <b-container class="flex-column">
    <b-row class="mb-4">
      <b-col>
        <h6>Ramadan Time Table 2020, Hijri 1441 For Dhaka District</h6>
        <h4 class="font-bold">{{ date }}</h4>
      </b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col>
        <b-card
          title="আজকে সেহেরি"
          :img-src="sunrise"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem; min-width: 15rem"
          class="mb-2"
        >
          <b-card-text v-if="todaysRamadanTime">
            {{ todaysRamadanTime.suhoor }}
          </b-card-text>
        </b-card>
      </b-col>
      <b-col>
        <b-card
          title="আজকে ইফতার"
          :img-src="sunset"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem; min-width: 15rem"
          class="mb-2"
        >
          <b-card-text v-if="todaysRamadanTime">
            {{ todaysRamadanTime.iftar }}
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3 class="pb-4">রমজানের ইফতারি ও সেহেরির সময় সূচি</h3>
        <table class="table">
          <thead class="border">
            <th class="px-4 py-2 border">Ramdan</th>
            <th class="px-4 py-2 border">Date</th>
            <th class="px-4 py-2 border">Day</th>
            <th class="px-4 py-2 border">Seheri</th>
            <th class="px-4 py-2 border">Iftar</th>
          </thead>
          <tbody>
            <tr v-for="(time, index) in ramadanTime" :key="index">
              <td class="border px-4 py-2">{{ time.ramadan }}</td>
              <td class="border px-4 py-2">{{ time.date }}</td>
              <td class="border px-4 py-2">{{ time.day }}</td>
              <td class="border px-4 py-2">{{ time.suhoor }}</td>
              <td class="border px-4 py-2">{{ time.iftar }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import GetSheetDone from 'get-sheet-done/dist/GetSheetDone'
import moment from 'moment'
import sunrise from '@/assets/wi-sunrise.svg'
import sunset from '@/assets/wi-sunset.svg'
export default {
  name: 'IndexPage',
  data() {
    return {
      ramadanTime: [],
      sunrise,
      sunset,
      iftarTime: null,
      seheriTime: null,
      todaysRamadanTime: null
    }
  },
  computed: {
    date() {
      return new Date().toLocaleString('bn-BD')
    },
    seheriTitle() {
      const today = new Date()
      const todaysRamadanTime = this.todaysRamadanTime
      const ramadanDateTime = `${todaysRamadanTime.date} ${todaysRamadanTime.suhoor}`
      console.log(today)
      console.log(moment(ramadanDateTime))
      return ramadanDateTime
    },
    iftarTitle() {
      const today = new Date()
      const todaysRamadanTime = this.todaysRamadanTime
      const ramadanDateTime = `${todaysRamadanTime.date} ${todaysRamadanTime.iftar}`
      console.log(today)
      console.log(moment(ramadanDateTime))
      return ramadanDateTime
    }
  },
  created() {
    this.initRamadanTime().then(() => {
      this.getTodaysRamadanTime()
    })
  },
  methods: {
    initRamadanTime() {
      return GetSheetDone.labeledCols(
        '1VueNvU-ipyjDhvKsU19nNlHkz70k6i5u5Rlnyz-TmE8'
      ).then((sheet) => {
        this.ramadanTime = sheet.data
      })
    },
    getTodaysRamadanTime() {
      const today = new Date().toLocaleDateString()
      const ramadanTime = this.ramadanTime.find((timeObject) => {
        return new Date(timeObject.date).toLocaleDateString() === today
      })
      this.todaysRamadanTime = ramadanTime
      return ramadanTime
    },
    initSeheriTime() {
      const ramadanDateTime = this.todaysRamadanTime
      console.log(ramadanDateTime)
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
