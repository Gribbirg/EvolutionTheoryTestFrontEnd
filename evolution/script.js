setRestartHref("evolution");
document.getElementById("header_head").textContent = "Теория эволюции";

const response = await fetch('../data/evolution.json');
const data = await response.json();

startQuestions(data);