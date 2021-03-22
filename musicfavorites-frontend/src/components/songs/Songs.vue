<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>
    <h3 class="font-mono font-regular text-3xl mb-4 raleway">Add a new song</h3>

    <form @submit.prevent="addSong">
      <div class="mb-6">
        <label for="song_title" class="label">Title</label>
        <input
          type="text"
          id="song_title"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Type a song name"
          v-model="newSong.title">
      </div>

      <div class="mb-6">
        <label for="song_genre" class="label">Genre</label>
        <input
          type="text"
          id="song_genre"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Type a music genre"
          v-model="newSong.genre">
      </div>

      <div class="mb-6">
        <label for="artist" class="label">Artist</label>
        <select id="artist" class="select" v-model="newSong.artist">
          <option disabled value="">Select an artist</option>
          <option :value="artist.id" v-for="artist in artists" :key="artist.id">{{ artist.name }}</option>
        </select>
        <p class="pt-4">Don't see an artist? <router-link to="/artists" class="link-grey">Create one</router-link></p>
      </div>

      <input type="submit" value="Add Song" class="font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center">
    </form>

    <hr class="border border-grey-light my-6" />

    <ul class="list-reset mt-4">
      <li class="py-4" v-for="song in songs" :key="song.id" :song="song">
        <div class="flex items-center justify-between flex-wrap">
          <div class="flex-1 flex justify-between flex-wrap pr-4">
          <p class="block flex font-mono font-semibold flex items-center">
            <svg class="fill-current text-indigo w-6 h-6 mr-2" viewBox="0 0 24 24" width="24" height="24"><title>song vinyl</title><path d="M23.938 10.773a11.915 11.915 0 0 0-2.333-5.944 12.118 12.118 0 0 0-1.12-1.314A11.962 11.962 0 0 0 12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12c0-.414-.021-.823-.062-1.227zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" ></path></svg>
            {{ song.title }} &mdash; {{ song.genre }}
          </p>
          <p class="block font-mono font-semibold">{{ getArtist(song) }}</p>
        </div>

        <button class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded"
          @click.prevent="editSong(song)">Edit</button>

        <button class="bg-transparent text-sm hover:bg-red text-red hover:text-white no-underline font-bold py-2 px-4 rounded border border-red"
         @click.prevent="removeSong(song)">Delete</button>
        </div>

        <div v-if="song == editedSong">
          <form action="" @submit.prevent="updateSong(song)">
            <div class="mb-6 p-4 bg-white rounded border border-grey-light mt-4">

              <div class="mb-6">
                <label class="label">Title</label>
                <input class="input" v-model="song.title">
              </div>

              <div class="mb-6">
                <label class="label">Genre</label>
                <input class="input" v-model="song.genre">
              </div>

              <div class="mb-6">
                 <select id="artist_update" class="select" v-model="song.artist" placeholder="Select an artist">
                    <option disabled value="">Select an artist</option>
                  <option class="mb-2" :value="artist.id" v-for="artist in artists" :key="artist.id">{{ artist.name }}</option>
                  </select>
              </div>

              <input type="submit" value="Update" class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Songs',
    data () {
      return {
        artists: [],
        songs: [],
        newSong: [],
        error: '',
        editedSong: ''
      }
    },
    created () {
      if (!localStorage.signedIn) {
        this.$router.replace('/')
      } else {
        this.$http.secured.get('/api/v1/songs')
          .then(response => { this.songs = response.data })
          .catch(error => this.setError(error, 'Something went wrong'))
        this.$http.secured.get('/api/v1/artists')
          .then(response => { this.artists = response.data })
          .catch(error => this.setError(error, 'Something went wrong'))
      }
    },
    methods: {
      setError (error, text) {
        this.error = (error.response && error.response.data && error.response.data.error) || text
      },
      getArtist (song) {
        const songArtistValues = this.artists.filter(artist => artist.id === song.artist_id)
        let artist
        songArtistValues.forEach(function (element) {
          artist = element.name
        })
        return artist
      },
      addSong () {
        const value = this.newSong
        if (!value) {
          return
        }
        this.$http.secured.post('/api/v1/songs/', { song: { title: this.newSong.title, genre: this.newSong.genre, artist_id: this.newSong.artist } })
          .then(response => {
            this.songs.push(response.data)
            this.newSong = ''
          })
          .catch(error => this.setError(error, "Can't add song"))
      },
      removeSong (song) {
        this.$http.secured.delete(`/api/v1/songs/${song.id}`)
          .then(response => {
            this.songs.splice(this.songs.indexOf(song), 1)
          })
          .catch(error => this.setError(error, "Can't delete song"))
      },
      editSong (song) {
        this.editedSong = song
      },
      updateSong (song) {
        this.editedSong = ''
        this.$http.secured.patch(`/api/v1/songs/${song.id}`, { song: { title: song.title, genre: song.genre, artist_id: song.artist } })
          .catch(error => this.setError(error, "Can't update song"))
      }
    }
  }
</script>
