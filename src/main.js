// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'noty/lib/noty.css'
import App from './App'
import './net'

Vue.config.ignoredElements = ['home', 'product']

require('phonon/dist/css/phonon.min.css')
require('phonon/dist/js/phonon.js')

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

