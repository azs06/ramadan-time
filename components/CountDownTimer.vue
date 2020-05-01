<template>
  <p class="countdown-timer text-secondary">{{ countDownTimer }}</p>
</template>

<script>
export default {
  props: {
    destinationTime: {
      type: String,
      default() {
        return new Date().toDateString()
      }
    }
  },
  data() {
    return {
      countDownTimer: ''
    }
  },
  created() {
    const interval = setInterval(() => {
      this.countDownTimer = this.initCountDownTimer()
    }, 1000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(interval)
    })
  },
  methods: {
    initCountDownTimer() {
      const countDownDate = new Date(this.destinationTime).getTime()
      // Get today's date and time
      const now = new Date().getTime()
      // Find the distance between now and the count down date
      const distance = countDownDate - now
      // Time calculations for days, hours, minutes and seconds
      // const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      if (distance < 0) {
        this.$emit('timeup')
        return `00:00:00`
      }
      return `${String(hours).padStart(2, 0)}:${String(minutes).padStart(
        2,
        0
      )}:${String(seconds).padStart(2, 0)}`
    }
  }
}
</script>

<style></style>
