<template>
  <div class="mom-page">
    <button
      class="music-toggle"
      type="button"
      @click="toggleMusic"
      :title="musicOn ? 'Tắt nhạc' : 'Bật nhạc'"
    >
      {{ musicOn ? '🔊' : '🔇' }}
    </button>

    <div class="music-embed-hidden" aria-hidden="true">
      <iframe
        v-if="musicOn"
        :key="musicReloadKey"
        class="music-embed-hidden-frame"
        :src="youtubeEmbedSrc"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>

    <div class="bg-blur blur-a"></div>
    <div class="bg-blur blur-b"></div>

    <section v-if="stage === 'qr'" class="screen intro-screen">
      <div class="poster-card">
        <div class="poster-cupid cupid-left">💘</div>
        <div class="poster-cupid cupid-right">💘</div>

        <div class="poster-top">Mừng ngày</div>
        <h1 class="poster-title">Quốc Tế Phụ Nữ</h1>

        <div class="poster-heart-zone">
          <div class="hand-heart">
            <button class="qr-box" type="button" @click="goReveal">
              <img :src="qrSrc" alt="QR mở trang lời chúc" />
            </button>
          </div>
        </div>

        <div class="poster-bottom">
          <span class="flower">🌷</span>
          <span>Chạm vào mã QR để mở món quà nhỏ của con</span>
        </div>
      </div>
    </section>

    <section v-else-if="stage === 'ready'" class="screen reveal-screen">
      <div class="reveal-card">
        <div class="cloud cloud-a"></div>
        <div class="cloud cloud-b"></div>
        <div class="spark small s-a">✦</div>
        <div class="spark small s-b">✦</div>
        <div class="spark small s-c">✦</div>

        <div class="reveal-badge">8/3</div>
        <div class="reveal-text">ĐƯỢC MỜI MỞ CẢM XÚC</div>
        <p>
          Một món quà nho nhỏ, nhưng là tất cả yêu thương con muốn gửi đến mẹ.
        </p>
        <button class="primary-btn" type="button" @click="startIntroSequence">
          Sẵn sàng 💖
        </button>
      </div>
    </section>

    <section v-else-if="stage === 'introText'" class="screen intro-animate-screen">
      <div class="intro-animate-card">
        <div class="intro-cupid left">💘</div>
        <div class="intro-cupid right">💘</div>

        <div class="winged-heart">
          <span>🤍</span>
          <span class="main-heart">💗</span>
          <span>🤍</span>
        </div>

        <div class="intro-core">
          <div ref="introNumberRef" class="intro-number">8/3</div>
          <div ref="introHappyRef" class="intro-line intro-line-1">Happy</div>
          <div ref="introWomenRef" class="intro-line intro-line-2">Women's Day</div>
          <div ref="introSubRef" class="intro-sub">
            Dành riêng cho {{ momName }}
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="stage === 'flipbook'" class="screen flipbook-screen">
      <div class="book-stage">
        <div class="book-bg">
          <div class="book-cupid cupid-left">💘</div>
          <div class="book-cupid cupid-right">💘</div>
          <div class="book-cloud cloud-left"></div>
          <div class="book-cloud cloud-right"></div>
          <div class="bubble b1"></div>
          <div class="bubble b2"></div>
          <div class="bubble b3"></div>
          <div class="bubble b4"></div>
          <div class="spark s1">✦</div>
          <div class="spark s2">✦</div>
          <div class="spark s3">✦</div>
          <div class="spark s4">✦</div>
        </div>

        <div ref="bookShellRef" class="book-shell">
          <div class="book-top-emblem">🤍 💗 🤍</div>

          <div class="flip-stage">
            <div class="flip-shadow"></div>

            <div ref="flipCardRef" class="flip-card" :class="{ disabled: isFlipping }">
              <div class="flip-face flip-front">
                <div class="card-panel left-panel">
                  <div class="page-count">
                    {{ activeBookPage + 1 }} / {{ bookPages.length }}
                  </div>
                  <h2>{{ bookPages[activeBookPage].title }}</h2>
                  <p>{{ bookPages[activeBookPage].text }}</p>
                </div>

                <div class="card-panel right-panel">
                  <img
                    :src="bookPages[activeBookPage].src"
                    :alt="bookPages[activeBookPage].alt"
                  />
                </div>
              </div>
            </div>

            <button
              class="page-hotzone hotzone-left"
              type="button"
              @click="flipPrev"
              :disabled="isFlipping || activeBookPage === 0"
            ></button>

            <button
              class="page-hotzone hotzone-right"
              type="button"
              @click="flipNext"
              :disabled="isFlipping"
            ></button>
          </div>
        </div>

        <div class="book-tip">Chạm nửa trái để lật lại • chạm nửa phải để lật tiếp</div>
      </div>
    </section>

    <section v-else-if="stage === 'heartGate'" class="screen heart-screen">
      <div class="heart-gate-card">
        <div class="heart-gate-stars">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>

        <div class="heart-hint">Xin mẹ chạm vào trái tim này nhé</div>

        <button class="heart-button" type="button" @click="goFinalScene">
          <span class="heart-wing wing-left">🤍</span>
          <span class="heart-main">💖</span>
          <span class="heart-wing wing-right">🤍</span>
        </button>

        <div class="heart-note">Một bất ngờ nhỏ nữa đang chờ mẹ ở phía sau</div>
      </div>
    </section>

    <section v-else-if="stage === 'final'" class="screen final-screen">
      <div class="stars"></div>

      <div class="floating-words">
        <span
          v-for="(word, i) in floatingWords"
          :key="word.text + i"
          :style="word.style"
          class="floating-word"
        >
          {{ word.text }}
        </span>
      </div>

      <div class="final-wrap">
        <div class="firework-heart-wrap">
          <div ref="heartParticleRef" class="heart-particles">
            <span
              v-for="p in heartParticles"
              :key="p.id"
              class="heart-particle"
              :style="{ left: `${50 + p.x}%`, top: `${42 + p.y}%` }"
            ></span>
          </div>

          <div ref="finalTitleRef" class="final-main-title">
            Xin phép con gom về một điều đẹp nhất
          </div>
        </div>

        <div class="ring-scene">
          <div ref="photoRingRef" class="photo-ring">
            <div
              v-for="(photo, index) in ringPhotos"
              :key="photo.id"
              class="ring-card"
              :style="getRingItemStyle(index, ringPhotos.length)"
            >
              <img :src="photo.src" :alt="photo.alt" />
            </div>
          </div>
        </div>

        <button class="primary-btn final-next-btn" type="button" @click="goGalleryScene">
          Xem tất cả ảnh ✨
        </button>

        <div class="final-bottom-note">
          Chúc mẹ luôn thật nhiều niềm vui, thật nhiều bình an và thật nhiều yêu thương 💗
        </div>
      </div>
    </section>

    <section v-else class="screen gallery-screen">
      <div class="stars"></div>

      <div class="gallery-bg-words">
        <span
          v-for="(word, i) in galleryWords"
          :key="word.text + 'gallery' + i"
          :style="word.style"
          class="floating-word gallery-word"
        >
          {{ word.text }}
        </span>
      </div>

      <div class="gallery-wrap gallery-wrap-float">
        <div class="gallery-title">Chúc mừng ngày 8 tháng 3</div>

        <div ref="galleryGridRef" class="gallery-float-stage">
          <button
            v-for="(photo, index) in photos"
            :key="photo.id"
            type="button"
            class="gallery-float-card"
            :style="galleryCardStyle(index)"
            @click="openPhotoModal(photo)"
          >
            <img :src="photo.src" :alt="photo.alt" />
          </button>
        </div>
      </div>

      <div v-if="selectedPhoto" class="photo-modal" @click="closePhotoModal">
        <button class="photo-modal-close" type="button" @click.stop="closePhotoModal">
          ×
        </button>
        <img
          class="photo-modal-image"
          :src="selectedPhoto.src"
          :alt="selectedPhoto.alt"
          @click.stop
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useGsapScenes } from '@/composables/useGsapScenes'

