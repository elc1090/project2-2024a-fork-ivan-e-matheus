const limit = 1;
const quiz_question = document.getElementById("question");
const quiz_answers_ul = document.getElementById("answers");
const quiz_category = document.getElementById("category");
const quiz_difficulty = document.getElementById("difficulty");
const quiz_type = document.getElementById("type");
const quiz_check_answer = document.getElementById("check-answer");

let quiz_multiple = "false", data = "";

function eventListners(){
    quiz_check_answer.addEventListener('click', checkAnswer);
}

document.addEventListener('DOMContentLoaded', () =>{
    loadQuestion();
    eventListners();
});

async function loadQuestion() {
    let APIUrl = `https://quizapi.io/api/v1/questions?apiKey=yj02XyYZMCXObC1EPX6MRzu1yF5Vf4NVc7rQ6Nzz&limit=${limit}`;
    let result = await fetch(`${APIUrl}`);
    data = await result.json();
    console.log(data);
    showQuestion(data[0]);
}

function showQuestion(data){
    let quiz_correct_answers = Object.values(data.correct_answers);
    let question_tags = Object.values(data.tags);
    console.log(question_tags);
    let quiz_answers = data.answers;
    quiz_question.innerHTML = '';
    let title = document.createTextNode(data.question);
    quiz_question.appendChild(title);
    
    quiz_category.innerHTML = data.category === "" ? "Uncategorized" : data.category;
    /* quiz difficulty */
    quiz_difficulty.innerHTML = data.difficulty;
    quiz_difficulty.classList.remove("easy");
    quiz_difficulty.classList.remove("medium");
    quiz_difficulty.classList.remove("hard");
    quiz_difficulty.classList.add(data.difficulty);
    /* quiz type */
    quiz_multiple = data.multiple_correct_answers;
    quiz_type.innerHTML = quiz_multiple === "true" ? "Multiple Choice" : "Single Choice";
    /* creation of answer list elements */
    for (answer in quiz_answers) {
        if (quiz_answers[answer] == null){
            break;
        }
        li = document.createElement('li');
        li.classList.add("answer")
        li.classList.add(answer)
        let text = document.createTextNode(quiz_answers[answer]);
        li.appendChild(text);
        quiz_answers_ul.appendChild(li);
    }
    selectOption();
}

function selectOption(){
    quiz_answers_ul.querySelectorAll('li').forEach((answer) => {
        answer.addEventListener('click', () => {
            /* resposta única */
            if(quiz_multiple === "false"){
                if(quiz_answers_ul.querySelector('.selected')){
                    const activeOption = quiz_answers_ul.querySelector('.selected');
                    activeOption.classList.remove('selected');
                }
                answer.classList.add('selected');
            /* múltipla escolha */
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

function checkAnswer(){
    console.log("checando");
    quiz_check_answer.disabled = true;
}