/* ================= NAME ================= */
const birthdayGirl = "Sakshu (Chiku)!.. ❤️";
document.getElementById("title").innerText = `Happy Birthday ${birthdayGirl}`;

let celebrationStarted = false;
let galleryStarted = false;

/* ================= THREE.JS CAKE ================= */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / 420,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, 420);
document.getElementById("cakeCanvas").appendChild(renderer.domElement);

/* Lights */
scene.add(new THREE.AmbientLight(0xffffff, 1));
const light = new THREE.PointLight(0xffc0cb, 1.5);
light.position.set(5, 6, 5);
scene.add(light);

/* ================= CAKE ================= */
const cakeGroup = new THREE.Group();
const pink = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
const cream = new THREE.MeshStandardMaterial({ color: 0xfff1e6 });

[
  { r: 2.6, h: 1.2, y: 0, m: pink },
  { r: 1.9, h: 1, y: 1.2, m: cream },
  { r: 1.3, h: 0.8, y: 2.2, m: pink }
].forEach(t => {
  const tier = new THREE.Mesh(
    new THREE.CylinderGeometry(t.r, t.r, t.h, 64),
    t.m
  );
  tier.position.y = t.y;
  cakeGroup.add(tier);
});

/* ================= CANDLES + FLAMES ================= */
const flames = [];

for (let i = -1.2; i <= 1.2; i += 0.6) {

  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.6),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  candle.position.set(i, 3.1, 0);
  cakeGroup.add(candle);

  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffa500,
      emissiveIntensity: 1
    })
  );
  flame.position.set(i, 3.45, 0);
  cakeGroup.add(flame);

  flames.push(flame);
}

/* ================= SHINING HALO ================= */
const glowGeometry = new THREE.RingGeometry(3.2, 3.8, 64);
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffb6c1,
  transparent: true,
  opacity: 0.35,
  side: THREE.DoubleSide
});

const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
glowRing.rotation.x = Math.PI / 2;
glowRing.position.y = -0.1;
cakeGroup.add(glowRing);

/* Extra glow light */
const glowLight = new THREE.PointLight(0xffc0cb, 1.2, 15);
glowLight.position.set(0, 2, 4);
scene.add(glowLight);

/* ================= CENTER CAKE ================= */
scene.add(cakeGroup);
cakeGroup.position.set(0, 0, 0);
camera.position.z = 9;
camera.lookAt(0, 1.5, 0);

/* ================= ANIMATE ================= */
let glowPulse = 0;

function animate() {
  requestAnimationFrame(animate);

  cakeGroup.rotation.y += 0.008;

  // Flame flicker
  flames.forEach(f => {
    f.scale.y = 0.9 + Math.random() * 0.3;
    f.scale.x = 0.9 + Math.random() * 0.2;
  });

  // Glow pulse
  glowPulse += 0.03;
  glowRing.material.opacity = 0.25 + Math.sin(glowPulse) * 0.1;
  glowRing.scale.set(
    1 + Math.sin(glowPulse) * 0.03,
    1 + Math.sin(glowPulse) * 0.03,
    1
  );

  renderer.render(scene, camera);
}
animate();

/* ================= CAKE CUT ================= */
function cutCake() {
  if (celebrationStarted) return;
  celebrationStarted = true;

  cakeGroup.rotation.x = 0.7;

  document.getElementById("msg").style.display = "block";
  document.getElementById("bestWishes").style.display = "block";
  document.querySelector(".gift-container").style.display = "block";

  document.getElementById("song").play().catch(() => {});
  startCelebrationEmojis();
}

/* ================= CELEBRATION EMOJIS ================= */
function startCelebrationEmojis() {
  const emojis = ["🎉", "🎊", "🥳", "🎂", "✨", "💖"];
  let count = 0;

  const interval = setInterval(() => {
    const e = document.createElement("div");
    e.className = "heart";
    e.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = Math.random() * 100 + "vw";
    e.style.fontSize = "2rem";
    document.body.appendChild(e);

    setTimeout(() => e.remove(), 4000);
    count++;
    if (count > 25) clearInterval(interval);
  }, 150);
}

/* ================= GIFT ================= */
function openGift() {
  document.querySelector(".gift-box").classList.add("open");
  document.getElementById("surprise").style.display = "block";

  const gallery = document.getElementById("gallerySection");
  gallery.style.display = "block";

  if (!galleryStarted) {
    galleryStarted = true;
    startHearts();
    initGallery();
  }

  gallery.scrollIntoView({ behavior: "smooth" });
}

/* ================= FLOATING HEARTS ================= */
function startHearts() {
  const hearts = ["✨", "💓", "💖", "💕", "✨"];
  const interval = setInterval(() => {
    const h = document.createElement("div");
    h.className = "heart";
    h.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + "vw";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 4000);
  }, 300);

  setTimeout(() => clearInterval(interval), 8000);
}

/* ================= LIGHTBOX + SLIDESHOW ================= */
let images = [];
let currentIndex = 0;
let slideshowInterval;

function initGallery() {
  images = Array.from(document.querySelectorAll(".gallery img"));
  images.forEach((img, i) => img.onclick = () => openLightbox(i));
}

function openLightbox(index) {
  currentIndex = index;
  document.getElementById("lightbox").style.display = "flex";
  showSlide();
  slideshowInterval = setInterval(nextSlide, 2500);
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
  clearInterval(slideshowInterval);
}

function showSlide() {
  document.getElementById("lightboxImg").src = images[currentIndex].src;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  showSlide();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showSlide();
}
