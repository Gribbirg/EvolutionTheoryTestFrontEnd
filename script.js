"use strict"

const response = await fetch("./data/news.json");
const data = await response.json();

initNews(data);

function createNews(news) {
    document.getElementById("news_div").innerHTML += `
    <div class="news_element_div">
        <h3>${news.name}</h3>
        <p>${news.description}</p>
        <small>${news["date"]}</small>
    </div>
    `
}

function initNews(data) {
    data.slice(0, 5).forEach(createNews);
}
