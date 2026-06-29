const filterButtons = document.querySelectorAll(".filters button");
const projects = document.querySelectorAll(".project");
const modal = document.querySelector("#projectModal");
const modalData = [
  ["美妆护肤 · 详情页", "澄光精华｜新品视觉全案", "从成分卖点、使用场景到产品质感，建立一套轻盈通透的新品视觉语言。详情页通过递进式内容结构，让消费者快速理解产品功效。", "#ffc6aa", "负责内容：视觉策略 / 详情页 / 主图延展"],
  ["食品饮料 · 电商主图", "青柠气泡水｜夏日上新", "以高明度蓝绿和倾斜构图表达清爽气泡感，建立适合夏季营销节点的系列化商品主图。", "#9ed8ee", "负责内容：主视觉 / 商品主图 / 活动推广图"],
  ["3C数码 · 实时直播间录屏", "品牌日｜直播视觉系统", "围绕直播大促节点，设计主背景、权益贴片、商品卡与节奏转场，统一品牌直播间的视觉秩序。", "#252237", "负责内容：直播背景 / 权益贴片 / 商品卡"],
  ["个护清洁 · 电商主图", "植萃洗护｜主图系列", "使用清新自然的色彩与轻盈构图，强化产品蓬松、植物配方的核心感知。", "#dff06c", "负责内容：电商主图 / 卖点图 / 系列延展"],
  ["综合电商 · 直播间动态视觉", "热点借势型直播间视觉升级", "借助赛事热点、冠军奖杯、赛场氛围与促销信息整合，强化直播间停留率、产品关注度与购买转化。", "#ef3f2c", "负责内容：热点策划 / 直播视觉 / 动效设计"],
  ["家居香氛 · 详情页", "晚安香氛｜内容详情设计", "以柔和低饱和色彩营造夜间情绪，让香型、使用场景与产品价值更具感知力。", "#c8b9ee", "负责内容：内容策划 / 详情页 / 场景图"],
  ["直播电商 · 直播间动态视觉", "直播视觉｜动态视觉展示 02", "直播间动态视觉与贴片效果录屏，展示视觉素材在真实直播场景中的动态呈现与节奏表现。", "#9d7435", "负责内容：实时直播间录屏 / 动态视觉 / 录屏展示"]
];

function loadVideo(video) {
  if (!video || video.dataset.loaded === "true") return;
  const source = video.querySelector("source");
  if (!source) return;
  const src = source.dataset.src || source.getAttribute("src");
  if (!src) return;
  source.src = src;
  source.removeAttribute("data-src");
  video.load();
  video.dataset.loaded = "true";
}

let videoLoadTicking = false;
function loadVisibleVideos() {
  videoLoadTicking = false;
  document.querySelectorAll("video[data-lazy-video]").forEach(video => {
    const project = video.closest(".project");
    if (project && project.classList.contains("hidden")) return;
    const rect = video.getBoundingClientRect();
    if (rect.top < window.innerHeight + 700 && rect.bottom > -300) loadVideo(video);
  });
}

function scheduleVisibleVideos() {
  if (videoLoadTicking) return;
  videoLoadTicking = true;
  requestAnimationFrame(loadVisibleVideos);
}

document.querySelectorAll("video[data-lazy-video]").forEach(video => {
  video.addEventListener("pointerdown", () => loadVideo(video), { once: true });
  video.addEventListener("pointerenter", () => loadVideo(video), { once: true });
  video.addEventListener("focus", () => loadVideo(video), { once: true });
  video.addEventListener("play", () => loadVideo(video), { once: true });
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    projects.forEach(project => {
      project.classList.toggle("hidden", filter !== "all" && !project.dataset.category.includes(filter));
    });
    scheduleVisibleVideos();
  });
});

document.querySelectorAll("[data-jump-filter]").forEach(link => {
  link.addEventListener("click", () => {
    const targetFilter = link.dataset.jumpFilter;
    const targetButton = document.querySelector(`.filters button[data-filter="${targetFilter}"]`);
    if (targetButton) targetButton.click();
  });
});

window.addEventListener("load", () => {
  const videoButton = document.querySelector('.filters button[data-filter="video"]');
  if (videoButton) videoButton.click();
  scheduleVisibleVideos();
});

window.addEventListener("scroll", scheduleVisibleVideos, { passive: true });
window.addEventListener("resize", scheduleVisibleVideos);

