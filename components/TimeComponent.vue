<template>
  <div>
    <h5>{{ date }}</h5>
  </div>
</template>

<script>
export default {
  props: {
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      date: null
    }
  },
  created() {
    const interval = setInterval(this.setDate, 1000)
    this.$once('hook:destroyed', () => {
      clearInterval(interval)
    })
  },
  methods: {
    setDate() {
      this.date = new Date().toLocaleString('bn-BD')
    }
  }
}
</script>

<style></style>