import img01 from '@/assets/mom/z7598739392780_be09f2dc0d41b78bd7e62199de3ab306.jpg'
import img02 from '@/assets/mom/z7598739394441_2f8fe462d17eeefbf2f094ce80ca0be5.jpg'
import img03 from '@/assets/mom/z7598739400403_032b0e4dcdaf77d22640e88d4475017b.jpg'
import img04 from '@/assets/mom/z7598739409861_ee2991e9d50c4010d8613b7283fae9a9.jpg'
import img05 from '@/assets/mom/z7598765051975_dd9d71fddad822fbda55813c30b82aa3.jpg'
import img06 from '@/assets/mom/z7598765060099_c46752e824434b0f6dc9ad8bede99a36.jpg'
import img07 from '@/assets/mom/z7598765064323_8bd0fd98dc9d3ac6c22addd156547abe.jpg'
import img08 from '@/assets/mom/z7598765073715_c8fc6dc8a1bf6106089b06925d772f11.jpg'
import img09 from '@/assets/mom/z7598765082898_42f271c238bb974350ef9d2bacfc7eca.jpg'
import img10 from '@/assets/mom/z7598765083986_99a9398eac0cf534f1ae56eff76623ed.jpg'
import img11 from '@/assets/mom/z7598765092096_b84ad64eac56e0b9256c2fbb893f1953.jpg'
import img12 from '@/assets/mom/z7598765104547_8d671f4af07502474f57ca1c4e7ee122.jpg'
import img13 from '@/assets/mom/z7598765104780_5f189a67a91c97b14e56e107ca135c38.jpg'
import img14 from '@/assets/mom/z7598765114612_4cd061fc8ce73fd36446a463ac325de3.jpg'
import img15 from '@/assets/mom/z7598765116948_66f6f2009a264913769fea8710f899b7.jpg'
import img16 from '@/assets/mom/z7598765124805_e64e2303973a17712b640bb0eac136de.jpg'
import img17 from '@/assets/mom/z7598765125636_c75bedef57172bad449b079b7fb89eca.jpg'
import img18 from '@/assets/mom/z7598765131938_a1912b41c91f4b5d1b87b449b612aed4.jpg'
import img19 from '@/assets/mom/z7598765144458_b054f874b15e6bb51584be23bf9ab824.jpg'
import img20 from '@/assets/mom/z7598765144749_605665d0178813d9907acf435a00223d.jpg'

