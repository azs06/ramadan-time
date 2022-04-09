<template>
  <main class="main-body">
    <div class="content-body">
      <div class="under-header-content bg-primary">
        <h3>
          রমজানের সময়সূচী
          {{ new Date().toLocaleDateString('bn').slice(-4) }} (হিজরি
          {{ arabicYear }})
        </h3>
      </div>
      <nuxt class="content mb-4" />
      <footer class="footer text-center">
        &copy;
        <a href="http://reformedtech.org" target="_blank">ReformedTech</a> 2020
      </footer>
    </div>
  </main>
</template>

<script>
export default {
  computed: {
    arabicYear() {
      const options = { year: 'numeric' }
      const locales = ['ar-u-ca-islamic', 'ar-u-nu-latn']
      return Number(
        new Intl.DateTimeFormat(locales, options).format(Date.now()).slice(0, 4)
      )
        .toLocaleString('bn')
        .replace(',', '')
    }
  }
}
</script>
