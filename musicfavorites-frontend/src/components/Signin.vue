<template>
  <div class="max-w-sm m-auto my-8">
    <h1 class="text-1xl text-center mb-3 text-purple raleway hover:text-purple-light">MY MUSIC FAVORITES</h1>

    <div class="border p-10 border-grey-light shadow rounded">
      <h3 class="text-2xl mb-6 text-grey-darkest">Sign In</h3>
      <form @submit.prevent="signin">
        <div class="text-red" v-if="error">{{ error }}</div>

        <div class="mb-6">
          <label for="email" class="label">E-mail</label>
          <input type="email" v-model="email" class="input" id="email" placeholder="my-email@any-email.com">
        </div>
        <div class="mb-6">
          <label for="password" class="label">Password</label>
          <input type="password" v-model="password" class="input" id="password" placeholder="password">
        </div>
        <button type="submit" class="font-sans font-bold px-4 rounded cursor-pointer no-underline bg-purple hover:bg-purple-dark block w-full py-4 text-white items-center justify-center">Sign In</button>

        <div class="my-4"><router-link to="/signup" class="link-grey">Sign up</router-link></div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signin',
  data () {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    signin () {
      this.$http.plain.post('/signin', { email: this.email, password: this.password })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      localStorage.csrf = response.data.csrf
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace('/songs')
    },
    signinFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || 'Email or password are not right'
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/songs')
      }
    }
  }
}
</script>
