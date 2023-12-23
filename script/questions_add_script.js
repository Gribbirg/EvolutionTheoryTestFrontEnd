document.querySelector("main").innerHTML += `
    <section id="question_menu_section">
        <h2>Вопросы:</h2>
        <div id="question_menu_div">
        
        </div>
    </section>
    <div id="questions_main_div">
    <div id="status_bar">
        <p>Правильно/неправильно: <b id="right_count">0</b>/<b id="not_right_count">0</b></p>
        <p>№ <b id="question_number">0</b></p>
        <p>Пройдено: <b id="completed_count">0</b>/<b id="all_count">0</b></p>
    </div>
    <section id="topic_select_section" class="question_section">
        <h2>Выберите тему:</h2>
        <div id="topic_select"></div>
        <button id="topic_select_button" class="arrow_button">Выбрать<span></span></button>
    </section>
    <section id="question_section" class="question_section">
        <div id="head_div">
            <button id="previous_question_button" class="question_change_button">‹</button>
            <h2 id="question_head">Выберите ответ:</h2>
            <button id="next_question_button" class="question_change_button">›</button>
        </div>
        <h3 id="question_text"></h3>
        <img id="question_img" class="theme_img">
        <div id="answer_select"></div>
        <button id="answer_select_button" class="arrow_button">Ответить<span></span></button>
    </section>
    </div>`