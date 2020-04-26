<template>
  <b-container class="flex-column">
    <b-row class="mb-4">
      <b-col>
        <h3>রমজানের সময়সূচী ২০২০(হিজরি ১৪৪১)</h3>
        <h4>ঢাকা বিভাগ</h4>
        <h4 class="font-bold">{{ date }}</h4>
      </b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col>
        <b-card
          :title="seheriLabel"
          :img-src="sunrise"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem; min-width: 15rem"
          class="mb-2"
        >
          <b-card-text v-if="todaysRamadanTime">
            {{ seheriTime }}
          </b-card-text>
        </b-card>
      </b-col>
      <b-col>
        <b-card
          :title="iftarLabel"
          :img-src="sunset"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem; min-width: 15rem"
          class="mb-2"
        >
          <b-card-text v-if="todaysRamadanTime">
            {{ iftarTime }}
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3 class="pb-4">রমজানের ইফতারি ও সাহ্‌রির সময় সূচি</h3>
        <table class="table b-table table-striped table-hover">
          <thead class="border">
            <th class="px-4 py-2 border">Ramdan</th>
            <th class="px-4 py-2 border">Date</th>
            <th class="px-4 py-2 border">Day</th>
            <th class="px-4 py-2 border">Seheri</th>
            <th class="px-4 py-2 border">Iftar</th>
          </thead>
          <tbody>
            <tr v-for="(time, index) in rahmatDays" :key="index">
              <td class="border px-4 py-2">{{ time.ramadan }}</td>
              <td class="border px-4 py-2">{{ time.date }}</td>
              <td class="border px-4 py-2">{{ time.day }}</td>
              <td class="border px-4 py-2">{{ time.suhoor }}</td>
              <td class="border px-4 py-2">{{ time.iftar }}</td>
            </tr>
          </tbody>
          <tbody>
            <tr v-for="(time, index) in maghfiratDatys" :key="index">
              <td class="border px-4 py-2">{{ time.ramadan }}</td>
              <td class="border px-4 py-2">{{ time.date }}</td>
              <td class="border px-4 py-2">{{ time.day }}</td>
              <td class="border px-4 py-2">{{ time.suhoor }}</td>
              <td class="border px-4 py-2">{{ time.iftar }}</td>
            </tr>
          </tbody>
          <tbody>
            <tr v-for="(time, index) in nazatDays" :key="index">
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
// import moment from 'moment'
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
      todaysRamadanTime: null,
      seheriLabel: '',
      iftarLabel: ''
    }
  },
  computed: {
    date() {
      return new Date().toLocaleString('bn-BD')
    },
    seheriDateTime() {
      if (this.todaysRamadanTime) {
        return `${this.todaysRamadanTime.date} ${this.todaysRamadanTime.suhoor}`
      }
      return undefined
    },
    iftarDateTime() {
      if (this.todaysRamadanTime) {
        return `${this.todaysRamadanTime.date} ${this.todaysRamadanTime.iftar}`
      }
      return undefined
    },
    rahmatDays() {
      return this.ramadanTime.slice(0, 10)
    },
    maghfiratDatys() {
      return this.ramadanTime.slice(10, 20)
    },
    nazatDays() {
      return this.ramadanTime.slice(20)
    }
  },
  created() {
    this.initRamadanTime().then(() => {
      this.initTodaysRamadanTime()
      this.$nextTick(() => {
        this.initSeheriTime()
        this.initIftarTime()
      })
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
    initTodaysRamadanTime() {
      const today = new Date()
      this.todaysRamadanTime = this.getRamadanTime(today)
      return this.todaysRamadanTime
    },
    getRamadanTime(date) {
      const ramadanDate = new Date(date).toLocaleDateString()
      const ramadanTime = this.ramadanTime.find((timeObject) => {
        return new Date(timeObject.date).toLocaleDateString() === ramadanDate
      })
      return ramadanTime
    },
    initSeheriTime() {
      const ramadanDateTime = this.seheriDateTime
      const seheriTime = new Date(ramadanDateTime).getTime()
      const currentTime = new Date().getTime()
      if (currentTime > seheriTime) {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowsRamadanTime = this.getRamadanTime(tomorrow)
        const { suhoor } = tomorrowsRamadanTime
        this.seheriTime = suhoor
        this.seheriLabel = 'আগামীকাল সাহ্‌রি'
      } else {
        const todaysRamadanTime = this.getRamadanTime(new Date())
        const { suhoor } = todaysRamadanTime
        this.seheriTime = suhoor
        this.seheriLabel = 'আজকে সাহ্‌রি'
      }
    },
    initIftarTime() {
      const ramadanDateTime = this.iftarDateTime
      const iftarTime = new Date(ramadanDateTime).getTime()
      const currentTime = new Date().getTime()
      if (currentTime > iftarTime) {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowsRamadanTime = this.getRamadanTime(tomorrow)
        const { iftar } = tomorrowsRamadanTime
        this.iftarTime = iftar
        this.iftarLabel = 'আগামীকাল ইফতার'
      } else {
        const todaysRamadanTime = this.getRamadanTime(new Date())
        const { iftar } = todaysRamadanTime
        this.iftarTime = iftar
        this.iftarLabel = 'আজকে ইফতার'
      }
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
