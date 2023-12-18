document.body.innerHTML += `
    <footer>
    <div>
        Выберите цветовую тему:
        <div>
            <div><input type="radio" name="theme_input" id="theme+theme_input"><label for="theme+theme_input">Как на устройстве</label></div>
            <div><input type="radio" name="theme_input" id="theme.light+theme_input"><label for="theme.light+theme_input">Светлая тема</label></div>
            <div><input type="radio" name="theme_input" id="theme.dark+theme_input"><label for="theme.dark+theme_input">Темная тема</label></div>
        </div>
    </div>
    <address>
        Контакты разработчика:
        <p>По поводу ошибок пишите на:</p>
        <p>
            <a href="mailto:gribkovalexander@gmail.com">gribkovalexander@gmail.com</a>
        </p>
        <p><small>Screaming Mushrooms 2023</small></p>
    </address>
    </footer>
`

let theme = localStorage.getItem("theme") ?? "theme";
setTheme(theme);

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
});


function setTheme(theme) {
    document.getElementById("theme_link").href = `/centralized-testing-training/style/colors//${theme}.css`;
    localStorage.setItem("theme", theme);
}