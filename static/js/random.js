const places = {
  휴식지: [
    { name: "안동 병산서원", image: "/static/images/random/andong-rd.jpg" },
    { name: "울산 태화강 국가정원", image: "/static/images/random/ulsan-rd.jpg" },
    { name: "태안 네이처월드", image: "/static/images/random/taean-rd.jpg" },
    { name: "춘천 제이드 가든", image: "/static/images/random/chuncheon-rd.jpg" },
    { name: "제주 비자림", image: "/static/images/random/jeju-rd.jpg" },
    { name: "군산 선유도", image: "/static/images/random/gunsan-rd.jpg" },
    { name: "제천 의림지", image: "/static/images/random/jecheon-rd.jpg" },
    { name: "남해 해오름예술촌", image: "/static/images/random/namhae-rd.jpg" },
    { name: "포천 산정호수", image: "/static/images/random/pocheon-rd.jpg" },
    { name: "국립횡성숲체원", image: "/static/images/random/hoengseong-rd.jpg" },
  ],
  액티비티: [
    { name: "서울 스카이", image: "/static/images/random/seoul-rd.jpg" },
    { name: "제주 9.81 파크", image: "/static/images/random/jeju981-rd.jpg" },
    { name: "영월 어라연", image: "/static/images/random/yeong-wol-rd.jpg" },
    { name: "남양주 웨이브서프", image: "/static/images/random/namyangju-rd.jpg" },
    { name: "단양 만천하 스카이워크", image: "/static/images/random/danyang-rd.jpg" },
    { name: "영인 플라이스테이션코리아", image: "/static/images/random/yeongin-rd.jpg" },
    { name: "통영 케이블카", image: "/static/images/random/tongyeong-rd.jpg" },
    { name: "화성 전곡항 마리나", image: "/static/images/random/hwaseong-rd.jpg" },
    { name: "하동 알프스 레포츠", image: "/static/images/random/hadong-rd.jpg" },
    { name: "제주 빅볼랜드", image: "/static/images/random/jejubig-rd.jpg" },
  ],
  감성: [
    { name: "경주 엑스포대공원", image: "/static/images/random/gyeongju-rd.jpg" },
    { name: "제천 청풍호", image: "/static/images/random/jecheongum-rd.jpg" },
    { name: "부산 우암동 도시숲", image: "/static/images/random/busan-rd.jpg" },
    { name: "수원 월화원", image: "/static/images/random/suwon-rd.jpg" },
    { name: "여수 다락논", image: "/static/images/random/yeosu-rd.jpg" },
    { name: "삼척 미인폭포", image: "/static/images/random/samcheok-rd.jpg" },
    { name: "완주 대둔산", image: "/static/images/random/wanju-rd.jpg" },
    { name: "강릉 안반데기", image: "/static/images/random/gangneung-rd.jpg" },
    { name: "제주 도두동 무지개해안도로", image: "/static/images/random/jejudodu-rd.jpg" },
    { name: "정동진", image: "/static/images/random/jungdong-rd.jpg" },
  ],
  신상여행지: [
    { name: "창원 마산국화축제", image: "/static/images/random/changwon-rd.jpg" },
    { name: "서울 젠틀몬스터 하우스도산", image: "/static/images/random/seoulj-rd.jpg" },
    { name: "울진 하트해변", image: "/static/images/random/ulzin-rd.jpg" },
    { name: "밀양 아리랑 우주천문대", image: "/static/images/random/miryang-rd.jpg" },
    { name: "남해 설리스카이워크", image: "/static/images/random/namhaes-rd.jpg" },
    { name: "대전 소제동 관사촌", image: "/static/images/random/daejeon-rd.jpg" },
    { name: "경남 양산타워", image: "/static/images/random/gyeongnam-rd.jpg" },
    { name: "강원 뮤지엄산", image: "/static/images/random/gangwon-rd.jpg" },
    { name: "서울 성수 공간와디즈", image: "/static/images/random/seoulg-rd.jpg" },
    { name: "속초 갯배st", image: "/static/images/random/sokcho-rd.jpg" },
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
