document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event triggered");

  const searchNav = document.getElementById("searchNav");
  const regionInfoNav = document.getElementById("regionInfoNav");
  const searchArea = document.getElementById("searchArea");
  const mapContainer = document.querySelector(".map-container");
  const backgroundContainer = document.querySelector(".background-container");

  console.log("Elements initialized:", {
    searchNav,
    regionInfoNav,
    searchArea,
    mapContainer,
  });

  // 배경 이미지 배열
  const backgrounds = [
    "image/BG1.jpg",
    "image/BG2.jpg",
    "image/BG3.jpg",
    "image/BG4.jpg",
    "image/BG5.jpg",
    "image/BG6.jpg",
    "image/BG7.jpg",
    "image/BG8.jpg",
    "image/BG9.jpg",
    "image/BG10.jpg",
    "image/BG11.jpg",
    "image/BG12.jpg",
  ];

  let currentBackgroundIndex = 0;

  function changeBackground() {
    console.log("Background change triggered");

    const activeBackground = backgroundContainer.querySelector(
      ".background-image.active"
    );
    if (activeBackground) {
      activeBackground.classList.remove("active");
      setTimeout(() => {
        activeBackground.remove();
      }, 2000);
    }
    const newBackground = document.createElement("div");
    newBackground.className = "background-image active";
    newBackground.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
    backgroundContainer.appendChild(newBackground);

    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
  }

  const initialBackground = document.createElement("div");
  initialBackground.className = "background-image active";
  initialBackground.style.backgroundImage = `url('${backgrounds[0]}')`;
  backgroundContainer.appendChild(initialBackground);

  changeBackground();
  setInterval(changeBackground, 7000);

  // 지도, 검색창 숨김처리 기능
  searchArea.style.display = "none";
  mapContainer.style.display = "none";

  searchNav.addEventListener("click", function () {
    console.log("Search button clicked");
    if (
      searchArea.style.display === "none" ||
      searchArea.style.display === ""
    ) {
      searchArea.style.display = "flex";
      mapContainer.style.display = "none";

      searchNav.classList.add("active");
      regionInfoNav.classList.remove("active");
    } else {
      searchArea.style.display = "none";
      searchNav.classList.remove("active");
    }
  });

  regionInfoNav.addEventListener("click", function () {
    console.log("Region Info button clicked");
    if (
      mapContainer.style.display === "none" ||
      mapContainer.style.display === ""
    ) {
      mapContainer.style.display = "block";
      searchArea.style.display = "none";
      regionInfoNav.classList.add("active");
      searchNav.classList.remove("active");
    } else {
      mapContainer.style.display = "none";
      regionInfoNav.classList.remove("active");
    }
  });
});

function goToRoulette() {
  console.log("Roulette button clicked");
  window.location.href = "roulette.html";
}

function setActiveButton(activeButton) {
  [searchNav, regionInfoNav].forEach((btn) => btn.classList.remove("active"));
  activeButton.classList.add("active");
}
