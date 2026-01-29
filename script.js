let noClicks = 0;

const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const letter = document.getElementById("letter");
const openChoices = document.getElementById("openChoices");
const centerContent = document.querySelector(".center-content");
const photoBackground = document.getElementById("photoBackground");
const loveMessage = document.getElementById("loveMessage");
const loveSong = document.getElementById("loveSong");
const noMessage = document.getElementById("noMessage");
const photos = document.querySelectorAll('.photo-background img');
const grabSound = document.getElementById('grabSound');

photos.forEach(photo => {
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let offsetX = 0;
  let offsetY = 0;

  const lerp = (a, b, n) => a + (b - a) * n;

  const animate = () => {
    if (!isDragging) return;
    currentX = lerp(currentX, targetX, 0.18);
    currentY = lerp(currentY, targetY, 0.18);
    photo.style.setProperty('--x', `${currentX}px`);
    photo.style.setProperty('--y', `${currentY}px`);
    requestAnimationFrame(animate);
  };

    const startDrag = (x, y) => {
    if (getComputedStyle(photo).opacity < 0.5) return;
    isDragging = true;
    photo.classList.add('dragging');
    photo.classList.remove('moved');

    // Lee la posición actual de las variables CSS
    currentX = parseFloat(photo.style.getPropertyValue('--x')) || 0;
    currentY = parseFloat(photo.style.getPropertyValue('--y')) || 0;
    targetX = currentX;
    targetY = currentY;

    // Calcula el offset correctamente
    const rect = photo.getBoundingClientRect();
    // La posición real de la imagen en pantalla
    const imgX = rect.left + window.scrollX;
    const imgY = rect.top + window.scrollY;
    // Offset entre el mouse y la esquina de la imagen
    offsetX = x - imgX;
    offsetY = y - imgY;

    if (grabSound) {
        grabSound.currentTime = 0;
        grabSound.volume = 0.05;
        grabSound.play();
    }
    requestAnimationFrame(animate);
    };

    const drag = (x, y) => {
    if (!isDragging) return;
    // Calcula la nueva posición relativa al punto donde agarraste
    targetX = (x - offsetX) - photo.offsetLeft;
    targetY = (y - offsetY) - photo.offsetTop;
    };

    const endDrag = () => {
    if (!isDragging) return;

    isDragging = false;
    photo.classList.remove('dragging');
    photo.classList.add('moved'); // <-- Agrega esta línea

    const randomRot = (Math.random() * 10 - 5).toFixed(2);
    photo.style.setProperty('--rot', `${randomRot}deg`);
    };

  /* Mouse */
  photo.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', e => {
    drag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', endDrag);

  /* Touch */
  photo.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const t = e.touches[0];
    drag(t.clientX, t.clientY);
  }, { passive: false });

  document.addEventListener('touchend', endDrag);
});
// Abrir carta
openChoices.addEventListener("click", () => {
  letter.style.display = "none";
  centerContent.style.display = "block";
});

// Botón No se achica
noBtn.addEventListener("click", () => {
  noClicks++;

  // Achicar NO
  const noScale = Math.max(1 - noClicks * 0.35, 0);
  noBtn.style.transform = `scale(${noScale})`;

  // Agrandar SÍ
  const yesScale = 1 + noClicks * 0.25;
  yesBtn.style.transform = `scale(${yesScale})`;

  if (noClicks >= 3) {
    noBtn.style.display = "none";
    noMessage.classList.add("show");
  }
});

// Botón Sí
yesBtn.addEventListener("click", () => {
  centerContent.style.display = "none";

  photoBackground.classList.add("show");

  loveSong.currentTime = 5;
  loveSong.volume = 0.1;
  loveSong.play();

  setTimeout(() => {
    loveMessage.classList.add("show");
  }, 800);

  // Confetti
  const duration = 10 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > animationEnd) return clearInterval(interval);

    confetti({
      particleCount: 60,
      spread: 360,
      startVelocity: 30,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
  }, 250);
});
