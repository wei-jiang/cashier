<template>
  <div id="app">
    <home :app="app"></home>
    <product :app="app"></product>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Product from './components/Product.vue'

export default {
  name: 'app',
  data () {
    return {
      app: phonon.navigator()
    }
  },

  mounted () {
    this.$nextTick(() => {
      phonon.options({
        navigator: {
          defaultPage: 'home',
          animatePages: true,
          enableBrowserBackButton: true
        },
        i18n: null // for this example, we do not use internationalization
      })

      window.setTimeout(() => {
        this.app.start()
      }, 500)
    })
  },

  components: {
    Home,
    Product
  }
}
</script>
<style>

</style>