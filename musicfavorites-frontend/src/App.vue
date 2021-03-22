<template>
  <div id="app">
    <Header :key="componentKey" />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  name: 'App',
  components: {
    Header
  },
  data () {
    return {
      componentKey: 0,
    }
  },
  methods: {
    forceReRender () {
      this.componentKey += 1
    }
  }
}
</script>
