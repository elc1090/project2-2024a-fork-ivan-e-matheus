let apiKey = "yj02XyYZMCXObC1EPX6MRzu1yF5Vf4NVc7rQ6Nzz";

/* load quiz UI elements */
const quiz_container = document.getElementById("quiz-container");
const quiz_question = document.getElementById("question");
const quiz_answers_ul = document.getElementById("answers");
const quiz_category = document.getElementById("category");
const quiz_difficulty = document.getElementById("difficulty");
const quiz_type = document.getElementById("type");
const quiz_check_answer = document.getElementById("check-answer");
const quiz_result = document.getElementById("result");
const quiz_current_score = document.getElementById("current-score");
const quiz_total_questions = document.getElementById("total-questions");

const settings_container = document.getElementById("settings-container");

const stats_container= document.getElementById("statistics-container");

const wrapper_footer_settings = document.getElementById("button-settings");
const wrapper_footer_game = document.getElementById("button-game");
const wrapper_footer_stats = document.getElementById("button-stats");

/* store some question data */
let quiz_multiple = false, data = "";
let quiz_number_answers = 0;
let quiz_correct_answers;
let current_score = 0;
let total_questions = 0;

let quiz_ended = false;
let quiz_started = false;

/* store settings data */
let settings_tags = [], settings_categories = [], settings_difficulty = [];
let tags_data = [], categories_data = [], difficulty_data = ["easy", "medium", "hard"];
let settings_using_categories = true;

/* load settings UI elements */
const settings_tags_options = document.getElementById("settings-tags");
const settings_tags_selected = document.getElementById("settings-selected-tags");
const settings_categories_options = document.getElementById("settings-categories");
const settings_categories_selected = document.getElementById("settings-selected-categories")
const settings_chbox_easy = document.getElementById("settings-chbox-easy");
const settings_chbox_medium = document.getElementById("settings-chbox-medium");
const settings_chbox_hard = document.getElementById("settings-chbox-hard");
const settings_rb_tags = document.getElementById("settings-rb-tags");
const settings_rb_cats = document.getElementById("settings-rb-cats");
const settings_add_tag = document.getElementById("add-tag");
const settings_clear_tags = document.getElementById("clear-tags");
const settings_add_category = document.getElementById("add-category");
const settings_clear_categories = document.getElementById("clear-categories");
const settings_reset = document.getElementById("settings-reset");

async function loadTags() {
    console.log("loading tags...")
    let APIUrl = `https://quizapi.io/api/v1/tags?apiKey=${apiKey}`;
    let result;
    do{
        result = await fetch(`${APIUrl}`);
    } while(!result.ok);
    tags_data = await result.json();
    let tags_list = [];
    /* filter list for tags that return no questions. */
    let filter_tags = [
        "dev","Ruby","Undefined", "postgres", "AWS", "Css", "C", "Java", "Swift",
        "Blockchain", "VueJS", ".Net"
    ];
    for (tag of tags_data){
        if (!filter_tags.includes(tag.name)){
            tags_list.push(tag.name);
            let opt = document.createElement("option");
            opt.value = tag.name;
            opt.text = tag.name;
            settings_tags_options.add(opt);
        }
    }
    tags_data = tags_list;
    console.log("loaded tags.")
}

async function loadCategories(){
    console.log("loading categories...")
    let APIUrl = `https://quizapi.io/api/v1/categories?apiKey=${apiKey}`;
    let result;
    do{
        result = await fetch(`${APIUrl}`);
    } while(!result.ok);
    categories_data = await result.json();
    let categories_list = [];
    for (category of categories_data){
        categories_list.push(category.name);
        let opt = document.createElement("option");
        opt.value = category.name;
        opt.text = category.name;
        settings_categories_options.add(opt);
    }
    categories_data = categories_list;
    console.log("loaded categories.")
}

/* creates eventlistners for buttons */
function eventListners(){
    quiz_check_answer.addEventListener('click', checkAnswer);
    wrapper_footer_settings.addEventListener('click', gotoSettings);
    wrapper_footer_game.addEventListener('click', gotoQuiz);
    wrapper_footer_stats.addEventListener('click', gotoStats);
    settings_rb_cats.addEventListener('click', function(e){
        settings_using_categories = true;
        showSettings();
    });
    settings_rb_tags.addEventListener('click', function(e){
        settings_using_categories = false;
        showSettings();
    });
    settings_clear_tags.addEventListener('click', function(e){
        settings_tags = []
        showSettings();
    });
    settings_clear_categories.addEventListener('click', function(e){
        settings_categories = []
        showSettings();
    });
    settings_chbox_easy.addEventListener('click', updateDifficulty);
    settings_chbox_medium.addEventListener('click', updateDifficulty);
    settings_chbox_hard.addEventListener('click', updateDifficulty);
    settings_reset.addEventListener('click', resetSettings);
    settings_add_category.addEventListener('click', addCategory);
    settings_add_tag.addEventListener('click', addTag);
}

