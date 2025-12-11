// ===================== BIẾN TOÀN CỤC =====================
let currentSlide = 0;
let snowEnabled = true;
let musicPlaying = false;
let animationEnabled = true;
let autoSlideInterval;

// Canvas cho tuyết
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");
let snowflakes = [];
let animationId;

// ===================== KHỞI TẠO =====================
window.addEventListener("load", init);
window.addEventListener("resize", debounce(handleResize, 250));

function init() {
  setupCanvas();
  createSnowflakes();
  animateSnow();
  setupSlideshow();
  checkURLParams();
  autoPlayMusic(); // Tự động phát nhạc khi load trang
}

// ===================== TỰ ĐỘNG PHÁT NHẠC =====================
function autoPlayMusic() {
  const music = document.getElementById("bgMusic");

  // Thử phát nhạc ngay khi load
  music
    .play()
    .then(() => {
      musicPlaying = true;
      console.log("Nhạc đã tự động phát");
    })
    .catch((err) => {
      console.log("Trình duyệt chặn autoplay, sẽ phát khi có tương tác:", err);
      musicPlaying = false;

      // Thêm event listener để phát nhạc khi có bất kỳ tương tác nào
      const playOnInteraction = () => {
        if (!musicPlaying) {
          music
            .play()
            .then(() => {
              musicPlaying = true;
              console.log("Nhạc đã phát sau tương tác");
            })
            .catch((e) => console.log("Vẫn không thể phát:", e));
        }
        // Xóa listener sau khi đã phát
        document.removeEventListener("click", playOnInteraction);
        document.removeEventListener("touchstart", playOnInteraction);
      };

      document.addEventListener("click", playOnInteraction);
      document.addEventListener("touchstart", playOnInteraction);
    });
}

// ===================== CANVAS TUYẾT RƠI =====================
function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createSnowflakes() {
  const count = window.innerWidth < 768 ? 80 : 150;
  snowflakes = [];
  for (let i = 0; i < count; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 1.5,
      drift: Math.random() * 0.8 - 0.4,
    });
  }
}

function animateSnow() {
  if (!snowEnabled) {
    animationId = requestAnimationFrame(animateSnow);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();

  snowflakes.forEach((flake) => {
    ctx.moveTo(flake.x, flake.y);
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

    flake.y += flake.speed;
    flake.x += flake.drift;

    if (flake.y > canvas.height) {
      flake.y = -10;
      flake.x = Math.random() * canvas.width;
    }

    if (flake.x > canvas.width) flake.x = 0;
    if (flake.x < 0) flake.x = canvas.width;
  });

  ctx.fill();
  animationId = requestAnimationFrame(animateSnow);
}

function toggleSnow() {
  snowEnabled = !snowEnabled;
  const btn = document.getElementById("snowBtn");
  btn.textContent = snowEnabled ? "❄️ Tắt tuyết" : "❄️ Bật tuyết";

  if (!snowEnabled) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ===================== MỞ PHONG BÌ =====================
function openEnvelope() {
  const wrapper = document.getElementById("envelopeWrapper");
  const letter = document.getElementById("letter");
  const stickers = document.getElementById("stickers");
  const music = document.getElementById("bgMusic");

  wrapper.classList.add("opened");

  // Đảm bảo nhạc đang phát (nếu chưa phát do autoplay bị chặn)
  if (!musicPlaying) {
    music
      .play()
      .then(() => {
        musicPlaying = true;
        console.log("Nhạc đã phát khi mở phong bì");
      })
      .catch((err) => {
        console.log("Không thể phát nhạc:", err);
      });
  }

  setTimeout(() => {
    letter.classList.add("show", "letter-glow");
    if (stickers) stickers.classList.add("show");
  }, 800);

  // Bắt đầu slideshow tự động
  setTimeout(() => {
    startAutoSlide();
  }, 2000);
}

// ===================== SLIDESHOW =====================
function setupSlideshow() {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("dotsContainer");

  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
  });
}

function changeSlide(direction) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");

  currentSlide += direction;

  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");

  resetAutoSlide();
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");

  currentSlide = index;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");

  resetAutoSlide();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    changeSlide(1);
  }, 3000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// ===================== NHẠC NỀN (Không còn sử dụng button) =====================
// Hàm toggleMusic đã được bỏ vì nhạc tự động phát

// ===================== ANIMATION TOGGLE =====================
function toggleAnimation() {
  animationEnabled = !animationEnabled;
  document.body.classList.toggle("reduce-motion");
}

// ===================== SHARE =====================
function shareCard() {
  const name = prompt("Nhập tên người nhận (hoặc để trống):") || "Bạn";
  const url = `${window.location.origin}${
    window.location.pathname
  }?to=${encodeURIComponent(name)}`;

  if (navigator.share) {
    navigator.share({
      title: "Thư Giáng Sinh 2025",
      text: `${name} ơi, bạn có một thư Giáng Sinh!`,
      url: url,
    });
  } else {
    prompt("Copy link này để chia sẻ:", url);
  }
}

// ===================== URL PARAMS =====================
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  const toName = params.get("to");

  if (toName) {
    const subtitle = document.querySelector(".letter-subtitle");
    subtitle.textContent = `Gửi đến: ${decodeURIComponent(toName)}`;
  }
}

// ===================== RESIZE HANDLER =====================
function handleResize() {
  setupCanvas();
  createSnowflakes();
}

// ===================== UTILITY =====================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===================== HIỆU ỨNG THẢ TIM / ẢNH RƠI =====================
// ===================== MƯA TIM + ẢNH GIÁNG SINH SIÊU ĐẸP =====================
const fallingContainer = document.querySelector(".falling-container");

// Danh sách tất cả ảnh (thêm bao nhiêu cũng được!)
const fallingImages = [
  "img/6.jpg",
  "img/7.webp",
  "img/8.jpg",
  "img/9.jpeg",
  "img/10.jpep",
  "img/11.jpg",
  "img/12.jpg",
  "img/13.jpg",
  // Thêm thoải mái: 'falling/abc.png', ...
];

function createFallingItem() {
  const item = document.createElement("div");
  item.classList.add("falling-item");

  // Tạo thẻ img
  const img = document.createElement("img");
  img.src = fallingImages[Math.floor(Math.random() * fallingImages.length)];

  // Kích thước ngẫu nhiên (30px → 70px)
  const size = Math.random() * 40 + 60;
  img.style.width = size + "px";
  img.style.height = "auto";

  // Hiệu ứng lắc lư khi rơi (siêu đẹp)
  img.style.animation = `fall ${
    Math.random() * 8 + 10
  }s linear infinite, sway ${
    Math.random() * 2 + 1
  }s ease-in-out infinite alternate`;

  item.appendChild(img);
  item.style.left = Math.random() * 100 + "vw";
  item.style.animationDuration = Math.random() * 10 + 10 + "s"; // rơi chậm, nhẹ nhàng

  fallingContainer.appendChild(item);

  // Xóa sau khi rơi xong
  setTimeout(() => {
    if (item.parentNode) item.remove();
  }, 25000);
}

// Bắt đầu mưa ngay khi vào trang
setInterval(createFallingItem, 900); // 0.35 giây thả 1 cái → mưa dày, lãng mạn cực kỳ

// ===================== CLEANUP =====================
window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationId);
  clearInterval(autoSlideInterval);
});
