<template>
  <b-card
    :title="title"
    border-variant="primary"
    header-bg-variant="primary"
    header-text-variant="white"
    tag="article"
    class="mb-2 ramadan-card"
  >
    <b-card-text v-if="time">
      {{ time }}
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  props: {
    time: {
      type: String
    },
    title: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
.ramadan-card {
  max-width: 20rem;
  width: 15rem;
}
</style>
