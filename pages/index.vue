<template>
  <b-container class="flex-column mt-4">
    <b-row class="mb-4">
      <b-col class="text-center">
        <h4>ঢাকা বিভাগ</h4>
        <TimeComponent class="font-bold" />
      </b-col>
    </b-row>
    <b-row class="mb-4 justify-content-center">
      <b-col class="justify-content-center">
        <div class="ramadan-cards">
          <b-card
            :title="seheriLabel"
            img-alt="Image"
            img-top
            border-variant="primary"
            header-bg-variant="primary"
            header-text-variant="white"
            tag="article"
            class="mb-2 ramadan-card ramadan-card--seheri"
          >
            <b-card-text v-if="todaysRamadanTime">
              {{ seheriTime }}
            </b-card-text>
          </b-card>
          <b-card
            :title="iftarLabel"
            border-variant="primary"
            header-bg-variant="primary"
            header-text-variant="white"
            tag="article"
            class="mb-2 ramadan-card ramadan-card--iftar"
          >
            <b-card-text v-if="todaysRamadanTime">
              {{ iftarTime }}
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <b-row class="justify-content-center text-center">
      <b-col>
        <h3 class="pb-2">রমজানের ইফতারি ও সাহ্‌রির সময় সূচি</h3>
        <div class="pb-4 table-filter">
          <b-badge
            href="#"
            :variant="selectedCalender === 'rahmat' ? 'primary' : 'secondary'"
            @click.prevent="setCalender('rahmat')"
            >রহমত</b-badge
          >
          <b-badge
            href="#"
            :variant="selectedCalender === 'magfirat' ? 'primary' : 'secondary'"
            @click.prevent="setCalender('magfirat')"
            >মাগফিরাত</b-badge
          >
          <b-badge
            href="#"
            :variant="selectedCalender === 'nazat' ? 'primary' : 'secondary'"
            @click.prevent="setCalender('nazat')"
            >নাজাত</b-badge
          >
          <b-badge
            href="#"
            :variant="selectedCalender === '' ? 'primary' : 'secondary'"
            @click.prevent="setCalender('')"
            >সম্পূর্ণ সময়সূচী</b-badge
          >
        </div>
        <div class="card">
          <b-table
            :items="calenderToDisplay"
            stacked="md"
            :fields="tableFields"
            :tbody-tr-class="rowClass"
          ></b-table>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import GetSheetDone from 'get-sheet-done/dist/GetSheetDone'
// import moment from 'moment'
import TimeComponent from '@/components/TimeComponent'
// import RamadanCard from '@/components/RamadanCard'
export default {
  name: 'IndexPage',
  components: {
    TimeComponent
  },
  data() {
    return {
      ramadanTime: [],
      iftarTime: null,
      seheriTime: null,
      todaysRamadanTime: null,
      seheriLabel: '',
      iftarLabel: '',
      selectedCalender: 'rahmat',
      displayType: 'card',
      tableFields: [
        {
          key: 'ramadan',
          label: 'রমজান'
        },
        {
          key: 'date',
          label: 'তারিখ'
        },
        {
          key: 'day',
          label: 'বার'
        },
        {
          key: 'suhoor',
          label: 'সাহ্‌রি'
        },
        {
          key: 'iftar',
          label: 'ইফতার'
        }
      ]
    }
  },
  computed: {
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
    magfiratDatys() {
      return this.ramadanTime.slice(10, 20)
    },
    nazatDays() {
      return this.ramadanTime.slice(20)
    },
    calenderToDisplay() {
      if (this.selectedCalender === 'rahmat') return this.rahmatDays
      if (this.selectedCalender === 'magfirat') return this.magfiratDatys
      if (this.selectedCalender === 'nazat') return this.nazatDays
      return this.ramadanTime
    },
    cardHeader() {
      return this.todaysRamadanTime
        ? Number(this.todaysRamadanTime.ramadan)
            .toLocaleString('bn')
            .padStart(2, '০') + ' রমজান'
        : ''
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
    },
    isEven(num) {
      return num % 2 === 0
    },
    isActiveDate(date) {
      if (!this.todaysRamadanTime) return false
      return this.todaysRamadanTime.date === date
    },
    setCalender(type) {
      this.selectedCalender = type
    },
    rowClass(item) {
      const itemIndex = this.ramadanTime.findIndex((ramadanObject) => {
        return ramadanObject.date === item.date
      })

      if (this.isActiveDate(item.date)) {
        return 'active'
      }
      if (this.isEven(itemIndex)) {
        return 'table-secondary'
      }
      return ''
    }
  }
}
</script>
