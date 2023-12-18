document.body.innerHTML += `
<footer>
    <div>
        Выберите тему:
        <div>
            <div><input type="radio" name="theme_input" id="theme+theme_input"><label for="theme+theme_input">Как на устройстве</label></div>
            <div><input type="radio" name="theme_input" id="theme.light+theme_input"><label for="theme.light+theme_input">Светлая тема</label></div>
            <div><input type="radio" name="theme_input" id="theme.dark+theme_input"><label for="theme.dark+theme_input">Темная тема</label></div>
        </div>
    </div>
    <div>
        Выберите цветовую тему:
        <div>
            <div><input type="radio" name="color_input" id="pink+color_input"><label for="pink+color_input"></label></div>
            <div><input type="radio" name="color_input" id="red+color_input"><label for="red+color_input"></label></div>
            <div><input type="radio" name="color_input" id="orange+color_input"><label for="orange+color_input"></label></div>
            <div><input type="radio" name="color_input" id="yellow+color_input"><label for="yellow+color_input"></label></div>
            <div><input type="radio" name="color_input" id="green+color_input"><label for="green+color_input"></label></div>
            <div><input type="radio" name="color_input" id="blue+color_input"><label for="blue+color_input"></label></div>
            <div><input type="radio" name="color_input" id="dark_blue+color_input"><label for="dark_blue+color_input"></label></div>
            <div><input type="radio" name="color_input" id="purple+color_input"><label for="purple+color_input"></label></div>
        </div>
    </div>
    <address>
        Контакты разработчика:
        <p>По поводу ошибок пишите на:</p>
        <p>
            <a href="mailto:gribkovalexander@gmail.com">gribkovalexander@gmail.com</a>
        </p>
        <p><small>© Screaming Mushrooms, 2023</small></p>
    </address>
</footer>
`

let theme = localStorage.getItem("theme") ?? "theme";
setTheme(theme);

let color = localStorage.getItem("color") ?? "orange";
setColor(color);

window.addEventListener("DOMContentLoaded", function () {
    document.getElementById(`${theme}+theme_input`).checked = true;
    document.querySelectorAll(`input[name="theme_input"]`).forEach(function (input) {
        input.addEventListener("change", function () {
            if (input.checked) {
                theme = input.id.split("+")[0];
                setTheme(theme);
            }
        })
    });

    document.getElementById(`${color}+color_input`).checked = true;
    document.querySelectorAll(`input[name="color_input"]`).forEach(function (input) {
        input.addEventListener("change", function () {
            if (input.checked) {
                color = input.id.split("+")[0];
                setColor(color);
            }
        })
    });
});


function setTheme(theme) {
    document.getElementById("theme_link").href = `/centralized-testing-training/style/colors/${theme}.css`;
    localStorage.setItem("theme", theme);
}

function setColor(color) {
    document.getElementById("colors_link").href = `/centralized-testing-training/style/colors/tokens/${color}-tokens.css`;
    localStorage.setItem("color", color);
}