const {
  cleanup,
  runIntro,
  flipForward,
  flipBackward,
  closeBook,
  runHeartFirework,
  runFloatingWords,
  runPhotoRing,
  runGalleryCards
} = useGsapScenes()

const stage = ref('qr')
const currentUrl = ref('https://example.com')
const activeBookPage = ref(0)
const isFlipping = ref(false)

const musicOn = ref(true)
const musicReloadKey = ref(0)

const youtubeVideoId = 'AmRqzLpNU0E'
const youtubeEmbedSrc = computed(() => {
  return `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${youtubeVideoId}&playsinline=1&rel=0&modestbranding=1`
})

const flipCardRef = ref(null)
const bookShellRef = ref(null)
const photoRingRef = ref(null)
const heartParticleRef = ref(null)
const finalTitleRef = ref(null)
const galleryGridRef = ref(null)

const introNumberRef = ref(null)
const introHappyRef = ref(null)
const introWomenRef = ref(null)
const introSubRef = ref(null)

const selectedPhoto = ref(null)
const momName = 'Mẹ yêu'

const photos = ref([
  { id: 1, src: img01, alt: 'Kỷ niệm 1', caption: 'Khoảnh khắc thật đẹp của bố mẹ' },
  { id: 2, src: img02, alt: 'Kỷ niệm 2', caption: 'Một chuyến đi thật bình yên' },
  { id: 3, src: img03, alt: 'Kỷ niệm 3', caption: 'Gia đình mình luôn rực rỡ như nắng' },
  { id: 4, src: img04, alt: 'Kỷ niệm 4', caption: 'Những khoảnh khắc dịu dàng bên nhau' },
  { id: 5, src: img05, alt: 'Kỷ niệm 5', caption: 'Một ngày truyền thống thật đáng nhớ' },
  { id: 6, src: img06, alt: 'Kỷ niệm 6', caption: 'Mẹ lúc nào cũng thật xinh đẹp' },
  { id: 7, src: img07, alt: 'Kỷ niệm 7', caption: 'Những phút giây giản dị nhưng ấm áp' },
  { id: 8, src: img08, alt: 'Kỷ niệm 8', caption: 'Niềm vui của mẹ là điều con luôn nhớ' },
  { id: 9, src: img09, alt: 'Kỷ niệm 9', caption: 'Một bức ảnh ngập tràn yêu thương' },
  { id: 10, src: img10, alt: 'Kỷ niệm 10', caption: 'Mỗi góc nhỏ đều có thật nhiều thương yêu' },
  { id: 11, src: img11, alt: 'Kỷ niệm 11', caption: 'Những ngày hè hạnh phúc bên gia đình' },
  { id: 12, src: img12, alt: 'Kỷ niệm 12', caption: 'Gia đình mình bên nhau là đủ' },
  { id: 13, src: img13, alt: 'Kỷ niệm 13', caption: 'Một nụ cười thật đẹp của bố mẹ' },
  { id: 14, src: img14, alt: 'Kỷ niệm 14', caption: 'Mẹ và những khoảnh khắc đáng yêu nhất' },
  { id: 15, src: img15, alt: 'Kỷ niệm 15', caption: 'Cả nhà dành tặng mẹ thật nhiều yêu thương' },
  { id: 16, src: img16, alt: 'Kỷ niệm 16', caption: 'Những góc ngọt ngào của bố mẹ' },
  { id: 17, src: img17, alt: 'Kỷ niệm 17', caption: 'Một ngày biển xanh và gia đình mình' },
  { id: 18, src: img18, alt: 'Kỷ niệm 18', caption: 'Nụ cười của mẹ lúc nào cũng đẹp nhất' },
  { id: 19, src: img19, alt: 'Kỷ niệm 19', caption: 'Một ngày thật tự hào của gia đình' },
  { id: 20, src: img20, alt: 'Kỷ niệm 20', caption: 'Con chỉ mong mẹ luôn vui như thế này' }
])