document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const carouselImages = {
    promo: [
      "assets/promo-01.png",
      "assets/promo-02.png",
      "assets/promo-03.png",
      "assets/promo-04.png",
      "assets/promo-05.png",
      "assets/promo-06.png",
      "assets/promo-07.png"
    ],
    main: [
      "assets/main-visual-01.png",
      "assets/main-visual-02.png",
      "assets/main-visual-03.png",
      "assets/main-visual-04.png",
      "assets/main-visual-05.png",
      "assets/main-visual-06.png",
      "assets/main-visual-07.png"
    ],
    detail: [
      "assets/detail-carousel-01.png",
      "assets/detail-carousel-02.jpg",
      "assets/detail-carousel-03.jpg",
      "assets/detail-carousel-04.png"
    ]
  };
  const carouselType = carousel.getAttribute("data-carousel-type") || "promo";
  const images = carouselImages[carouselType] || carouselImages.promo;
  const image = carousel.querySelector(".carousel-image");
  const count = carousel.querySelector(".carousel-count");
  const dots = carousel.querySelector(".carousel-dots");
  let index = 0;

  dots.innerHTML = images.map((_, itemIndex) => `<i class="${itemIndex === 0 ? "active" : ""}"></i>`).join("");
  const dotItems = [...dots.querySelectorAll("i")];

  function updateCarousel(nextIndex) {
    index = (nextIndex + images.length) % images.length;
    image.src = images[index];
    const detailFrame = carousel.querySelector(".carousel-detail-frame");
    if (detailFrame) detailFrame.scrollTop = 0;
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
    dotItems.forEach((dot, itemIndex) => dot.classList.toggle("active", itemIndex === index));
  }

  carousel.querySelector(".carousel-prev").addEventListener("click", event => {
    event.stopPropagation();
    updateCarousel(index - 1);
  });
  carousel.querySelector(".carousel-next").addEventListener("click", event => {
    event.stopPropagation();
    updateCarousel(index + 1);
  });
});

document.querySelectorAll(".carousel-detail-frame").forEach(frame => {
  let isDragging = false;
  let startY = 0;
  let startScrollTop = 0;

  frame.addEventListener("pointerdown", event => {
    isDragging = true;
    startY = event.clientY;
    startScrollTop = frame.scrollTop;
    frame.classList.add("dragging");
    frame.setPointerCapture(event.pointerId);
  });

  frame.addEventListener("pointermove", event => {
    if (!isDragging) return;
    frame.scrollTop = startScrollTop - (event.clientY - startY);
    event.preventDefault();
  });

  function stopDragging(event) {
    if (!isDragging) return;
    isDragging = false;
    frame.classList.remove("dragging");
    if (event.pointerId !== undefined) frame.releasePointerCapture(event.pointerId);
  }

  frame.addEventListener("pointerup", stopDragging);
  frame.addEventListener("pointercancel", stopDragging);
  frame.addEventListener("pointerleave", stopDragging);
});

document.querySelectorAll("[data-video-player]").forEach(player => {
  const videos = [
    "assets/live-scene-01.mp4",
    "assets/live-scene-02.mp4",
    "assets/live-scene-03.mp4",
    "assets/live-scene-04.mp4",
    "assets/live-scene-05.mp4",
    "assets/live-scene-06.mp4",
    "assets/live-scene-07.mp4",
    "assets/live-scene-08.mp4",
    "assets/live-scene-09.mp4",
    "assets/live-scene-10.mp4"
  ];
  const video = player.querySelector(".live-scene-video");
  const count = player.querySelector(".video-count");
  const dots = player.querySelector(".video-dots");
  let index = 0;

  dots.innerHTML = videos.map((_, itemIndex) => `<i class="${itemIndex === 0 ? "active" : ""}"></i>`).join("");
  const dotItems = [...dots.querySelectorAll("i")];

  function updateVideo(nextIndex) {
    index = (nextIndex + videos.length) % videos.length;
    video.pause();
    const source = video.querySelector("source");
    source.dataset.src = videos[index];
    source.removeAttribute("src");
    video.dataset.loaded = "false";
    loadVideo(video);
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(videos.length).padStart(2, "0")}`;
    dotItems.forEach((dot, itemIndex) => dot.classList.toggle("active", itemIndex === index));
  }

  player.querySelector(".video-prev").addEventListener("click", event => {
    event.stopPropagation();
    updateVideo(index - 1);
  });

  player.querySelector(".video-next").addEventListener("click", event => {
    event.stopPropagation();
    updateVideo(index + 1);
  });
});

const contactModal = document.querySelector("#contactModal");
document.querySelectorAll("[data-contact-open]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    contactModal.showModal();
  });
});

contactModal.querySelector(".contact-close").addEventListener("click", () => contactModal.close());
contactModal.addEventListener("click", event => {
  if (event.target === contactModal) contactModal.close();
});

function openProject(project) {
  const data = modalData[Number(project.dataset.project)];
  modal.querySelector(".modal-tag").textContent = data[0];
  modal.querySelector("h2").textContent = data[1];
  modal.querySelector("p").textContent = data[2];
  modal.querySelector(".modal-meta").textContent = data[4];
  const modalVisual = modal.querySelector(".modal-visual");
  if (project.dataset.category.includes("video")) {
    const videoSrc = project.dataset.video || "assets/live-recording.mp4";
    modalVisual.innerHTML = `<video class="modal-video" controls autoplay playsinline><source src="${videoSrc}" type="video/mp4">当前浏览器不支持视频播放。</video>`;
    modalVisual.style.background = "#050505";
  } else {
    modalVisual.innerHTML = "";
    modalVisual.style.background = `linear-gradient(135deg, ${data[3]}, #ffffff)`;
  }
  modal.showModal();
}

modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});
modal.addEventListener("close", () => {
  const video = modal.querySelector("video");
  if (video) video.pause();
});