function updateDifficulty(){
    settings_difficulty = [];
    if (settings_chbox_easy.checked) settings_difficulty.push("easy");
    if (settings_chbox_medium.checked) settings_difficulty.push("medium");
    if (settings_chbox_hard.checked) settings_difficulty.push("hard");
}

function gotoStats(){
    settings_container.classList.add("hidden");
    quiz_container.classList.add("hidden");
    stats_container.classList.remove("hidden");
}

function gotoQuiz(){
    settings_container.classList.add("hidden");
    quiz_container.classList.remove("hidden");
    stats_container.classList.add("hidden");
}

function gotoSettings(){
    settings_container.classList.remove("hidden");
    quiz_container.classList.add("hidden");
    stats_container.classList.add("hidden");
    showSettings();
}

function addCategory(){
    var value = settings_categories_options.value;
    if(!settings_categories.includes(value) && value != "Select category...")
        settings_categories.push(value);
    showSettings();
}

function addTag(){
    var value = settings_tags_options.value;
    if(!settings_tags.includes(value) && value != "Select tag...")
        settings_tags.push(value);
    showSettings();
}

async function setupSettings(){
    console.log("setting up settings..");
    settings_difficulty = [...difficulty_data];
    await loadTags();
    settings_tags = [...tags_data];
    await loadCategories();
    settings_categories = [...categories_data];
    settings_using_categories = true;
    console.log("settings set up.")
}

function resetSettings(){
    console.log("resetting settings...");
    settings_difficulty = [...difficulty_data];
    settings_tags = [...tags_data];
    settings_categories = [...categories_data];
    settings_using_categories = true;
    showSettings();
}

function showSettings(){
    settings_tags_selected.innerHTML='';
    settings_categories_selected.innerHTML='';
    settings_chbox_easy.checked = settings_difficulty.includes("easy");
    settings_chbox_medium.checked = settings_difficulty.includes("medium");
    settings_chbox_hard.checked = settings_difficulty.includes("hard");
    settings_rb_cats.checked = settings_using_categories;
    settings_rb_tags.checked = !settings_using_categories;
    
    for (tag of settings_tags){
        let span = document.createElement("span");
        span.classList.add("tag");
        span.innerHTML=tag;
        span.addEventListener('click', function(e){
            let idx = settings_tags.indexOf(e.target.innerHTML);
            settings_tags.splice(idx,1);
            showSettings();
        })
        settings_tags_selected.appendChild(span);
    }
    for (category of settings_categories){
        let span = document.createElement("span");
        span.classList.add("tag");
        span.innerHTML=category;
        span.addEventListener('click', function(e){
            let idx = settings_categories.indexOf(e.target.innerHTML);
            settings_categories.splice(idx,1);
            showSettings();
        })
        settings_categories_selected.appendChild(span);
    }
}

/* check if DOM content is loaded */
document.addEventListener('DOMContentLoaded', () =>{
    setupSettings();
    showSettings();
    eventListners();
});

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

