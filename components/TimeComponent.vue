<template>
  <div>
    {{ date }}
  </div>
</template>

<script>
export default {
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
