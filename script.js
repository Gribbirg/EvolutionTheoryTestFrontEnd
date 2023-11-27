import data from './data.json' assert {type: 'json'};

let questions = [];
let currentQuestionNum = 0;
let rightAnswerNum = 0;

function addTopic(name, num) {
    document.getElementById("topic_select").innerHTML += `
        <input type="radio" name="topic_input" id="topic_${num}" ${(num === 0) ? "checked" : ""}><label for="topic_${num}">${name}</label>
        `
}

function setTopicData() {
    for (let i = 0; i < data.length; i++) {
        addTopic(data[i].name, i);
    }
}

function getSelectedTopicInput() {
    for (let i = 0; i < data.length; i++)
        if (document.getElementById(`topic_${i}`).checked)
            return i;
}

function hideTopicSelectSection() {
    document.getElementById("topic_select_section").style.display = "none";
}

function showTopicSelectSection() {
    document.getElementById("topic_select_section").style.display = "initial";
}

function hideQuestionSection() {
    document.getElementById("question_section").style.display = "none";
}

function showQuestionSection() {
    document.getElementById("question_section").style.display = "initial";
}

function addAnswer(text, num) {
    document.getElementById("answer_select").innerHTML += `
    <input type="radio" name="answer_input" id="answer_${num}" ${(num === 0) ? "checked" : ""}><label for="answer_${num}">${text}</label>
    `
}

function setQuestion(question) {
    document.getElementById("question_text").textContent = question.name;
    document.getElementById("answer_select").innerHTML = "";
    let answers = question["answers"].slice();
    shuffle(answers);
    for (let i = 0; i < answers.length; i++)
        addAnswer(answers[i], i);
    rightAnswerNum = answers.findIndex(function (item) {
        return item === question["answers"][0];
    })
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getSelectedAnswerInput() {
    for (let i = 0; i < questions[currentQuestionNum]["answers"].length; i++)
        if (document.getElementById(`answer_${i}`).checked)
            return i;
}

hideQuestionSection();
setTopicData();

document.getElementById("topic_select_accept_button").onclick = function () {
    let categoryNum = getSelectedTopicInput();
    hideTopicSelectSection();
    questions = data[categoryNum].questions.slice();
    shuffle(questions);
    currentQuestionNum = 0;
    setQuestion(questions[currentQuestionNum]);
    showQuestionSection();
}

document.getElementById("answer_select_button").onclick = function () {
    let ans = getSelectedAnswerInput();
    if (ans === rightAnswerNum) {
        alert("Правильно!");
    } else {
        alert(`Неправильно! Правильный ответ под номером ${rightAnswerNum + 1}`)
    }
    currentQuestionNum++;
    if (currentQuestionNum < questions.length) {
        setQuestion(questions[currentQuestionNum]);
    } else {
        alert("Все вопросы пройдены!");
        hideQuestionSection();
        showTopicSelectSection();
    }
}