const bookPages = ref([
  {
    id: 1,
    src: img01,
    alt: 'Trang 1',
    title: 'Gửi mẹ yêu',
    text: 'Cảm ơn mẹ vì đã luôn dịu dàng, ấm áp và yêu thương con theo cách đẹp nhất.'
  },
  {
    id: 2,
    src: img02,
    alt: 'Trang 2',
    title: 'Những chuyến đi',
    text: 'Mỗi lần bên mẹ, mọi nơi đều trở thành một kỷ niệm thật bình yên.'
  },
  {
    id: 3,
    src: img03,
    alt: 'Trang 3',
    title: 'Những ngày vui',
    text: 'Con thích nhất là được nhìn thấy mẹ cười thật tươi giữa những ngày hạnh phúc.'
  },
  {
    id: 4,
    src: img05,
    alt: 'Trang 4',
    title: 'Thật đẹp',
    text: 'Mẹ lúc nào cũng đẹp theo cách rất riêng, dịu dàng và đầy yêu thương.'
  },
  {
    id: 5,
    src: img08,
    alt: 'Trang 5',
    title: 'Gia đình mình',
    text: 'Gia đình mình đẹp nhất là khi mọi người ở cạnh nhau, cùng cười và cùng thương nhau.'
  },
  {
    id: 6,
    src: img11,
    alt: 'Trang 6',
    title: 'Mùa hè của con',
    text: 'Những ngày bên gia đình luôn là những ngày con muốn giữ lại mãi mãi.'
  },
  {
    id: 7,
    src: img15,
    alt: 'Trang 7',
    title: 'Yêu thương',
    text: 'Mẹ luôn là người nhận được thật nhiều yêu thương, vì mẹ xứng đáng với điều đó.'
  },
  {
    id: 8,
    src: img19,
    alt: 'Trang 8',
    title: 'Tự hào',
    text: 'Con tự hào vì được là con của mẹ, người phụ nữ tuyệt vời nhất trong lòng con.'
  },
  {
    id: 9,
    src: img20,
    alt: 'Trang 9',
    title: 'Chúc mẹ 8/3',
    text: 'Chúc mẹ luôn mạnh khỏe, hạnh phúc và mỗi ngày đều ngập tràn tiếng cười.'
  }
])

const ringPhotos = computed(() => photos.value.slice(0, 12))

const floatingWords = computed(() => [
  { text: 'Mãi yêu mẹ', style: { top: '12%', left: '8%' } },
  { text: 'Mẹ yêu ơi', style: { top: '18%', right: '8%' } },
  { text: 'Luôn hạnh phúc', style: { top: '40%', left: '6%' } },
  { text: 'Con thương mẹ', style: { top: '32%', right: '9%' } },
  { text: 'Mãi dịu dàng', style: { bottom: '22%', left: '8%' } },
  { text: 'Bình an nhé', style: { bottom: '14%', right: '8%' } }
])

const galleryWords = computed(() => [
  { text: 'Tình yêu bé nhỏ', style: { top: '12%', left: '30%' } },
  { text: 'Mãi bên nhau', style: { top: '24%', right: '10%' } },
  { text: 'Gia đình mình', style: { top: '58%', left: '8%' } },
  { text: 'Con thương mẹ', style: { top: '72%', right: '10%' } },
  { text: 'Mẹ là điều dịu dàng nhất', style: { top: '36%', left: '12%' } },
  { text: 'Bình an và hạnh phúc', style: { top: '16%', right: '18%' } }
])

const heartParticles = computed(() => {
  const points = []
  for (let i = 0; i < 95; i++) {
    const t = (Math.PI * 2 * i) / 95
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)

    points.push({
      id: i,
      x: x * 1.5,
      y: -y * 1.5
    })
  }
  return points
})

