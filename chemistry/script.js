setRestartHref("chemistry");

const response = await fetch('./data.json');
const data = await response.json();

let questions = [];
let currentQuestionNum = 0;
let rightAnswerNum = 0;

function addTopic(name, num) {
    document.getElementById("topic_select").innerHTML += `
        <input type="radio" name="topic_input" id="topic_${num}"><label for="topic_${num}">${num + 1 + ") " + name}</label>
        `
}

function setTopicData() {
    for (let i = 0; i < data.length; i++) {
        addTopic(data[i].name, i);
    }
    addInputListeners();
}

function getSelectedTopicInput() {
    for (let i = 0; i < data.length; i++)
        if (document.getElementById(`topic_${i}`).checked)
            return i;
    return -1;
}

function hideTopicSelectSection() {
    document.getElementById("topic_select_section").style.display = "none";
}

function showTopicSelectSection() {
    document.getElementById("topic_select_section").style.display = "flex";
}

function hideQuestionSection() {
    document.getElementById("question_section").style.display = "none";
}

function showQuestionSection() {
    document.getElementById("question_section").style.display = "flex";
}

function addAnswer(text, num) {
    if ((text ?? "").includes(".png")) {
        document.getElementById("answer_select").innerHTML += `
        <input type="radio" name="answer_input" id="answer_${num}"><label for="answer_${num}">${num + 1 + ")"}<img src="images/${text}" alt="${text}"></label>
        `
        document.querySelector(`label[for="answer_${num}"]`).className = "image_label"
    } else {
        document.getElementById("answer_select").innerHTML += `
        <input type="radio" name="answer_input" id="answer_${num}"><label for="answer_${num}">${num + 1 + ") " + text}</label>
        `
    }
}

function setQuestion(question) {
    document.getElementById("question_text").textContent = question.name;
    if (question["image"]) {
        document.getElementById("question_img").src = `images/${question["image"]}`;
        document.getElementById("question_img").alt = `images/${question["image"]}`;
        document.getElementById("question_img").style.display = "block";
    } else {
        document.getElementById("question_img").style.display = "none";
    }
    document.getElementById("answer_select").innerHTML = "";
    let answers = question["answers"].slice();
    shuffle(answers);
    for (let i = 0; i < answers.length; i++)
        addAnswer(answers[i], i);
    addInputListeners();
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
    return -1;
}

function addInputListeners() {
    for (let label of document.querySelectorAll("main > section > div > label")) {
        label.onclick = function () {
            for (let label1 of document.querySelectorAll("main > section > div > label")) {
                if (label1.classList.contains("selected"))
                    label1.classList.remove("selected")

            }
            label.classList.add("selected");
        }
    }
}

function removeInputListeners() {
    for (let label of document.querySelectorAll("label")) {
        label.onclick = null;
    }
}

function setAnswerButtonAnsState() {
    let ans = getSelectedAnswerInput();
    if (ans === rightAnswerNum) {
        document.getElementById("question_head").textContent = `Правильно!`;
        document.getElementById("question_section").style.background = "#d4ffcf";
    } else if (ans === -1) {
        alert("Выберите ответ!");
        return;
    } else {
        document.getElementById("question_head").textContent = `Неправильно!`;
        document.getElementById("question_section").style.background = "#ffdad6";
    }
    removeInputListeners();
    document.getElementById(`answer_${rightAnswerNum}`).nextElementSibling.classList.add("right");
    document.getElementById("answer_select_button").innerHTML = "Следующий<span></span>";
    document.getElementById("answer_select_button").onclick = setAnswerButtonNextState;
}


function setAnswerButtonNextState() {
    currentQuestionNum++;
    if (currentQuestionNum < questions.length) {
        setQuestion(questions[currentQuestionNum]);
    } else {
        alert("Все вопросы пройдены!");
        window.location.href = "";
        hideQuestionSection();
        setTopicData();
        showTopicSelectSection();
    }
    document.getElementById("question_section").style.background = "#dfe4d7";
    document.getElementById("question_head").textContent = "Выберите ответ:";
    document.getElementById("answer_select_button").innerHTML = "Ответить<span></span>";
    document.getElementById("answer_select_button").onclick = setAnswerButtonAnsState;
}

hideQuestionSection();
setTopicData();

document.getElementById("topic_select_accept_button").onclick = function () {
    let categoryNum = getSelectedTopicInput();
    if (categoryNum !== -1) {
        hideTopicSelectSection();
        questions = data[categoryNum]["questions"].slice();
        shuffle(questions);
        currentQuestionNum = 0;
        setQuestion(questions[currentQuestionNum]);
        showQuestionSection();
    } else {
        alert("Выберите тему!");
    }
}

document.getElementById("answer_select_button").onclick = setAnswerButtonAnsState;