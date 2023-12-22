let subject;
let data = [];
let questions = [];
let currentQuestionNum = 0;
let rightAnswerNum = 0;
let rightAnswersCount = 0;

function startQuestions(name, data1) {
    subject = name;
    data = data1;

    setRestartHref(name);

    questions = JSON.parse(localStorage.getItem(`${subject}_questions`) ?? "[]");
    if (questions.length !== 0) {
        hideTopicSelectSection();
        currentQuestionNum = Number(localStorage.getItem(`${subject}_current_question_num`) ?? 0);
        rightAnswersCount = Number(localStorage.getItem(`${subject}_right_answers_count`) ?? 0);
        setQuestion(questions[currentQuestionNum]);
        showQuestionSection();
        document.getElementById("all_count").textContent = questions.length.toString();
        document.getElementById("completed_count").textContent = currentQuestionNum;
        document.getElementById("right_count").textContent = rightAnswersCount.toString();
        document.getElementById("not_right_count").textContent = (currentQuestionNum - rightAnswersCount).toString();
    } else {
        hideQuestionSection();
        setTopicData();

        document.getElementById("topic_select_button").onclick = function () {
            questions = getTopicInputsQuestions();
            if (questions.length === 0) {
                alert("Выберите темы!");
                return;
            }
            hideTopicSelectSection();
            shuffle(questions);
            currentQuestionNum = 0;
            setQuestion(questions[currentQuestionNum]);
            showQuestionSection();
            localStorage.setItem(`${subject}_questions`, JSON.stringify(questions));
            localStorage.setItem(`${subject}_current_question_num`, currentQuestionNum);
            document.getElementById("all_count").textContent = questions.length.toString();
        }
    }
    document.getElementById("answer_select_button").onclick = setAnswerButtonAnsState;
}


function addTopic(name, num) {
    document.getElementById("topic_select").innerHTML += `
        <input type="checkbox" name="topic_input" id="topic_${num}"><label for="topic_${num}">${num + 1 + ") " + name}</label>
        `
}

function setTopicData() {
    for (let i = 0; i < data.length; i++) {
        addTopic(data[i].name, i);
    }
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
    document.getElementById("status_bar").style.display = "flex";
}

function addAnswer(text, num) {
    if ((text ?? "").includes(".png")) {
        document.getElementById("answer_select").innerHTML += `
        <input type="radio" name="answer_input" id="answer_${num}"><label for="answer_${num}">${num + 1 + ")"}<img src="../images/chemistry/${text}" alt="${text}" class="theme_img"></label>
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

    let img = document.getElementById("question_img");
    if (img)
        img.style.display = "none";
    if (question["image"]) {
        img.src = `../images/chemistry/${question["image"]}`;
        img.alt = `${question["image"]}`;
        img.style.display = "block";
    }

    document.getElementById("answer_select").innerHTML = "";
    let answers = question["answers"].slice();
    shuffle(answers);
    for (let i = 0; i < answers.length; i++) addAnswer(answers[i], i);
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
    for (let i = 0; i < questions[currentQuestionNum]["answers"].length; i++) if (document.getElementById(`answer_${i}`).checked) return i;
    return -1;
}

// function addInputListeners() {
//     for (let label of document.querySelectorAll("main > section > div > label")) {
//         label.onclick = function () {
//             for (let label1 of document.querySelectorAll("main > section > div > label")) {
//                 if (label1.classList.contains("selected")) label1.classList.remove("selected")
//             }
//             label.classList.add("selected");
//         }
//     }
// }

function removeInputListeners() {
    for (let label of document.querySelectorAll("label")) {
        label.onclick = null;
    }
}

function setAnswerButtonAnsState() {
    let ans = getSelectedAnswerInput();
    if (ans === rightAnswerNum) {
        document.getElementById("question_head").textContent = `Правильно!`;
        document.getElementById("question_section").style.backgroundColor = "var(--md-sys-color-tertiary-container)";
        rightAnswersCount++;
        document.getElementById("right_count").textContent = rightAnswersCount.toString();
        localStorage.setItem(`${subject}_right_answers_count`, rightAnswersCount.toString());
    } else if (ans === -1) {
        alert("Выберите ответ!");
        return;
    } else {
        document.getElementById("question_head").textContent = `Неправильно!`;
        document.getElementById("question_section").style.backgroundColor = "var(--md-sys-color-error-container)";
        document.getElementById("not_right_count").textContent = (currentQuestionNum + 1 - rightAnswersCount).toString();
    }
    removeInputListeners();
    document.getElementById(`answer_${rightAnswerNum}`).nextElementSibling.classList.add("right");
    document.getElementById("answer_select_button").innerHTML = "Следующий<span></span>";
    document.getElementById("answer_select_button").onclick = setAnswerButtonNextState;
    currentQuestionNum++;
    document.getElementById("completed_count").textContent = currentQuestionNum;
    localStorage.setItem(`${subject}_current_question_num`, currentQuestionNum);
}

function setAnswerButtonNextState() {
    if (currentQuestionNum < questions.length) {
        setQuestion(questions[currentQuestionNum]);
    } else {
        alert("Все вопросы пройдены!");
        cleanStorage();
        window.location.href = "";
        hideQuestionSection();
        setTopicData();
        showTopicSelectSection();
    }
    document.getElementById("question_section").style.background = "var(--md-sys-color-surface-variant)";
    document.getElementById("question_head").textContent = "Выберите ответ:";
    document.getElementById("answer_select_button").innerHTML = "Ответить<span></span>";
    document.getElementById("answer_select_button").onclick = setAnswerButtonAnsState;
}

function getTopicInputsQuestions() {
    let res = [];
    for (let input of document.querySelectorAll(`input[name="topic_input"]`)) {
        if (input.checked) {
            res = res.concat(data[Number(input.id.split("_")[1])]["questions"].slice());
        }
    }
    return res;
}

function cleanStorage() {
    localStorage.removeItem(`${subject}_questions`);
    localStorage.removeItem(`${subject}_current_question_num`);
    localStorage.removeItem(`${subject}_current_question_num`);
    localStorage.removeItem(`${subject}_right_answers_count`);
}