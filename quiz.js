const ProgressBar=document.querySelector(".progress-bar")
const ProgressText=document.querySelector(".progress-text")
const progress=(value)=>{
    const percentage=(value / timePerquestion.value) * 100
    ProgressBar.style.width=`${percentage}%`
    ProgressText.innerHTML=`${value}`
}
let questions=[],time=30,Currentquestion,timer,score=0
const Start=document.querySelector(".start")
const Numofquestion=document.querySelector("#numquestion")
const Category=document.querySelector("#category")
const Difficulty=document.querySelector("#difficulty")
const timePerquestion=document.querySelector("#time")
const Quiz=document.querySelector(".quiz")
const Maincontainer=document.querySelector(".main-container")
// console.log(Start,Numofquestion,Category,Difficulty,timePerquestion,Quiz,Maincontainer)
const StartQuiz=()=>{
    const num=Numofquestion.value,
    cate=Category.value,
    diff=Difficulty.value
    const Api=`https://opentdb.com/api.php?amount=${num}&category=${cate}&difficulty=${diff}&type=multiple`
    fetch(Api).then((result)=>result.json()).then((output)=>{
        questions=output.results
        Maincontainer.classList.add("hide")
        Quiz.classList.remove("hide")
        Currentquestion=1
        showquestion(questions[0])
    })
}
// in this two button where used to next is disabled after finish or submit is disabled while we answer
const submit=document.querySelector(".submit")
const next=document.querySelector(".next")
const showquestion=(question)=>{
    const questiontext=document.querySelector(".question")
    const answertext=document.querySelector(".answer-box")
    const questionnum=document.querySelector(".num")
    questiontext.innerHTML=question.question
    // this is for seperate the correct answer
    const answers=[...question.incorrect_answers,
        question.correct_answer.toString(),]
    //correct answer are always last so mix them
    answers.sort(() => Math.random() - 0.5)
    answertext.innerHTML=""
    answers.forEach((answer)=>{
        answertext.innerHTML +=`
         <div class="answers">
                        <span class="ans-text">${answer}</span>
                        <span class="check-box">
                        <span class="icon">✔</span>
                        </span>   
        </div>`
    })
    // this is show how many question and how many questio you are answered
    questionnum.innerHTML=`
    Question <span class="current">${questions.indexOf(question)+1}</span>
    <span class="total">/${questions.length}</span>`
    const AnswerDiv=document.querySelectorAll(".answers")
    AnswerDiv.forEach((answer)=>{
        answer.addEventListener("click",()=>{
            if(!answer.classList.contains("checked")){
                AnswerDiv.forEach((answer)=>{
                    answer.classList.remove("selected")
                })
                answer.classList.add("selected")
                submit.disabled=false
            }
        })
    })
    // is used to start the timer
    time=timePerquestion.value
    starttimer(time)
}
const starttimer=(time)=>{
    timer=setInterval(()=>{
        if(time>=0){
            // this is used to start the time
            progress(time)
            time--
        }
        else{
            clearInterval(timer)
            checkAns()
        }
    },1000)
}
submit.addEventListener("click",()=>{
    checkAns()
})
const checkAns=()=>{
    clearInterval(timer)
    const selectedAnswer=document.querySelector(".answers.selected")
    if(selectedAnswer){
        const answer=selectedAnswer.querySelector(".ans-text").textContent
        // here using -1 because already we add the 1 in previous
        if(answer=== questions[Currentquestion-1].correct_answer){
            score++
            selectedAnswer.classList.add("correct")
        }
        else{
            selectedAnswer.classList.add("wrong")
            const correctAnswer=document.querySelectorAll(".answers")
            .forEach((answer)=>{
                if(answer.querySelector(".ans-text").innerHTML=== questions[Currentquestion-1].correct_answer){
                    answer.classList.add("correct")
                }
            })
        }
    }
    else{
        const correctAnswer=document.querySelectorAll(".answers")
        .forEach((answer)=>{
            if(answer.querySelector(".ans-text").innerHTML=== questions[Currentquestion-1].correct_answer)
                {
                answer.classList.add("correct")
            }
        })
    }
    const AnswerDiv=document.querySelectorAll(".answer")
    AnswerDiv.forEach((answer)=>{
        answer.classList.add("checked")
    })
    submit.style.display="none"
    next.style.display="block"
}
next.addEventListener("click",()=>{
    nextQuestion()
    submit.style.display="block"
    submit.disabled = true
    next.style.display="none"
})
const nextQuestion=()=>{
    if (Currentquestion < questions.length) {
        showquestion(questions[Currentquestion])
        Currentquestion++
    }
    else{
        showscore()
    }
}
const lastpage=document.querySelector(".last-page")
const FinalScore=document.querySelector(".final-score")
const TotlScore=document.querySelector(".total-score")
const showscore=()=>{
    lastpage.classList.remove("hide")
    Quiz.classList.add("hide")
    FinalScore.innerHTML=score
    TotlScore.innerHTML=`/${questions.length}`
}
const restart=document.querySelector(".restart")
restart.addEventListener("click",()=>{
    window.location.reload()
})



document.addEventListener('DOMContentLoaded', () => {
  console.log('quiz.js loaded'); // open console (F12) to verify this prints

  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
  const startBtn = document.querySelector('.start');      // ".btn start"
  const restartBtn = document.querySelector('.restart');  // ".btn restart"

  // --- Load saved theme ---
  const savedTheme = localStorage.getItem('theme'); // "light" or "dark"
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    if (toggleBtn) toggleBtn.textContent = '🌞';
  } else {
    if (toggleBtn) toggleBtn.textContent = '🌙';
  }

  // --- Theme toggle handler ---
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      if (body.classList.contains('light-mode')) {
        toggleBtn.textContent = '🌞';
        localStorage.setItem('theme', 'light');
      } else {
        toggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- Start quiz function (also exposed to window for inline onclick) ---
  function StartQuiz() {
    const mainContainer = document.querySelector('.main-container');
    const quizScreen = document.querySelector('.quiz');
    if (mainContainer) mainContainer.classList.add('hide');
    if (quizScreen) quizScreen.classList.remove('hide');

    // If you have an init function for quiz logic, call it:
    if (typeof initQuiz === 'function') initQuiz();
  }
  // make sure inline onclick="StartQuiz()" still works
  window.StartQuiz = StartQuiz;

  // also attach via event listener (more robust)
  if (startBtn) startBtn.addEventListener('click', StartQuiz);

  // --- Restart: return to home WITHOUT reloading (so theme persists) ---
  if (restartBtn) {
    restartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContainer = document.querySelector('.main-container');
      const quizScreen = document.querySelector('.quiz');
      const lastPage = document.querySelector('.last-page');

      if (lastPage) lastPage.classList.add('hide');
      if (quizScreen) quizScreen.classList.add('hide');
      if (mainContainer) mainContainer.classList.remove('hide');

      // reset any quiz state you maintain (scores, current index)
      if (typeof resetQuiz === 'function') {
        resetQuiz();
      } else {
        // minimal UI resets if you didn't implement resetQuiz
        const finalScore = document.querySelector('.final-score');
        if (finalScore) finalScore.textContent = '0';
        const current = document.querySelector('.current');
        if (current) current.textContent = '1';
      }
    });
  }

  // Optional: if other UI buttons (submit/next) are failing, attach here similarly:
  // document.querySelector('.submit')?.addEventListener('click', submitHandler);
});
