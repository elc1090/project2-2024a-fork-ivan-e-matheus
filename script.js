
question_id = 0;
limit = 1;

let quiz_question = document.getElementById("question");
let quiz_answers_ul = document.getElementById("answers");
let quiz_category = document.getElementById("category");
let quiz_difficulty = document.getElementById("difficulty");

fetch(`https://quizapi.io/api/v1/questions?apiKey=yj02XyYZMCXObC1EPX6MRzu1yF5Vf4NVc7rQ6Nzz&limit=${limit}&category=linux`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let quiz_answers = data[question_id].answers;
        quiz_question.innerHTML = '';
        let title = document.createTextNode(data[question_id].question);
        quiz_question.appendChild(title);
        quiz_category.innerHTML = data[question_id].category === "" ? "None" : data[question_id].category;
        quiz_difficulty.innerHTML = data[question_id].difficulty;
        quiz_difficulty.classList.remove("easy");
        quiz_difficulty.classList.remove("medium");
        quiz_difficulty.classList.remove("hard");
        quiz_difficulty.classList.add(data[question_id].difficulty);
        for (answer in quiz_answers) {
            li = document.createElement('li');
            li.classList.add(answer)
            if (quiz_answers[answer] == null){
                return;
            }
            let text = document.createTextNode(quiz_answers[answer]);
            li.appendChild(text);
            quiz_answers_ul.appendChild(li);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

function selectOption(){

}