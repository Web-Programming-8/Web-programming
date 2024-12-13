document.addEventListener("DOMContentLoaded", function () {
  const searchNav = document.getElementById("searchNav");
  const regionInfoNav = document.getElementById("regionInfoNav");
  const searchArea = document.getElementById("searchArea");
  const mapContainer = document.querySelector(".map-container");
  const backgroundContainer = document.querySelector(".background-container");
  const quoteElement = document.getElementById("quote");

  console.log("Elements initialized:", {
    searchNav,
    regionInfoNav,
    searchArea,
    mapContainer,
    quoteElement,
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

  // 문구 배열
  const quotes = [
    "우리는 목적지에 닿아야 행복해지는 것이 아니라 여행하는 과정에서 행복을 느낀다.",
    "여행은 정신을 다시 젊어지게 하는 샘이다.",
    "좋은 여행자는 고정된 계획이 없고 도착이 목적이 아니다.",
    "바보는 방황을 하고 현명한 사람은 여행을 한다.",
    "친구를 알고자 하거든 사흘만 같이 여행을 해라",
    "여행이란, 우리가 사는 장소를 바꿔주는 것이 아니라 우리의 생각과 편견을 바꿔주는 것이다.",
    "여행은 모든 세대를 통틀어 가장 잘 알려진 예방약이자 치료제이며 동시에 회복제이다.",
    "지금 이 시기가 여행하기 가장 적합한 시기이다.",
    "여행은 사람을 순수하게 그러나 강하게 만든다.",
    "단순하게 살아라. 현대인은 쓸데없는 절차와 일 때문에 얼마나 복잡한 삶을 살아가는가?",
    "행복은 습관이다, 그것을 몸에 지녀라",
  ];

  let currentQuoteIndex = 0;

  quoteElement.textContent = quotes[currentQuoteIndex];

  setInterval(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quoteElement.textContent = quotes[currentQuoteIndex];
  }, 11000);

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
  setInterval(changeBackground, 10000);

  // 지도, 검색창 숨김처리 기능
  searchArea.style.display = "none";
  mapContainer.style.display = "none";

  searchNav.addEventListener("click", function () {
    if (
      searchArea.style.display === "none" ||
      searchArea.style.display === ""
    ) {
      searchArea.style.display = "flex";
      mapContainer.style.display = "none";
    } else {
      searchArea.style.display = "none";
    }
  });

  regionInfoNav.addEventListener("click", function () {
    if (
      mapContainer.style.display === "none" ||
      mapContainer.style.display === ""
    ) {
      mapContainer.style.display = "block";
      searchArea.style.display = "none";
    } else {
      mapContainer.style.display = "none";
    }
  });

  $.ajax({
    url: "./map.svg",
    dataType: "text",
    success: function (svgData) {
      document.querySelector("#svg-container").innerHTML = svgData;
      setupSVGEventHandlers();
    },
    error: function (xhr, status, error) {
      console.error("SVG 로딩 실패:", error);
    },
  });
});

function goToRoulette() {
  window.location.href = "roulette.html";
}

function setActiveButton(activeButton) {
  [searchNav, regionInfoNav].forEach((btn) => btn.classList.remove("active"));
  activeButton.classList.add("active");
}

// 시,도 지도 선택 및 색상 변경 코드
function go_branch(city_do) {
  const regions = [
    "sejong",
    "chungnam",
    "jeju",
    "gyeongnam",
    "gyeongbuk",
    "jeonbuk",
    "chungbuk",
    "gangwon",
    "gyeonggi",
    "jeonnam",
    "ulsan",
    "busan",
    "daegu",
    "daejeon",
    "incheon",
    "seoul",
    "gwangju",
  ];
  const regionNames = [
    "세종특별자치시",
    "충청남도",
    "제주특별자치도",
    "경상남도",
    "경상북도",
    "전라북도",
    "충청북도",
    "강원도",
    "경기도",
    "전라남도",
    "울산광역시",
    "부산광역시",
    "대구광역시",
    "대전광역시",
    "인천광역시",
    "서울특별시",
    "광주광역시",
  ];
  const idx = regions.indexOf(city_do);
  if (idx !== -1) {
    console.log(`${regionNames[idx]} (${city_do}) 선택됨`);
  }
}

// SVG 이벤트 핸들러 설정
function setupSVGEventHandlers() {
  const svgPaths = document.querySelectorAll("#svg-container path"); // 모든 path 선택
  let selectedPath = null;

  svgPaths.forEach((path) => {
    // 마우스 오버 이벤트
    path.addEventListener("mouseover", function () {
      if (path !== selectedPath) {
        path.style.fill = "#cbc3ac"; // 호버 시 색상 변경
      }
    });

    // 마우스 아웃 이벤트
    path.addEventListener("mouseout", function () {
      if (path !== selectedPath) {
        path.style.fill = "#fff"; // 기본 색상으로 복구
      }
    });

    // 클릭 이벤트
    path.addEventListener("click", function () {
      if (selectedPath) {
        selectedPath.style.fill = "#fff"; // 이전 선택 색상 초기화
      }
      selectedPath = path; // 새 선택
      selectedPath.style.fill = "#cbc3ac"; // 클릭한 항목 색상 변경
      go_branch(path.id); // ID 기반으로 동작
    });
  });
}

// 선택된 지역 정보를 처리하는 함수
function go_branch(cityId) {
  console.log(`Selected city: ${cityId}`);
  // 지역에 대한 추가 동작 수행
}
