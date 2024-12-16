const destinations = [
  "서울",
  "부산",
  "인천",
  "울산",
  "대구",
  "대전",
  "광주",
  "제주",
  "세종",
  "평양",
];
const regionMapping = {
  서울: "seoul",
  부산: "busan",
  인천: "incheon",
  울산: "ulsan",
  대구: "daegu",
  대전: "daejeon",
  광주: "gwangju",
  제주: "jeju",
  세종: "sejong",
  평양: "pyongyang",
};

let spinning = false;
let animationInterval;
let selectedRegion = null;

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
    window.location.href = `${englishRegion}.html`;
  }
}
