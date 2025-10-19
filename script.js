// Referencias a elementos
const page1 = document.getElementById("page1")
const page2 = document.getElementById("page2")
const logoContainer = document.getElementById("logoContainer")
const bgMusic1 = document.getElementById("bgMusic1")
const bgMusic2 = document.getElementById("bgMusic2")
const videoContainer = document.getElementById("videoContainer")
const mainVideo = document.getElementById("mainVideo")
const playOverlay = document.getElementById("playOverlay")

// Referencias para el Typewriter
const initialText = document.getElementById("initialText")
const missionText = document.getElementById("missionText")
const secondClickText = document.getElementById("secondClickText")
const line1 = document.getElementById("line1")
const line2 = document.getElementById("line2")
const line3 = document.getElementById("line3")
const page2Content = document.getElementById("page2Content")

const closeModalButton = document.getElementById("closeModalButton")

// Texto a escribir
const missionMessage = [
  "Bienvenido Araña.",
  "Hoy cumpliste una misión muy importante:",
  "lograste sobrevivir un año de muchas aventuras.",
]
const typingSpeed = 50
const lineDelay = 500

/**
 * Función Typewriter (Máquina de Escribir)
 */
function typeWriter(textElement, text, i, callback) {
  if (i === 0) {
    textElement.innerHTML = ""
  }
  if (i < text.length) {
    textElement.innerHTML += text.charAt(i)
    setTimeout(() => typeWriter(textElement, text, i + 1, callback), typingSpeed)
  } else {
    textElement.classList.add("finished-typing")
    if (callback) callback()
  }
}

// Intentar reproducir música de la primera página al cargar
window.addEventListener("load", () => {
  bgMusic1.play().catch((error) => {
    console.log("Autoplay bloqueado. Esperando primer clic.")
  })
})

// 1. PRIMER CLIC (en el logo)
logoContainer.addEventListener(
  "click",
  () => {
    bgMusic1.play().catch((error) => {
      console.log("Error al reproducir música 1:", error)
    })
    initialText.classList.add("hidden")
    missionText.classList.remove("hidden")
    logoContainer.style.cursor = "default"
    logoContainer.style.pointerEvents = "none"

    typeWriter(line1, missionMessage[0], 0, () => {
      setTimeout(() => {
        typeWriter(line2, missionMessage[1], 0, () => {
          setTimeout(() => {
            typeWriter(line3, missionMessage[2], 0, () => {
              secondClickText.classList.remove("hidden")
              secondClickText.addEventListener(
                "click",
                () => {
                  openModal()
                },
                { once: true },
              )
            })
          }, lineDelay)
        })
      }, lineDelay)
    })
  },
  { once: true },
)

/**
 * Función para ABRIR el modal - page1 queda visible con blur
 */
function openModal() {
  bgMusic1.pause()
  bgMusic1.currentTime = 0

  page1.classList.add("modal-open")
  page2.classList.add("active")

  bgMusic2.play().catch((error) => {
    console.log("Error al reproducir música de página 2:", error)
  })
}

/**
 * Función para CERRAR el modal - vuelve a page1
 */
function closeModal() {
  page2.classList.remove("active")
  page1.classList.remove("modal-open")

  bgMusic2.pause()
  bgMusic2.currentTime = 0
  mainVideo.pause()
  playOverlay.classList.remove("hidden")

  if (isFullscreen) {
    exitFullscreen()
  }

  bgMusic1.play().catch((error) => {
    console.log("Error al reanudar música 1:", error)
  })
}

closeModalButton.addEventListener("click", closeModal)

// Cerrar al hacer clic en el fondo oscuro (backdrop)
page2.addEventListener("click", (e) => {
  if (e.target === page2) {
    closeModal()
  }
})

// Control del video
let isFullscreen = false

videoContainer.addEventListener("click", () => {
  if (!isFullscreen) {
    videoContainer.classList.add("fullscreen")
    playOverlay.classList.add("hidden")
    mainVideo.play()
    bgMusic2.pause()
    isFullscreen = true

    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen()
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen()
    } else if (videoContainer.msRequestFullscreen) {
      videoContainer.msRequestFullscreen()
    }
  }
})

// Detectar cuando sale de pantalla completa
document.addEventListener("fullscreenchange", handleFullscreenChange)
document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
document.addEventListener("mozfullscreenchange", handleFullscreenChange)
document.addEventListener("MSFullscreenChange", handleFullscreenChange)

function handleFullscreenChange() {
  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.mozFullScreenElement &&
    !document.msFullscreenElement
  ) {
    exitFullscreen()
  }
}

function exitFullscreen() {
  videoContainer.classList.remove("fullscreen")
  mainVideo.pause()
  bgMusic2.play().catch((e) => console.log(e))
  playOverlay.classList.remove("hidden")
  isFullscreen = false
}

mainVideo.addEventListener("ended", () => {
  playOverlay.classList.remove("hidden")
  bgMusic2.play().catch((e) => console.log(e))
})

mainVideo.addEventListener("click", (e) => {
  if (isFullscreen) {
    e.stopPropagation()
    if (mainVideo.paused) {
      mainVideo.play()
      bgMusic2.pause()
      playOverlay.classList.add("hidden")
    } else {
      mainVideo.pause()
      bgMusic2.play().catch((e) => console.log(e))
      playOverlay.classList.remove("hidden")
    }
  }
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (isFullscreen) {
      exitFullscreen()
    } else if (page2.classList.contains("active")) {
      closeModal()
    }
  }
})
