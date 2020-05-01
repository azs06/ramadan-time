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
  >
    <b-card-text v-if="time">
      {{ time }}
      <slot></slot>
    </b-card-text>
  </b-card>
</template>

<script>
import { getTime } from '../util/helpers'
export default {
  props: {
    time: {
      type: String,
      default() {
        return getTime(new Date())
      }
    },
    title: {
      type: String,
      default() {
        return ''
      }
    }
  }
}
</script>
