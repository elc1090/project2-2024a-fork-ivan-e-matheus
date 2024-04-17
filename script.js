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

/* store settings data */
let settings_tags, settings_categories;
let tags_data, categories_data;

/* load settings UI elements */
const settings_tags_options = document.getElementById("settings-tags");
const settings_categories_options = document.getElementById("settings-categories");

async function loadTags() {
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
        if (!filter_tags.includes(tag.name))
            tags_list.push(tag.name);
    }
    console.log("tags data");
    console.log(tags_list);
}

async function loadCategories(){
    let APIUrl = `https://quizapi.io/api/v1/categories?apiKey=${apiKey}`;
    let result;
    do{
        result = await fetch(`${APIUrl}`);
    } while(!result.ok);
    categories_data = await result.json();
    let categories_list = [];
    for (category of categories_data){
        categories_list.push(category.name);
    }
    console.log("categories data");
    console.log(categories_list);
}

/* creates eventlistners for buttons */
function eventListners(){
    quiz_check_answer.addEventListener('click', checkAnswer);
    wrapper_footer_settings.addEventListener('click', gotoSettings);
    wrapper_footer_game.addEventListener('click', gotoQuiz);
    wrapper_footer_stats.addEventListener('click', gotoStats);
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
}

/* check if DOM content is loaded */
document.addEventListener('DOMContentLoaded', () =>{
    loadTags();
    loadCategories();
    loadQuestion();
    eventListners();
});

/* load question from API */
async function loadQuestion() {
    do{  
        let APIUrl = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=1`;
        let result;
        do{
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
    console.log("question tags");
    console.log(question_tags);
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