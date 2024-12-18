const destinations = [
  "서울", "부산", "인천", "울산", "대구", "대전", "광주", "세종", 
  "수원", "성남", "고양", "용인", "부천", "안산", "안양", "남양주", "화성", "평택", 
  "의정부", "시흥", "파주", "김포", "광명", "경기광주", "군포", "오산", "이천", "안성", 
  "의왕", "하남", "양주", "구리", "포천", "여주", "동두천", "가평", "연천",
  "춘천", "원주", "강릉", "동해", "태백", "속초", "삼척", "홍천", "철원", "양양",
  "청주", "충주", "제천", "단양",
  "천안", "공주", "보령", "아산", "서산", "논산", "계룡", "당진", "태안",
  "전주", "군산", "익산", "정읍", "남원", "김제", "완주", "무주",
  "목포", "여수", "순천", "나주", "광양", "담양", "고흥", "완도",
  "포항", "경주", "김천", "안동", "구미", "영주", "영천", "상주", "문경", "경산", "울릉",
  "창원", "진주", "통영", "사천", "김해", "밀양", "거제", "양산", "남해", "하동", "거창",
  "제주", "서귀포"
];
const regionMapping = {
  서울: "seoul", 부산: "busan", 인천: "incheon", 울산: "ulsan", 대구: "daegu",
  대전: "daejeon", 광주: "gwangju", 세종: "sejong",
  수원: "suwon", 성남: "seongnam", 고양: "goyang", 용인: "yongin", 부천: "bucheon",
  안산: "ansan", 안양: "anyang", 남양주: "namyangju", 화성: "hwaseong", 평택: "pyeongtaek",
  의정부: "uijeongbu", 시흥: "siheung", 파주: "paju", 김포: "gimpo", 광명: "gwangmyeong",
  경기광주: "gwangju_gyeonggi", 군포: "gunpo", 오산: "osan", 이천: "icheon", 안성: "anseong",
  의왕: "uiwang", 하남: "hanam", 양주: "yangju", 구리: "guri", 포천: "pocheon",
  여주: "yeoju", 동두천: "dongducheon", 가평: "gapyeong", 연천: "yeoncheon",
  춘천: "chuncheon", 원주: "wonju", 강릉: "gangneung", 동해: "donghae", 태백: "taebaek",
  속초: "sokcho", 삼척: "samcheok", 홍천: "hongcheon", 철원: "cheorwon", 양양: "yangyang",
  청주: "cheongju", 충주: "chungju", 제천: "jecheon", 단양: "danyang",
  천안: "cheonan", 공주: "gongju", 보령: "boryeong", 아산: "asan", 서산: "seosan",
  논산: "nonsan", 계룡: "gyeryong", 당진: "dangjin", 태안: "taean",
  전주: "jeonju", 군산: "gunsan", 익산: "iksan", 정읍: "jeongeup", 남원 : "namwon",
  김제: "gimje", 완주: "wanju", 무주: "muju",
  목포: "mokpo", 여수: "yeosu", 순천: "suncheon", 나주: "naju", 광양: "gwangyang",
  담양: "damyang", 고흥: "goheung", 완도: "wando",
  포항: "pohang", 경주: "gyeongju", 김천: "gimcheon", 안동: "andong", 구미: "gumi",
  영주: "yeongju", 영천: "yeongcheon", 상주: "sangju", 문경: "mungyeong", 경산: "gyeongsan",
  울릉: "ulleung",
  창원: "changwon", 진주: "jinju", 통영: "tongyeong", 사천: "sacheon", 김해: "gimhae",
  밀양: "miryang", 거제: "geoje", 양산 : "yangsan", 남해: "namhae", 하동: "hadong",
  거창: "geochang",
  제주: "jeju", 서귀포: "seogwipo"
};

let spinning = false;
let animationInterval;
let selectedRegion = null;
let speed = 50;  // 속도 증가

const reel = document.getElementById("reel");
destinations.forEach((destination) => {
  const item = document.createElement("div");
  item.textContent = destination;
  reel.appendChild(item);
});

destinations.forEach((destination) => {
  const item = document.createElement("div");
  item.textContent = destination;
  reel.appendChild(item);
});

window.startSpin = function () {
  if (spinning) return;

  spinning = true;
  document.getElementById("spin-button").disabled = true;
  document.getElementById("stop-button").disabled = false;
  document.getElementById("region-link").style.display = "none";

  reel.style.transition = "none";
  reel.style.top = "0px";

  let speed = 20;
  animationInterval = setInterval(() => {
    const currentTop = parseInt(reel.style.top || "0");
    const newTop = currentTop - speed;

    if (Math.abs(newTop) >= reel.scrollHeight / 2) {
      reel.style.top = "0px";
    } else {
      reel.style.top = `${newTop}px`;
    }
  }, 20);
}

window.stopSpin = function () {
  if (!spinning) return;

  spinning = false;
  clearInterval(animationInterval);

  const itemHeight = 100;
  const currentTop = parseInt(reel.style.top || "0");

  let normalizedTop = currentTop % (itemHeight * destinations.length);
  if (normalizedTop > 0) normalizedTop -= itemHeight * destinations.length;
  const selectedIndex =
    Math.abs(Math.round(normalizedTop / itemHeight)) % destinations.length;

  const finalTop = -selectedIndex * itemHeight;
  reel.style.transition = "top 0.3s ease";
  reel.style.top = `${finalTop}px`;

  selectedRegion = destinations[selectedIndex];

  setTimeout(() => {
    alert(`추천 여행지: ${selectedRegion}`);
    document.getElementById("region-link").style.display = "inline-block";
  }, 300);

  document.getElementById("spin-button").disabled = false;
  document.getElementById("stop-button").disabled = true;
}

window.goToRegionPage = function () {
  if (selectedRegion) {
    const englishRegion = regionMapping[selectedRegion];
    window.location.href = `/city/${englishRegion}`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const snowContainer = document.querySelector('.snowfall');
  const numFlakes = 50;

  for (let i = 0; i < numFlakes; i++) {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.innerHTML = "&#10052;";

      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
      snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;

      const colors = ['#fff', '#e0eaf2', '#cce7ff']; 
      snowflake.style.color = colors[Math.floor(Math.random() * colors.length)];
      snowflake.style.opacity = Math.random() * 0.6 + 0.4;

      snowContainer.appendChild(snowflake);
  }
});