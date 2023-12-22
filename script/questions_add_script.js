document.querySelector("main").innerHTML += `
    <section id="topic_select_section" class="question_section">
        <h2>Выберите тему:</h2>
        <div id="topic_select"></div>
        <button id="topic_select_button" class="arrow_button">Выбрать<span></span></button>
    </section>
    <section id="question_section" class="question_section">
        <h2 id="question_head">Выберите ответ:</h2>
        <h3 id="question_text"></h3>
        <img id="question_img" class="theme_img">
        <div id="answer_select"></div>
        <button id="answer_select_button" class="arrow_button">Ответить<span></span></button>
    </section>`