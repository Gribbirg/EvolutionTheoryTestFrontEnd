let subject;
let data = [];
let questions = [];
let currentQuestionNum = 0;
let rightAnswerNum = 0;
let rightAnswersCount = 0;
let completedCount = 0;
let answers = [];

function startQuestions(name, data1) {
    subject = name;
    data = data1;

    setRestartHref(name);

    questions = JSON.parse(localStorage.getItem(`${subject}_questions`) ?? "[]");
    if (questions.length !== 0) {
        hideTopicSelectSection();
        addQuestionsMenu();
        currentQuestionNum = Number(localStorage.getItem(`${subject}_current_question_num`) ?? 0);
        rightAnswersCount = Number(localStorage.getItem(`${subject}_right_answers_count`) ?? 0);
        completedCount = Number(localStorage.getItem(`${subject}_completed_count`) ?? 0);
        setQuestion(questions[currentQuestionNum]);
        showQuestionSection();
        document.getElementById("all_count").textContent = questions.length.toString();
        document.getElementById("completed_count").textContent = completedCount;
        document.getElementById("right_count").textContent = rightAnswersCount.toString();
        document.getElementById("not_right_count").textContent = (completedCount - rightAnswersCount).toString();
    } else {
        hideQuestionSection();
        setTopicData();

        document.getElementById("topic_select_button").onclick = function () {
            questions = getTopicInputsQuestions();
            if (questions.length === 0) {
                alert("Выберите темы!");
                return;
            }
            shuffle(questions);
            questionsStart();
        }

        document.getElementById("test_start_button").onclick = function () {
            questions = getRandomQuestions(30);
            questionsStart();
        }
    }
    setQuestionChangeButtonsListeners();
}

function questionsStart() {
    addQuestionsMenu();
    hideTopicSelectSection();
    currentQuestionNum = 0;
    setQuestion(questions[currentQuestionNum]);
    showQuestionSection();
    localStorage.setItem(`${subject}_questions`, JSON.stringify(questions));
    localStorage.setItem(`${subject}_current_question_num`, currentQuestionNum);
    document.getElementById("all_count").textContent = questions.length.toString();
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
    document.getElementById("test_start_section").style.display = "none";
}

function showTopicSelectSection() {
    document.getElementById("topic_select_section").style.display = "flex";
    document.getElementById("test_start_section").style.display = "grid";
}

function hideQuestionSection() {
    document.getElementById("question_section").style.display = "none";
    document.getElementById("status_bar").style.display = "none";
    document.getElementById("question_menu_section").style.display = "none";
}

function showQuestionSection() {
    document.getElementById("question_section").style.display = "flex";
    document.getElementById("status_bar").style.display = "flex";
    document.getElementById("question_menu_section").style.display = "flex";
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
    localStorage.setItem(`${subject}_current_question_num`, currentQuestionNum);
    document.getElementById("question_number").textContent = (currentQuestionNum + 1).toString()
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
    answers = question["answers"].slice();
    shuffle(answers);
    for (let i = 0; i < answers.length; i++) addAnswer(answers[i], i);
    rightAnswerNum = findInAnswers(0);
    let ans = question["user_answer"];
    if (ans !== undefined) {
        let ansNum = findInAnswers(ans);
        document.getElementById(`answer_${ansNum}`).checked = true;
        document.getElementById(`answer_${rightAnswerNum}`).nextElementSibling.classList.add("right");
        setRightSectionState(ansNum === rightAnswerNum);
    } else {
        setRightSectionState();
        document.getElementById("answer_select_button").onclick = setAnswerButtonAnsState;
    }

    setQuestionChangeButtonsState();
    document.getElementById(`${currentQuestionNum}-menu_element`).checked = true;
    document.getElementById("questions_main_div_position").scrollIntoView({ block: "start", behavior: "smooth" });
}

