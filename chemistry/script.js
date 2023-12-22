setRestartHref("chemistry");
document.getElementById("header_head").textContent = "Органическая химия";

const response = await fetch('../data/chemistry.json');
const data = await response.json();

startQuestions(data);