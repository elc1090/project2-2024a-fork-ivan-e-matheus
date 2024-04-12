
question_id = 0;

fetch("https://quizapi.io/api/v1/questions?apiKey=yj02XyYZMCXObC1EPX6MRzu1yF5Vf4NVc7rQ6Nzz&limit=15")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let quiz_question = document.getElementById("quiz-question");
        quiz_question.innerHTML = data[question_id].question;
        let quiz_answers_ul = document.getElementById("quiz-answers");
        let quiz_answers = data[question_id].answers;
        for (answer in quiz_answers) {
            li = document.createElement('li');
            if (quiz_answers[answer] == null){
                return;
            }
            li.innerHTML = `<code>${quiz_answers[answer]}</code>`;
            quiz_answers_ul.appendChild(li);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

