<template>
  <b-overlay :show="isLoading" rounded="sm" opacity="0.8">
    <b-container class="flex-column pt-5">
      <b-row class="mb-4 justify-content-center">
        <b-col class="text-center" cols="12" sm="4">
          <b-form-select
            v-model="selectedDistrict"
            :options="districts"
            value-field="district"
            text-field="bengali"
            class="mb-4"
            @change="onChangeDistrict"
          ></b-form-select>
          <b-card
            border-variant="primary"
            header-bg-variant="primary"
            :header="cardHeader"
            header-text-variant="white"
          >
            <b-card-text>
              <TimeComponent class="font-bold" />
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-4 justify-content-center">
        <b-col class="justify-content-center">
          <div class="ramadan-cards">
            <RamadanCard
              :title="seheriLabel"
              :time="getFormattedTime(seheriTime)"
              class="ramadan-card--seheri"
            >
              <CountDownTimer
                :destination-time="seheriTimerDateTime"
                @timeup="initTodaysRamadanData"
              />
            </RamadanCard>
            <RamadanCard
              :title="iftarLabel"
              :time="getFormattedTime(iftarTime)"
              class="ramadan-card--iftar"
            >
              <CountDownTimer
                :destination-time="iftartTimerDateTime"
                @timeup="initTodaysRamadanData"
              />
            </RamadanCard>
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
              :variant="
                selectedCalender === 'magfirat' ? 'primary' : 'secondary'
              "
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
              :items="formattedCalendar"
              stacked="md"
              :fields="tableFields"
              :tbody-tr-class="rowClass"
            ></b-table>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-overlay>
</template>

<script>
import GetSheetDone from 'get-sheet-done/dist/GetSheetDone'
import moment from 'moment'
import {
  daysOfTheWeekBengali,
  getFormattedTime,
  getFormattedDate,
  getFormattedNumber
} from '../util/helpers'
import TimeComponent from '@/components/TimeComponent'
import RamadanCard from '@/components/RamadanCard'
import CountDownTimer from '@/components/CountDownTimer'
export default {
  name: 'IndexPage',
  components: {
    TimeComponent,
    RamadanCard,
    CountDownTimer
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
      ],
      districts: [],
      selectedDistrict: localStorage.getItem('selectedDistrict')
        ? localStorage.getItem('selectedDistrict')
        : 'Dhaka District',
      sheetId: '1VueNvU-ipyjDhvKsU19nNlHkz70k6i5u5Rlnyz-TmE8',
      isLoading: false,
      seheriTimerDateTime: '',
      iftartTimerDateTime: ''
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
    },
    selectedDistrictData() {
      const selected = this.selectedDistrict
      if (selected) {
        return this.districts.find(
          (districtObject) => districtObject.district === selected
        )
      }
      return Object.create(null)
    },
    formattedCalendar() {
      return this.calenderToDisplay.map((dayObject) => {
        const objectToUpdate = JSON.parse(JSON.stringify(dayObject))
        objectToUpdate.iftar = getFormattedTime(objectToUpdate.iftar)
        objectToUpdate.suhoor = getFormattedTime(objectToUpdate.suhoor)
        objectToUpdate.day = daysOfTheWeekBengali(
          objectToUpdate.day.toLowerCase()
        )
        objectToUpdate.date = getFormattedDate(objectToUpdate.date)
        // to determine active date
        objectToUpdate.englishDate = dayObject.date
        objectToUpdate.ramadan = getFormattedNumber(objectToUpdate.ramadan)
        objectToUpdate.fajr = getFormattedTime(objectToUpdate.fajr)
        return objectToUpdate
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.isLoading = true
      setTimeout(() => {
        this.initRamadanTime().then(() => {
          this.initDistricts()
          this.initTodaysRamadanData().then(() => {
            this.isLoading = false
          })
        })
      }, 500)
    },
    initTodaysRamadanData() {
      this.initTodaysRamadanTime()
      return this.$nextTick().then(() => {
        return Promise.all([this.initSeheriTime(), this.initIftarTime()])
      })
    },
    initRamadanTime() {
      return GetSheetDone.labeledCols(this.sheetId).then((sheet) => {
        this.ramadanTime = sheet.data
      })
    },
    initDistricts() {
      return GetSheetDone.labeledCols(this.sheetId, 2).then((sheet) => {
        this.districts = sheet.data
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
    getComparisonTimes(time) {
      const ramadanTime = new Date(time).getTime()
      const currentTime = new Date().getTime()
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return {
        ramadanTime,
        currentTime,
        tomorrow,
        today
      }
    },
    initSeheriTime() {
      const {
        ramadanTime,
        currentTime,
        tomorrow,
        today
      } = this.getComparisonTimes(this.seheriDateTime)
      if (currentTime > ramadanTime) {
        const tomorrowsRamadanTime = this.getRamadanTime(tomorrow)
        const { suhoor } = tomorrowsRamadanTime
        this.seheriTime = suhoor
        this.seheriTimerDateTime = `${tomorrow.toLocaleDateString(
          'en'
        )} ${suhoor}`
        this.seheriLabel = 'আগামীকাল সাহ্‌রি'
      } else {
        const todaysRamadanTime = this.getRamadanTime(today)
        const { suhoor } = todaysRamadanTime
        this.seheriTime = suhoor
        this.seheriTimerDateTime = `${today.toLocaleDateString('en')} ${suhoor}`
        this.seheriLabel = 'আজকে সাহ্‌রি'
      }
    },
    initIftarTime() {
      const {
        ramadanTime,
        currentTime,
        tomorrow,
        today
      } = this.getComparisonTimes(this.iftarDateTime)
      if (currentTime > ramadanTime) {
        const tomorrowsRamadanTime = this.getRamadanTime(tomorrow)
        const { iftar } = tomorrowsRamadanTime
        this.iftarTime = iftar
        this.iftartTimerDateTime = `${tomorrow.toLocaleDateString(
          'en'
        )} ${iftar}`
        this.iftarLabel = 'আগামীকাল ইফতার'
      } else {
        const todaysRamadanTime = this.getRamadanTime(today)
        const { iftar } = todaysRamadanTime
        this.iftarTime = iftar
        this.iftartTimerDateTime = `${today.toLocaleDateString('en')} ${iftar}`
        this.iftarLabel = 'আজকে ইফতার'
      }
    },
    isActiveDate(date) {
      if (!this.todaysRamadanTime) return false
      return this.todaysRamadanTime.date === date
    },
    setCalender(type) {
      this.selectedCalender = type
    },
    rowClass(item) {
      if (this.isActiveDate(item.englishDate)) {
        return 'active'
      }
      return ''
    },
    onChangeDistrict(value) {
      localStorage.setItem('selectedDistrict', value)
      const { suhoor, iftar } = this.selectedDistrictData
      this.ramadanTime = this.ramadanTime.map((ramadanObject) => {
        const objectToUpdate = JSON.parse(JSON.stringify(ramadanObject))
        objectToUpdate.suhoor = moment(ramadanObject.suhoor, 'h:mm:ss A')
          .add(Number(suhoor), 'minutes')
          .format('LT')
        objectToUpdate.fajr = moment(ramadanObject.fajr, 'h:mm:ss A')
          .add(Number(suhoor), 'minutes')
          .format('LT')
        objectToUpdate.iftar = moment(ramadanObject.iftar, 'h:mm:ss A')
          .add(Number(iftar), 'minutes')
          .format('LT')
        return objectToUpdate
      })
      this.initTodaysRamadanData()
    },
    getFormattedTime
  }
}
</script>
