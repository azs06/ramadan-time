<template>
  <b-card
    :title="title"
    img-alt="Image"
    img-top
    border-variant="primary"
    header-bg-variant="primary"
    header-text-variant="white"
    tag="article"
    class="mb-2 ramadan-card"
    no-body
  >
    <b-card-body>
      <b-card-text v-if="time">
        {{ time }}
        <slot></slot>
      </b-card-text>
    </b-card-body>
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
