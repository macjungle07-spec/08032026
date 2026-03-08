import { gsap } from 'gsap'

export function useGsapScenes() {
  let introTl = null
  let ringTl = null
  let wordsTween = null
  let heartTl = null
  let galleryEnterTl = null
  let galleryFloatTweens = []

  function cleanup() {
    introTl?.kill()
    ringTl?.kill()
    wordsTween?.kill()
    heartTl?.kill()
    galleryEnterTl?.kill()
    galleryFloatTweens.forEach((tw) => tw.kill())
    galleryFloatTweens = []
  }

  function runIntro({ numberEl, happyEl, womenEl, subEl, onComplete }) {
    introTl?.kill()

    gsap.set([happyEl, womenEl, subEl], {
      opacity: 0,
      y: 26,
      scale: 0.92
    })

    gsap.set(numberEl, {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0
    })

    introTl = gsap.timeline({ onComplete })

    introTl
      .to(numberEl, {
        scale: 1.16,
        y: -14,
        rotate: -2,
        duration: 0.7,
        ease: 'back.out(1.8)'
      })
      .to(
        happyEl,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.6)'
        },
        '-=0.15'
      )
      .to(
        womenEl,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(1.6)'
        },
        '-=0.08'
      )
      .to(
        subEl,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.42,
          ease: 'power2.out'
        },
        '-=0.05'
      )
  }

  function flipForward(cardEl, updateContent, onDone) {
    gsap
      .timeline({ onComplete: onDone })
      .to(cardEl, {
        rotationY: -92,
        scale: 0.985,
        duration: 0.38,
        ease: 'power2.in'
      })
      .add(updateContent)
      .set(cardEl, { rotationY: 92 })
      .to(cardEl, {
        rotationY: 0,
        scale: 1,
        duration: 0.52,
        ease: 'power3.out'
      })
  }

  function flipBackward(cardEl, updateContent, onDone) {
    gsap
      .timeline({ onComplete: onDone })
      .to(cardEl, {
        rotationY: 92,
        scale: 0.985,
        duration: 0.38,
        ease: 'power2.in'
      })
      .add(updateContent)
      .set(cardEl, { rotationY: -92 })
      .to(cardEl, {
        rotationY: 0,
        scale: 1,
        duration: 0.52,
        ease: 'power3.out'
      })
  }

  function closeBook(bookShellEl, onComplete) {
    gsap
      .timeline({ onComplete })
      .to(bookShellEl, {
        scale: 0.93,
        rotateY: -14,
        duration: 0.6,
        ease: 'power2.inOut'
      })
      .to(bookShellEl, {
        opacity: 0.25,
        y: 10,
        duration: 0.45,
        ease: 'power2.out'
      })
  }

  function runHeartFirework(particleEls, titleEl) {
    heartTl?.kill()

    gsap.set(particleEls, {
      opacity: 0,
      scale: 0,
      xPercent: -50,
      yPercent: -50
    })

    gsap.set(titleEl, {
      opacity: 0,
      y: 18,
      scale: 0.96
    })

    heartTl = gsap.timeline()

    heartTl
      .to(particleEls, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: {
          each: 0.01,
          from: 'random'
        },
        ease: 'back.out(2.4)'
      })
      .to(
        titleEl,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(1.5)'
        },
        '-=0.45'
      )

    gsap.to(particleEls, {
      scale: 'random(0.72,1.38)',
      opacity: 'random(0.55,1)',
      duration: 'random(1.4,2.6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.01,
        from: 'random'
      }
    })
  }

  function runFloatingWords(wordEls) {
    wordsTween?.kill()

    gsap.set(wordEls, {
      opacity: 0.4,
      x: 0,
      y: 0,
      rotate: 0
    })

    wordsTween = gsap.to(wordEls, {
      x: 'random(-40,40)',
      y: 'random(-50,50)',
      rotate: 'random(-8,8)',
      opacity: 'random(0.55,1)',
      duration: 'random(3.2,5.6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.18,
        from: 'random'
      }
    })
  }

  function runPhotoRing(ringEl) {
    ringTl?.kill()

    gsap.set(ringEl, {
      rotationX: -8,
      rotationY: 0,
      rotationZ: 0
    })

    ringTl = gsap.timeline({ repeat: -1 })
    ringTl
      .to(ringEl, {
        rotationY: '+=100',
        rotationX: 6,
        rotationZ: 3,
        duration: 8.5,
        ease: 'sine.inOut'
      })
      .to(ringEl, {
        rotationY: '+=90',
        rotationX: -10,
        rotationZ: -4,
        duration: 8,
        ease: 'sine.inOut'
      })
      .to(ringEl, {
        rotationY: '+=110',
        rotationX: 4,
        rotationZ: 5,
        duration: 8.8,
        ease: 'sine.inOut'
      })
  }

  function runGalleryCards(cardEls) {
    galleryEnterTl?.kill()
    galleryFloatTweens.forEach((tw) => tw.kill())
    galleryFloatTweens = []

    gsap.set(cardEls, {
      opacity: 0,
      y: 120,
      scale: 0.82,
      rotate: () => gsap.utils.random(-12, 12)
    })

    galleryEnterTl = gsap.timeline()
    galleryEnterTl.to(cardEls, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: () => gsap.utils.random(-6, 6),
      duration: 0.9,
      ease: 'back.out(1.5)',
      stagger: 0.08
    })

    cardEls.forEach((card) => {
      const tw = gsap.to(card, {
        y: 'random(-24,24)',
        x: 'random(-18,18)',
        rotate: 'random(-9,9)',
        duration: 'random(2.8,4.8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 0.8
      })
      galleryFloatTweens.push(tw)
    })
  }

  return {
    cleanup,
    runIntro,
    flipForward,
    flipBackward,
    closeBook,
    runHeartFirework,
    runFloatingWords,
    runPhotoRing,
    runGalleryCards
  }
}