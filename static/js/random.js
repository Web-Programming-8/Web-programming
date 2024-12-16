const places = {
  휴식지: [
    { name: "안동 병산서원", image: "jeju.jpg" },
    { name: "울산 태화강 국가정원", image: "ulleung.jpg" },
    { name: "태안 네이처월드", image: "jeju.jpg" },
    { name: "춘천 제이드 가든", image: "jeju.jpg" },
    { name: "재주 비자림", image: "jeju.jpg" },
    { name: "군산 선유도", image: "jeju.jpg" },
    { name: "제천 의림지", image: "jeju.jpg" },
    { name: "남해 섬이정원", image: "jeju.jpg" },
    { name: "포천 산정호수", image: "jeju.jpg" },
    { name: "횡성 미술관 자작나무숲", image: "jeju.jpg" },
  ],
  액티비티: [
    { name: "서울 스카이", image: "ski.jpg" },
    { name: "제주 9.81 파크", image: "rafting.jpg" },
    { name: "영월 어라연", image: "rafting.jpg" },
    { name: "남양주 웨이브서프", image: "rafting.jpg" },
    { name: "단양 만천하 스카이워크", image: "rafting.jpg" },
    { name: "영인 플라이스테이션코리아", image: "rafting.jpg" },
    { name: "통영 케이블카", image: "rafting.jpg" },
    { name: "화성 전곡항 마리나", image: "rafting.jpg" },
    { name: "하동 알프스 레포츠", image: "rafting.jpg" },
    { name: "제주 빅볼랜드", image: "rafting.jpg" },
  ],
  감성: [
    { name: "경주 엑스포대공원", image: "anapji.jpg" },
    { name: "제천 금봉월", image: "sokcho.jpg" },
    { name: "부산 우암동 도시숲", image: "sokcho.jpg" },
    { name: "수원 월화원", image: "sokcho.jpg" },
    { name: "여수 예술랜드", image: "sokcho.jpg" },
    { name: "삼척 미인폭포", image: "sokcho.jpg" },
    { name: "완주 아원고택", image: "sokcho.jpg" },
    { name: "강릉 안반데기", image: "sokcho.jpg" },
    { name: "제주 도두동 무지개해안도로", image: "sokcho.jpg" },
    { name: "서울 이랜드크루즈", image: "sokcho.jpg" },
  ],
  신상여행지: [
    { name: "창원 로봇랜드", image: "hongdae.jpg" },
    { name: "서울 젠틀몬스터 하우스도산", image: "gangnam.jpg" },
    { name: "통영 육지섬모노레일", image: "gangnam.jpg" },
    { name: "밀양 아리랑 우주천문대", image: "gangnam.jpg" },
    { name: "남해 설리스카이워크", image: "gangnam.jpg" },
    { name: "대전 소제동 관사촌", image: "gangnam.jpg" },
    { name: "경남 가야랜드", image: "gangnam.jpg" },
    { name: "강원 뮤지엄산", image: "gangnam.jpg" },
    { name: "공간 와디즈", image: "gangnam.jpg" },
    { name: "속초 갯배st", image: "gangnam.jpg" },
  ],
};

let loadingTimer;

function playSound(soundId) {
  const sound = document.getElementById(soundId);
  sound.currentTime = 0;
  sound.play().catch((err) => console.error("음향 재생 오류:", err));
}

function playBgm() {
  const bgm = document.getElementById("bgm");
  bgm.loop = true;
  bgm.volume = 0.5;
  bgm.play().catch((err) => console.error("배경음악 재생 오류:", err));
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  } else {
    console.error("로딩 요소를 찾을 수 없습니다.");
  }
}

function showLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = "flex";
  } else {
    console.error("로딩 요소를 찾을 수 없습니다.");
  }
}

window.onload = function () {
  hideLoading();
};

function startRandomRecommendation() {
  playBgm();
  playSound("buttonSound");
  document.getElementById("initialButton").classList.add("hidden");
  document.getElementById("categoryButtons").classList.remove("hidden");
}

function startRecommendation(category) {
  playSound("buttonSound");
  showLoading();

  if (loadingTimer) {
    clearTimeout(loadingTimer);
  }

  loadingTimer = setTimeout(() => {
    hideLoading();
    showRandomPlace(category);
    playSound("placeSound");
  }, 2000);
}

function showRandomPlace(category) {
  const categoryPlaces = places[category];
  const randomIndex = Math.floor(Math.random() * categoryPlaces.length);
  const place = categoryPlaces[randomIndex];

  const imageContainer = document.querySelector(".image-container");
  imageContainer.innerHTML = `
      <img src="${place.image}" alt="${place.name}">
      <p>${place.name}</p>
    `;
}