const qrSrc = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(currentUrl.value)}`
})

onMounted(() => {
  currentUrl.value = window.location.href
})

onBeforeUnmount(() => {
  cleanup()
})

watch(stage, async (value) => {
  await nextTick()

  if (value === 'introText') {
    runIntro({
      numberEl: introNumberRef.value,
      happyEl: introHappyRef.value,
      womenEl: introWomenRef.value,
      subEl: introSubRef.value,
      onComplete: () => {
        setTimeout(() => {
          stage.value = 'flipbook'
          activeBookPage.value = 0
        }, 500)
      }
    })
  }

  if (value === 'final') {
    const particles = heartParticleRef.value?.querySelectorAll('.heart-particle')
    const words = document.querySelectorAll('.final-screen .floating-word')
    runHeartFirework(particles, finalTitleRef.value)
    runFloatingWords(words)
    runPhotoRing(photoRingRef.value)
  }

  if (value === 'gallery') {
    const cards = galleryGridRef.value?.querySelectorAll('.gallery-float-card')
    const words = document.querySelectorAll('.gallery-screen .gallery-word')
    runGalleryCards(cards)
    runFloatingWords(words)
  }
})

function toggleMusic() {
  musicOn.value = !musicOn.value
  musicReloadKey.value += 1
}

function goReveal() {
  stage.value = 'ready'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function startIntroSequence() {
  stage.value = 'introText'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function flipNext() {
  if (isFlipping.value) return

  if (activeBookPage.value >= bookPages.value.length - 1) {
    closeBookThenHeart()
    return
  }

  isFlipping.value = true
  flipForward(
    flipCardRef.value,
    () => {
      activeBookPage.value += 1
    },
    () => {
      isFlipping.value = false
    }
  )
}

function flipPrev() {
  if (isFlipping.value || activeBookPage.value <= 0) return

  isFlipping.value = true
  flipBackward(
    flipCardRef.value,
    () => {
      activeBookPage.value -= 1
    },
    () => {
      isFlipping.value = false
    }
  )
}

function closeBookThenHeart() {
  closeBook(bookShellRef.value, () => {
    stage.value = 'heartGate'
  })
}

function goFinalScene() {
  stage.value = 'final'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goGalleryScene() {
  stage.value = 'gallery'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openPhotoModal(photo) {
  selectedPhoto.value = photo
}

function closePhotoModal() {
  selectedPhoto.value = null
}

function getRingItemStyle(index, total) {
  const angle = (360 / total) * index
  return {
    transform: `rotateY(${angle}deg) translateZ(210px)`
  }
}

function galleryCardStyle(index) {
  const heartPositions = [
    { top: '10%', left: '30%', width: '88px' },
    { top: '10%', left: '50%', width: '88px' },

    { top: '16%', left: '18%', width: '92px' },
    { top: '16%', left: '38%', width: '92px' },
    { top: '16%', left: '58%', width: '92px' },
    { top: '16%', left: '78%', width: '92px' },

    { top: '26%', left: '12%', width: '96px' },
    { top: '26%', left: '30%', width: '96px' },
    { top: '26%', left: '50%', width: '96px' },
    { top: '26%', left: '68%', width: '96px' },

    { top: '38%', left: '20%', width: '96px' },
    { top: '38%', left: '38%', width: '96px' },
    { top: '38%', left: '56%', width: '96px' },
    { top: '38%', left: '74%', width: '96px' },

    { top: '50%', left: '28%', width: '94px' },
    { top: '50%', left: '46%', width: '94px' },
    { top: '50%', left: '64%', width: '94px' },

    { top: '63%', left: '36%', width: '92px' },
    { top: '63%', left: '54%', width: '92px' },

    { top: '77%', left: '45%', width: '90px' }
  ]

  return heartPositions[index] || { top: '20%', left: '20%', width: '96px' }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Mali:wght@400;500;600;700&display=swap');

:global(html) {
  scroll-behavior: smooth;
}

:global(body) {
  margin: 0;
  background: linear-gradient(180deg, #ffe3ed 0%, #fff1f7 55%, #fff8fb 100%);
  font-family: 'Be Vietnam Pro', sans-serif;
  color: #6d4254;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

img {
  display: block;
  max-width: 100%;
}

button {
  font: inherit;
}

.mom-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'Be Vietnam Pro', sans-serif;
}

.music-toggle {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 40;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 22px rgba(196, 103, 143, 0.18);
  font-size: 24px;
  cursor: pointer;
}

.music-embed-hidden {
  position: fixed;
  right: 12px;
  bottom: 12px;
  width: 170px;
  height: 96px;
  overflow: hidden;
  opacity: 0.02;
  pointer-events: none;
  z-index: 1;
  border-radius: 12px;
}

.music-embed-hidden-frame {
  width: 170px;
  height: 96px;
  border: none;
}

.bg-blur {
  position: fixed;
  border-radius: 999px;
  filter: blur(75px);
  opacity: 0.55;
  pointer-events: none;
  z-index: 0;
}

.blur-a {
  width: 220px;
  height: 220px;
  background: #ffbcd1;
  top: -50px;
  left: -60px;
}

.blur-b {
  width: 260px;
  height: 260px;
  background: #ffd7e5;
  right: -90px;
  top: 30%;
}

.screen {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 18px 14px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-card,
.reveal-card,
.intro-animate-card,
.heart-gate-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 207, 223, 0.92);
  box-shadow: 0 22px 48px rgba(214, 112, 155, 0.16);
}

.poster-card,
.reveal-card,
.book-stage,
.heart-gate-card,
.final-wrap,
.gallery-wrap,
.intro-animate-card {
  width: 100%;
  max-width: 430px;
}

.poster-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 24px 16px 18px;
  text-align: center;
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 214, 230, 0.85), transparent 38%),
    linear-gradient(180deg, #fffafb 0%, #ffeef5 100%);
}

.poster-cupid,
.intro-cupid,
.book-cupid {
  position: absolute;
  top: 18px;
  font-size: 28px;
}

.cupid-left,
.left {
  left: 18px;
}

.cupid-right,
.right {
  right: 18px;
}

.poster-top,
.poster-title,
.reveal-text,
.intro-number,
.intro-line,
.heart-hint,
.left-panel h2,
.final-main-title,
.gallery-title {
  font-family: 'Mali', cursive;
}

.poster-top {
  font-size: 24px;
  font-weight: 700;
  color: #6d4a58;
}

.poster-title {
  margin: 6px 0 0;
  font-size: 34px;
  line-height: 1.15;
  color: #c15b73;
  font-weight: 700;
}

.poster-heart-zone {
  display: flex;
  justify-content: center;
  margin: 18px 0;
}

.hand-heart {
  width: 280px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 28%, #ffdbe7 0%, #f7bfd0 66%, #f0aabc 100%);
  clip-path: path('M140 244 C44 186 10 135 10 82 C10 35 46 10 84 10 C112 10 131 26 140 39 C149 26 168 10 196 10 C234 10 270 35 270 82 C270 135 236 186 140 244 Z');
}

.qr-box {
  width: 150px;
  height: 150px;
  border: none;
  border-radius: 18px;
  background: #fff;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(178, 86, 121, 0.22);
}

.qr-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #885767;
  font-weight: 600;
}

.flower {
  font-size: 24px;
}

.reveal-screen {
  background: linear-gradient(180deg, rgba(255, 225, 236, 0.6), rgba(255, 244, 248, 0.76));
}

.reveal-card {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  padding: 36px 20px;
  text-align: center;
  background:
    radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.48), transparent 22%),
    linear-gradient(180deg, #ffd6e4, #ffc7d9);
}

.cloud {
  position: absolute;
  width: 88px;
  height: 34px;
  background: rgba(255, 255, 255, 0.58);
  border-radius: 999px;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: inherit;
}

.cloud::before {
  width: 34px;
  height: 34px;
  left: 10px;
  top: -12px;
}

.cloud::after {
  width: 40px;
  height: 40px;
  right: 8px;
  top: -16px;
}

.cloud-a {
  left: 18px;
  top: 18px;
}

.cloud-b {
  right: 18px;
  top: 26px;
}

.reveal-badge {
  width: 94px;
  height: 94px;
  border-radius: 50%;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5f94, #ff8daf);
  color: #fff;
  font-size: 32px;
  font-weight: 900;
  box-shadow: 0 16px 28px rgba(255, 95, 148, 0.24);
}

.reveal-text {
  font-weight: 700;
  font-size: 27px;
  color: #fff;
}

.reveal-card p {
  margin: 12px 0 0;
  color: #905268;
  line-height: 1.8;
  font-weight: 500;
}

.primary-btn {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  cursor: pointer;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6598, #ff8fb2);
  color: #fff;
  box-shadow: 0 12px 24px rgba(255, 101, 152, 0.24);
}

.intro-animate-screen {
  background:
    radial-gradient(circle at 50% 40%, rgba(255, 201, 222, 0.9), rgba(255, 238, 245, 0.75) 45%, transparent 72%),
    linear-gradient(180deg, #ffe1ea 0%, #fff3f8 100%);
}

.intro-animate-card {
  position: relative;
  overflow: hidden;
  min-height: 72vh;
  border-radius: 32px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.45), transparent 30%),
    linear-gradient(180deg, #ffd9e6 0%, #fff2f7 100%);
}

.winged-heart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 32px;
}

.winged-heart .main-heart {
  font-size: 44px;
}

.intro-core {
  text-align: center;
}

.intro-number {
  font-size: 62px;
  font-weight: 700;
  color: #ff5b93;
  text-shadow: 0 6px 20px rgba(255, 91, 147, 0.24);
}

.intro-line {
  font-weight: 700;
  color: #d85883;
}

.intro-line-1 {
  margin-top: 10px;
  font-size: 40px;
}

.intro-line-2 {
  margin-top: 2px;
  font-size: 42px;
}

.intro-sub {
  margin-top: 14px;
  color: #915568;
  font-weight: 600;
}

.flipbook-screen {
  align-items: flex-start;
}

.book-stage {
  position: relative;
  padding-top: 18px;
}

.book-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.book-cloud {
  position: absolute;
  width: 84px;
  height: 30px;
  background: rgba(255, 255, 255, 0.68);
  border-radius: 999px;
  top: 18px;
}

.book-cloud::before,
.book-cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.book-cloud::before {
  width: 32px;
  height: 32px;
  left: 10px;
  top: -12px;
}

.book-cloud::after {
  width: 36px;
  height: 36px;
  right: 10px;
  top: -15px;
}

.cloud-left {
  left: 28px;
}

.cloud-right {
  right: 28px;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, 0.9),
    rgba(255, 192, 220, 0.6) 45%,
    rgba(255, 192, 220, 0.12) 70%
  );
}

.b1 {
  width: 36px;
  height: 36px;
  top: 18%;
  left: 14px;
}

.b2 {
  width: 28px;
  height: 28px;
  top: 14%;
  right: 22px;
}

.b3 {
  width: 22px;
  height: 22px;
  bottom: 24%;
  right: 14px;
}

.b4 {
  width: 18px;
  height: 18px;
  bottom: 18%;
  left: 22px;
}

.spark {
  position: absolute;
  color: #fff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.spark.small {
  font-size: 12px;
}

.s-a {
  top: 24%;
  left: 18%;
}

.s-b {
  top: 16%;
  right: 18%;
}

.s-c {
  bottom: 22%;
  left: 25%;
}

.s1 {
  left: 46px;
  top: 34%;
}

.s2 {
  right: 48px;
  top: 38%;
}

.s3 {
  left: 52%;
  top: 18%;
}

.s4 {
  left: 18%;
  bottom: 24%;
}

.book-shell {
  position: relative;
  margin-top: 22px;
  padding: 14px;
  border-radius: 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.45), transparent 25%),
    linear-gradient(180deg, #ffe1ec 0%, #fff4f8 100%);
  border: 1px solid rgba(255, 207, 223, 0.92);
  box-shadow: 0 24px 52px rgba(214, 112, 155, 0.18);
}

.book-top-emblem {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.flip-stage {
  position: relative;
  perspective: 1400px;
}

.flip-shadow {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: -10px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(204, 117, 154, 0.18), transparent 70%);
  filter: blur(8px);
  z-index: 0;
}

.flip-card {
  position: relative;
  width: 100%;
  min-height: 430px;
  transform-style: preserve-3d;
  will-change: transform;
  z-index: 1;
}

.flip-face {
  position: relative;
  width: 100%;
  min-height: 430px;
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: linear-gradient(
    90deg,
    #fffefd 0%,
    #fff8fb 48%,
    #fff1f6 52%,
    #fffefd 100%
  );
  box-shadow:
    inset 0 0 0 1px rgba(235, 189, 208, 0.55),
    inset 12px 0 24px rgba(255, 208, 223, 0.18),
    inset -12px 0 24px rgba(255, 208, 223, 0.18);
}

.flip-face::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    rgba(222, 162, 188, 0.15),
    rgba(205, 121, 156, 0.4),
    rgba(222, 162, 188, 0.15)
  );
}

.card-panel {
  padding: 18px 16px;
  position: relative;
  z-index: 1;
}

.left-panel h2 {
  margin: 10px 0 0;
  font-size: 28px;
  line-height: 1.22;
  color: #c94f79;
}

.page-count {
  color: #cf6889;
  font-size: 12px;
  font-weight: 700;
}

.left-panel p {
  margin: 12px 0 0;
  line-height: 1.85;
  color: #785161;
  font-size: 15px;
}

.right-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-panel img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 12px 26px rgba(206, 119, 154, 0.14);
}

.page-hotzone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background: transparent;
  border: none;
  z-index: 3;
  cursor: pointer;
}

.hotzone-left {
  left: 0;
}

.hotzone-right {
  right: 0;
}

.book-tip {
  margin-top: 12px;
  text-align: center;
  color: #9b6073;
  font-size: 13px;
  font-weight: 600;
}

.heart-screen {
  background: radial-gradient(circle at center, #ffe4ee 0%, #fff4f8 54%, #fff9fb 100%);
}

.heart-gate-card {
  border-radius: 30px;
  text-align: center;
  padding: 34px 20px;
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.42), transparent 26%),
    linear-gradient(180deg, #fffafb 0%, #ffeef5 100%);
}

.heart-gate-stars {
  display: flex;
  justify-content: center;
  gap: 16px;
  color: #f0a9c2;
  font-size: 16px;
  margin-bottom: 10px;
}

.heart-hint {
  font-size: 30px;
  line-height: 1.3;
  color: #cf5d84;
}

.heart-button {
  margin-top: 22px;
  border: none;
  background: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.heart-main {
  font-size: 84px;
}

.heart-wing {
  font-size: 30px;
}

.heart-note {
  margin-top: 18px;
  color: #8b5a6a;
  line-height: 1.75;
  font-weight: 500;
}

.final-screen,
.gallery-screen {
  background:
    radial-gradient(circle at 50% 25%, rgba(255, 90, 145, 0.18), transparent 18%),
    radial-gradient(circle at 50% 10%, rgba(255, 140, 180, 0.12), transparent 26%),
    linear-gradient(180deg, #050407 0%, #0c0710 55%, #100813 100%);
  overflow: hidden;
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.75) 1px, transparent 1px),
    radial-gradient(circle, rgba(255, 192, 220, 0.55) 1px, transparent 1px);
  background-size: 34px 34px, 56px 56px;
  background-position: 0 0, 18px 20px;
  opacity: 0.25;
  pointer-events: none;
}

.floating-words,
.gallery-bg-words {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-word {
  position: absolute;
  color: #ff9ec8;
  font-family: 'Mali', cursive;
  font-size: 20px;
  text-shadow:
    0 0 6px rgba(255, 170, 210, 0.65),
    0 0 16px rgba(255, 108, 168, 0.5),
    0 0 26px rgba(255, 108, 168, 0.24);
  z-index: 1;
  animation: glowBlink 2.2s ease-in-out infinite;
}

.gallery-word {
  color: #ffb1d0;
}

.final-wrap,
.gallery-wrap {
  width: 100%;
  max-width: 430px;
  position: relative;
  z-index: 1;
  text-align: center;
}

.firework-heart-wrap {
  position: relative;
  height: 210px;
}

.heart-particles {
  position: absolute;
  inset: 0;
}

.heart-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffd6e8 0%, #ff6fa4 55%, #ff2f7f 100%);
  box-shadow:
    0 0 10px rgba(255, 111, 164, 0.8),
    0 0 18px rgba(255, 111, 164, 0.35);
}

.final-main-title {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  width: 100%;
  color: #fff;
  font-size: 28px;
  line-height: 1.2;
}

.ring-scene {
  width: 100%;
  height: 330px;
  perspective: 1400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-ring {
  position: relative;
  width: 180px;
  height: 180px;
  transform-style: preserve-3d;
}

.ring-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 104px;
  height: 136px;
  margin-left: -52px;
  margin-top: -68px;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 175, 210, 0.22);
  box-shadow: 0 10px 22px rgba(255, 100, 160, 0.18);
}

.ring-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.final-next-btn {
  margin-top: 6px;
}

.final-bottom-note {
  margin-top: 12px;
  color: #ffd7e7;
  line-height: 1.85;
  font-weight: 600;
}

.gallery-wrap-float {
  max-width: 100%;
  width: 100%;
  min-height: 100vh;
  padding-top: 40px;
}

.gallery-title {
  color: #ff87bb;
  font-size: 34px;
  text-shadow: 0 0 16px rgba(255, 89, 149, 0.6);
}

.gallery-float-stage {
  position: relative;
  width: 100%;
  min-height: 980px;
  margin-top: 28px;
  padding-top: 10px;
}

.gallery-float-card {
  position: absolute;
  border: none;
  background: transparent;
  padding: 0;
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 0 0 2px rgba(255, 203, 225, 0.22),
    0 0 24px rgba(255, 98, 158, 0.18);
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.gallery-float-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 18px;
}

.photo-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(6, 4, 9, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.photo-modal-image {
  max-width: min(92vw, 760px);
  max-height: 88vh;
  border-radius: 22px;
  box-shadow: 0 0 30px rgba(255, 120, 176, 0.25);
}

.photo-modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 28px;
  cursor: pointer;
}

@keyframes glowBlink {
  0%,
  100% {
    opacity: 0.78;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.22);
  }
}

@media (max-width: 430px) {
  .flip-card,
  .flip-face {
    min-height: 430px;
  }

  .left-panel h2 {
    font-size: 26px;
  }

  .left-panel p {
    font-size: 14px;
  }

  .heart-hint {
    font-size: 28px;
  }

  .final-main-title,
  .gallery-title {
    font-size: 24px;
  }

.gallery-float-stage {
  min-height: 980px;
}
}

@media (min-width: 431px) {
  .screen {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>