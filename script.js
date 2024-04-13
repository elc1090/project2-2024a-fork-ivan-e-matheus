
question_id = 0;
limit = 1;

const quiz_question = document.getElementById("question");
const quiz_answers_ul = document.getElementById("answers");
const quiz_category = document.getElementById("category");
const quiz_difficulty = document.getElementById("difficulty");
let quiz_multiple = "false";

document.addEventListener('DOMContentLoaded', () =>{
    loadQuestion();
});

async function loadQuestion() {
    let APIUrl = `https://quizapi.io/api/v1/questions?apiKey=yj02XyYZMCXObC1EPX6MRzu1yF5Vf4NVc7rQ6Nzz&limit=${limit}`;
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    console.log(data);
    showQuestion(data[question_id]);
}

function showQuestion(data){
    let quiz_answers = data.answers;
    quiz_question.innerHTML = '';
    let title = document.createTextNode(data.question);
    quiz_question.appendChild(title);
    quiz_category.innerHTML = data.category === "" ? "None" : data.category;
    quiz_difficulty.innerHTML = data.difficulty;
    quiz_difficulty.classList.remove("easy");
    quiz_difficulty.classList.remove("medium");
    quiz_difficulty.classList.remove("hard");
    quiz_difficulty.classList.add(data.difficulty);
    quiz_multiple = data.multiple_correct_answers;
    for (answer in quiz_answers) {
        li = document.createElement('li');
        li.classList.add("answer")
        li.classList.add(answer)
        if (quiz_answers[answer] == null){
            break;
        }
        let text = document.createTextNode(quiz_answers[answer]);
        li.appendChild(text);
        quiz_answers_ul.appendChild(li);
    }
    selectOption();
}

function selectOption(){
    quiz_answers_ul.querySelectorAll('li').forEach((answer) => {
        answer.addEventListener('click', () => {
            if(quiz_multiple === "false"){
                if(quiz_answers_ul.querySelector('.selected')){
                    const activeOption = quiz_answers_ul.querySelector('.selected');
                    activeOption.classList.remove('selected');
                }
                answer.classList.add('selected');
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