function findInAnswers(stockIndex) {
    return answers.findIndex(function (item) {
        return item === questions[currentQuestionNum]["answers"][stockIndex];
    });
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

function setRightSectionState(right = undefined) {
    if (right === undefined) {
        document.getElementById("question_section").style.background = "var(--md-sys-color-surface-variant)";
        document.getElementById("question_head").textContent = "Выберите ответ:";
        document.getElementById("answer_select_button").innerHTML = "Ответить<span></span>";
        document.getElementById("answer_select_button").onclick = setAnswerButtonAnsState;
    } else {
        document.getElementById("question_head").textContent = (right) ? `Правильно!` : `Неправильно!`;
        document.getElementById("question_section").style.backgroundColor = (right) ? "var(--md-sys-color-tertiary-container)" : "var(--md-sys-color-error-container)";
        document.querySelector(`label[for="${currentQuestionNum}-menu_element"]`).classList.add((right)? "right_menu_element" : "not_right_menu_element");
        document.getElementById("answer_select_button").innerHTML = "Следующий<span></span>";
        document.getElementById("answer_select_button").onclick = setAnswerButtonNextState;
        document.querySelectorAll(`input[name="answer_input"]`).forEach(function (item) {
            item.disabled = true;
        });
    }
}

function setAnswerButtonAnsState() {
    let ans = getSelectedAnswerInput();
    if (ans === rightAnswerNum) {
        setRightSectionState(true);

        rightAnswersCount++;
        document.getElementById("right_count").textContent = rightAnswersCount.toString();
        localStorage.setItem(`${subject}_right_answers_count`, rightAnswersCount.toString());
    } else if (ans === -1) {
        alert("Выберите ответ!");
        return;
    } else {
        setRightSectionState(false);

        document.getElementById("not_right_count").textContent = (completedCount + 1 - rightAnswersCount).toString();
    }

    questions[currentQuestionNum]["user_answer"] = questions[currentQuestionNum]["answers"].findIndex(function (item) {
        return item === answers[ans]
    });
    localStorage.setItem(`${subject}_questions`, JSON.stringify(questions));

    document.getElementById(`answer_${rightAnswerNum}`).nextElementSibling.classList.add("right");
    completedCount++;
    document.getElementById("completed_count").textContent = completedCount;
    localStorage.setItem(`${subject}_completed_count`, completedCount);
    document.getElementById("questions_main_div_position").scrollIntoView({ block: "start", behavior: "smooth" });
}

function setAnswerButtonNextState() {
    do {
        currentQuestionNum++;
    } while (currentQuestionNum < questions.length && questions[currentQuestionNum]["user_answer"] !== undefined);
    if (currentQuestionNum < questions.length) {
        setQuestion(questions[currentQuestionNum]);
        return;
    } else {
        for (let i = 0; i < questions.length; i++) {
            if (questions[i]["user_answer"] === undefined) {
                currentQuestionNum = i;
                setQuestion(questions[currentQuestionNum]);
                break;
            }
        }
        if (currentQuestionNum === questions.length) {
            alert("Все вопросы пройдены!");
            document.getElementById("answer_select_button").innerHTML = "Завершить<span></span>";
            document.getElementById("answer_select_button").onclick = function () {
                cleanStorage();
                window.location.href = "";
            }
            return;
        }
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
    localStorage.removeItem(`${subject}_completed_count`);
    localStorage.removeItem(`${subject}_right_answers_count`);
}

function setQuestionChangeButtonsState() {
    document.getElementById("previous_question_button").style.visibility = (currentQuestionNum === 0)? "hidden": "initial";
    document.getElementById("next_question_button").style.visibility = (currentQuestionNum === questions.length - 1)? "hidden": "initial";
}

function setQuestionChangeButtonsListeners() {
    document.getElementById("previous_question_button").onclick = function () {
        currentQuestionNum--;
        setQuestion(questions[currentQuestionNum]);

    }
    document.getElementById("next_question_button").onclick = function () {
        currentQuestionNum++;
        setQuestion(questions[currentQuestionNum]);
    }
}

function addQuestionsMenu() {
    for (let i = 0; i < questions.length; i++) {
        let ans = questions[i]["user_answer"];
        addQuestionToMenu(i, (ans === undefined)? ans : ans === 0);
    }
}

function addQuestionToMenu(num, right = undefined) {
    let input = document.createElement("input");
    let label = document.createElement("label");

    input.id = `${num}-menu_element`;
    input.type = "radio";
    input.name = "question_menu_element";
    document.getElementById("question_menu_div").appendChild(input);

    label.htmlFor = `${num}-menu_element`;
    label.textContent = (num + 1);
    label.className = "menu_element";
    if (right === true)
        label.classList.add("right_menu_element");
    else if (right === false)
        label.classList.add("not_right_menu_element");
    document.getElementById("question_menu_div").appendChild(label);

    input.onchange = function () {
        if (input.checked) {
            currentQuestionNum = Number(input.id.split("-")[0]);
            setQuestion(questions[currentQuestionNum]);
        }
    }
}

function getRandomQuestions(count) {
    let numbers = getRandomNumbers(count, getQuestionsCount());
    let questions = [];
    for (let num of numbers) {
        let topicNum = 0;
        while (num >= data[topicNum]["questions_count"]) {
            num -= data[topicNum]["questions_count"];
            topicNum++;
        }
        questions.push(data[topicNum]["questions"][num]);
    }
    return questions;
}

function getQuestionsCount() {
    let sum = 0;
    for (let topic of data) {
        sum += topic["questions_count"];
    }
    return sum;
}

function getRandomNumbers(count, max) {
    let numbers = [];
    let num;
    while (numbers.length < count) {
        do {
            num = getRandomInt(max);
        } while (numbers.includes(num));
        numbers.push(num);
    }
    return numbers;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}