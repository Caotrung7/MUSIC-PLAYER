  const $ = document.querySelector.bind(document)
  const $$ = document.querySelector.bind(document)

  const PLAYER_STORAGE_KEY = 'CT_PLAYER'

  const heading = $('header h2')
  const cdThumb = $('.cd-thumb')
  const audio = $('#audio')
  const cd = $('.cd')
  const playBtn = $('.btn-toggle-play')
  const player = $('.player')
  const progress = $('#progress')
  const nextBtn = $('.btn-next')
  const prevBtn = $('.btn-prev')
  const randomBtn = $('.btn-random')
  const repeatBtn = $('.btn-repeat')
  const playList = $('.playlist')

  const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [
      {
        name: 'Nevada',
        singer: 'Vicetone',
        path: './music/Song1.mp3',
        image: './img/Song1.jpg'
      },
      {
        name: 'SummerTime',
        singer: 'K-391',
        path: './music/Song2.mp3',
        image: './img/Song2.jpg'
      },
      {
        name: 'Monody',
        singer: 'TheFatRat',
        path: './music/Song3.mp3',
        image: './img/Song3.jpg'
      },
      {
        name: 'Reality',
        singer: 'Lost Frequencies',
        path: './music/Song4.mp3',
        image: './img/Song4.jpg'
      },
      {
        name: 'Dieu Khac La',
        singer: 'Dat G',
        path: './music/Song5.mp3',
        image: './img/Song5.jpg'
      },
      {
        name: 'Lemon tree',
        singer: 'DJ DESA REMIX',
        path: './music/Song6.mp3',
        image: './img/Song6.jpg'
      },
      {
        name: 'Sugar',
        singer: 'Maroon5',
        path: './music/Song7.mp3',
        image: './img/Song7.jpg'
      },
      {
        name: 'MyLove',
        singer: 'Westlife',
        path: './music/Song8.mp3',
        image: './img/Song8.jpg'
      },
      {
        name: 'Attention',
        singer: 'Charlie Puth',
        path: './music/Song9.mp3',
        image: './img/Song9.jpg'
      },
      {
        name: 'Monster',
        singer: 'Katie sky',
        path: './music/Song10.mp3',
        image: './img/Song10.jpg'
      },
        ],

    render: function () {
      const htmls = this.songs.map((song,index) => {
      return `
              <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>
              `
      })
      playList.innerHTML = htmls.join('');
      },

    defineProperties: function() {
      Object.defineProperty(this, 'currentSong', {
      get: function () {
      return this.songs[this.currentIndex]
      }
      })
      },

    handleEvents: function ()
      {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xu ly CD quay/dung
        const cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
        ], {
        duration: 10000, //10 seconds
        iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xu ly phong to/thu nho CD
        document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xu ly khi click play
        playBtn.onclick = function () {
        if (_this.isPlaying) {
        audio.pause()
        }else {
          audio.play()
        }
        }

        //Xu ly khi songs play
        audio.onplay = function () {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
        }

        //Xu ly khi songs pause
        audio.onpause = function () {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
        }

        //Xu ly thanh progress chay khi song play
        audio.ontimeupdate = function () {
        if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
        }
        }

        //Xu ly tua song khi song play
        progress.onchange = function(e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
        }

        //Xu ly khi next Song
        nextBtn.onclick = function() {
        if (_this.isRandom) {
        _this.playRandomSong()
        } else {
          _this.nextSong()
        }
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }

        //Xu ly khi prev Song
        prevBtn.onclick = function() {
        if (_this.isRandom) {
        _this.playRandomSong()
        } else {
          _this.prevSong()
        }
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }

        //Random song on/off
        randomBtn.onclick = function() {
          _this.isRandom = !_this.isRandom
          _this.setConfig('isRandom', _this.isRandom)
          randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xu ly repeat song
        repeatBtn.onclick = function() {
          _this.isRepeat = !_this.isRepeat
          _this.setConfig('isRepeat', _this.isRepeat)
          repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xu ly next song khi audio ended
        audio.onended = function() {
        if(_this.isRepeat) {
        audio.play()
          } else {
            nextBtn.click()
            }
        }

        //Listen hanh vi click vao playlist
        playList.onclick = function(e) {
          const songNode = e.target.closest('.song:not(.active)')
          if (songNode || e.target.closest('.option')) {

            //Xu ly khi click vao song
            if (songNode) {
              _this.currentIndex = Number(songNode.dataset.index)
              _this.loadCurrentSong()
              _this.render()
              audio.play()
            }

            //Xu ly khi click vao nut option
            if (e.target.closest('.option')) {

            }
          }
        }
      },

    scrollToActiveSong: function()
      {
        setTimeout(() => {
          $('.song.active').scrollIntoView( {
            behavior: 'smooth',
            block: 'center',
          })
        }, 200)
      },

    loadCurrentSong: function ()
      {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image}`
        audio.src = this.currentSong.path
      },

    nextSong: function()
      {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
        }
          this.loadCurrentSong()
      },

    prevSong: function()
      {
        this.currentIndex--
        if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
        }
          this.loadCurrentSong()
      },

    playRandomSong: function()
      {
        let newIndex

        do {
        newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
      },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },


    start: function ()
      {
        //Gan cau hinh tu config vao ung dung
        this.loadConfig()

        //Dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        //Lang nghe/xu ly cac su kien (DOM events)
        this.handleEvents()

        //Load bai hat dau tien vao UI khi ung dung chay ung dung
        this.loadCurrentSong()

        //Render playlist
        this.render();

        //Hien thi trang thai ban dau cua btn-Repeat & btn-Random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
      }
  }

  app.start()