/* load question from API */
async function loadQuestion() {
    do{  
        console.log("loading a question...");
        console.log("possible difficulties:");
        console.log(settings_difficulty);
        if(settings_using_categories){
            console.log("using categories:");
            console.log(settings_categories);
        } else {
            console.log("using tags:");
            console.log(settings_tags);
        }
        
        let result;
        let fetch_error = 0;
        do{
            let APIUrl = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=1`;
            if (settings_difficulty.length < 3 && settings_difficulty.length > 0) {
                APIUrl = APIUrl + `&difficulty=${settings_difficulty.random()}`;
            }
            if (settings_using_categories){
                
                if (settings_categories.length < categories_data.length && settings_categories.length > 0){
                    APIUrl = APIUrl + `&category=${settings_categories.random()}`;
                }
            } else {
                
                if (settings_tags.length < tags_data.length && settings_tags.length > 0){
                    APIUrl = APIUrl + `&tags=${settings_tags.random()}`;
                }
            }
            fetch_error += 1;
            if(fetch_error > 10){
                console.log("expanding difficulty");
                settings_difficulty = [...difficulty_data];
                if(fetch_error > 20){
                    if (settings_using_categories){
                        console.log("expanding categories...");
                        settings_categories = [...categories_data];
                    } else {
                        console.log("expanding tags...");
                        settings_tags = [...tags_data];
                    }
                }
            }
            console.log("APIUrl = "+APIUrl);
            console.log("fetching question API...");
            result = await fetch(`${APIUrl}`);
        } while(!result.ok);
        data = await result.json();
        console.log("question data");
        console.log(data);
    } while(isValidQuestion() === false);
    quiz_multiple = isMultipleChoice();
    quiz_ended = false;
    quiz_result.innerHTML = '';
    quiz_check_answer.innerHTML = "Check Answer";
    showQuestion(data[0]);
}

/* check if api question is valid. some of the questions don't seem to have answers. */
function isValidQuestion() {
    quiz_correct_answers = Object.values(data[0].correct_answers);
    for (answer of quiz_correct_answers)
        if(answer === 'true') return true;
    return false;
}

/* check if question is a multiple choice type. some of the questions seem to be wrongly classified by the api. */
function isMultipleChoice(){
    let count = 0;
    quiz_correct_answers = Object.values(data[0].correct_answers);
    for (answer of quiz_correct_answers){
        if (answer === 'true') count += 1;
        if (count > 1) return true;
    }
    return false;
}

/* show question data using UI */
function showQuestion(data){
    quiz_correct_answers = Object.values(data.correct_answers);
    /* quiz score */
    updateScore();

    /* question title */
    quiz_question.innerHTML = '';
    let title = document.createTextNode(data.question);
    quiz_question.appendChild(title);

    /* question category */
    quiz_category.innerHTML = data.category === "" || data.category === "uncategorized" ? "Uncategorized" : data.category;

    /* question difficulty */
    quiz_difficulty.innerHTML = data.difficulty;
    quiz_difficulty.classList.remove("Easy");
    quiz_difficulty.classList.remove("Medium");
    quiz_difficulty.classList.remove("Hard");
    quiz_difficulty.classList.add(data.difficulty);

    /* question tags */
    let quiz_taglist = document.getElementById("taglist");
    let question_tags = Object.values(data.tags);
    quiz_taglist.innerHTML = '';
    for (tag of question_tags){
        /* avoid repeating category on tags */
        if (tag.name === data.category)
            continue;
        let span = document.createElement('span');
        span.classList.add('tag');
        span.innerHTML = tag.name;
        quiz_taglist.appendChild(span);
    }

    /* question type */
    quiz_type.innerHTML = quiz_multiple ? "Multiple Choice" : "Single Choice";

    /* creation of answer list elements */
    let quiz_answers = data.answers;
    quiz_answers_ul.innerHTML = '';
    quiz_number_answers = 0;
    for (answer in quiz_answers) {
        if (quiz_answers[answer] == null){
            break;
        }
        quiz_number_answers++;
        li = document.createElement('li');
        li.classList.add("answer")
        li.id = answer;
        let text = document.createTextNode(quiz_answers[answer]);
        li.appendChild(text);
        quiz_answers_ul.appendChild(li);
    }

    /* creation of selectors for answer list elements */
    selectOption();
    document.getElementById("quiz-score-div").classList.remove("hidden");
    document.getElementById("quiz-body-div").classList.remove("hidden")
}

/* creates selectors for answer list elements */
function selectOption(){
    quiz_answers_ul.querySelectorAll('li').forEach((answer) => {
        answer.addEventListener('click', () => {
            if (quiz_ended === true)
                return;
            /* single choice */
            if(quiz_multiple === false){
                if(quiz_answers_ul.querySelector('.selected')){
                    const activeOption = quiz_answers_ul.querySelector('.selected');
                    activeOption.classList.remove('selected');
                }
                answer.classList.add('selected');
            /* multiple choice */
            } else {
                if (answer.classList.contains('selected')){
                    answer.classList.remove('selected');
                } else {
                    answer.classList.add('selected');
                }    
            }
        });
    });
}

/* update gamescore */
function updateScore(){
    quiz_current_score.innerHTML = String(current_score);
    quiz_total_questions.innerHTML = String(total_questions);
}

/* check if answer is right */
function checkAnswer(){
    if (!quiz_started){
        loadQuestion();
        quiz_started = true;
        return;
    }

    if (quiz_ended){
        loadQuestion();
        return;
    }

    let correct = true;
    let selected = false;
    /* get all answer elements */
    let answers = [
        document.getElementById("answer_a"),
        document.getElementById("answer_b"),
        document.getElementById("answer_c"),
        document.getElementById("answer_d"),
        document.getElementById("answer_e"),
        document.getElementById("answer_f"),
    ];

    /* check if at least one alternative is selected */
    for (var i = 0; i < quiz_number_answers; i++)
        if (answers[i].classList.contains("selected"))
            selected = true;
    if (selected === false){
        quiz_result.innerHTML = `<p><i class="fas fa-exclamation"></i>You need to select an alternative.</p>`;
        return;
    }

    /* loop through answers */
    for (var i = 0; i < quiz_number_answers; i++){
        /* tint correct and wrong selected answers */
        let answer_selected = answers[i].classList.contains("selected");
        if (quiz_correct_answers[i] === "true") {
            answers[i].classList.add(quiz_multiple && !answer_selected ? "correct-multiple" : "correct");
        } else if(answer_selected){
            answers[i].classList.add("wrong");
        } else {
            answers[i].classList.add("unselected");
        }

        /* checks if selected answer is correct */
        if ((quiz_correct_answers[i] === "true") === answers[i].classList.contains("selected")){
            /* do nothing */
        }
        else {
            correct = false;
        }
    }

    /* need to select an alternative */
    quiz_ended = true;
    quiz_check_answer.innerHTML = "Next Question";
    total_questions++;
    if (correct) {
        current_score++;
        quiz_result.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
    } else
        quiz_result.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p>`;
    updateScore();
}