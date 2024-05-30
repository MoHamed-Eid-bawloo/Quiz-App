let Count = document.querySelector(".count span"),
resultCount = document.querySelector(".results .now"),
resultCount2 = document.querySelector(".results .all"),
Spans = document.querySelector(".spans"),
qsArea = document.querySelector(".quistion"),
numfQuestion = 0,
Answers = document.querySelector(".answers"),
Form=document.createElement("form"),
rightAnswers = 0,
SubmitButton = document.querySelector(".submit_button"),
bullets = document.querySelector(".bullets"),
ResultContainer = document.querySelector(".results"),
AnswerArea = document.querySelector(".answer_area"),
CountDownInterval = 0,
CountArea = document.querySelector(".counts_down");



function getInfo() {
    let Information= new XMLHttpRequest();
    
    Information.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject=JSON.parse(this.responseText);
            let CountQu = jsonObject.length;
            
            CountQuest(CountQu)
            
            AddAutoData(jsonObject[numfQuestion],CountQu)
            
            CountDown(10,CountQu)

            resultCount.innerHTML=numfQuestion;
            
            SubmitButton.onclick = ()=>{
                let RiAnswers = jsonObject[numfQuestion].rightAnswer;
                
                numfQuestion++;

                clearInterval(CountDownInterval);
                CountDown(10,CountQu)

                CheckAnswer(RiAnswers,CountQu)
                
                
                qsArea.innerHTML = "";
                Answers.innerHTML = "";
                
                
                AddAutoData(jsonObject[numfQuestion],CountQu);
                

                //Handle Spans
                HandelSpans()
                
                console.log(numfQuestion);
                //Show Final Result .....
                ShowResults(CountQu)
                
            }
            
            console.log(jsonObject);
        }
    }
    Information.open("GET","quiz.json",true)
    Information.send()
}
getInfo()
function CountQuest(num) {
    Count.innerHTML = num;
    resultCount2.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let SPa = document.createElement("span");
        Spans.appendChild(SPa);
        if (i === 0) {
            SPa.classList.add("on");
        }
    }
}

function AddAutoData(numOfObject,count) {
    if (numfQuestion < count) {        
        let h2 = document.createElement("h2");
        let TextH2 = document.createTextNode(numOfObject["question"]);
        h2.appendChild(TextH2);
        qsArea.appendChild(h2);
        //Now we will create inputs;
        for (let i = 0; i < 4; i++) {
        let Div = document.createElement("div");
        Div.classList.add("answer");
        Answers.appendChild(Div);
        let CerInput = document.createElement("input");
        CerInput.type = "radio";
        CerInput.id = `answer_${i+1}`;
        CerInput.name = "answers";
        CerInput.value = numOfObject[`answer${i+1}`];
        Answers.appendChild(CerInput);
        let Inputtxt = document.createTextNode(numOfObject[`answer${i+1}`]);
        let label = document.createElement("label");
        label.appendChild(Inputtxt);
        label.htmlFor = `answer_${i+1}`;
        Answers.appendChild(label);
        if (i === 0) {
            CerInput.checked = true
        }
    }
}
}

function CheckAnswer(RAnswers,count) {
    let answer = document.getElementsByName("answers");
    let ChossenAnswer;
    for (let i = 0; i < answer.length; i++) {
        if (answer[i].checked) {
            ChossenAnswer = answer[i].value;
        }
    }if (ChossenAnswer === RAnswers) {
        rightAnswers++;
        console.log("right answer");
    }else{
        console.log("wrong answer");
    }
}

//Function To handle the Spans.....

function HandelSpans() {
    let SPAN = document.querySelectorAll(".spans span");
    let arrayOfSpans = Array.from(SPAN);
    arrayOfSpans.forEach((element,index)=>{
        if (numfQuestion === index) {
            element.classList.add("on")
        }
    })
}

//Show Results

function ShowResults(FinalCount) {
    let State = document.querySelector(".state");
    State.style.fontsize = "20px"
    if (numfQuestion === FinalCount) {
        qsArea.remove();
        Answers.remove();
        bullets.remove();
        SubmitButton.remove();
        resultCount.innerHTML = rightAnswers;
        if (rightAnswers>=(numfQuestion/2) && rightAnswers < FinalCount) {
        ResultContainer.style.display = "block";    
        AnswerArea.appendChild(ResultContainer)
        State.innerHTML = "Good";
    }else if (rightAnswers<(numfQuestion/2)) {
        ResultContainer.style.display = "block";    
        AnswerArea.appendChild(ResultContainer)
        State.innerHTML = "Bad";
        State.style.color = "red";
    } else if(rightAnswers === FinalCount){
        ResultContainer.style.display = "block";    
        AnswerArea.appendChild(ResultContainer);
        State.innerHTML = "Perfected";
    }
    }
}



function CountDown(duration,count) {
    if (numfQuestion < count) {
        let minutes,seconds;
        CountDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);            
            seconds = parseInt(duration % 60);
            minutes = minutes<10?`0${minutes}`:minutes;
            seconds = seconds<10?`0${seconds}`:seconds;
            CountArea.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(CountDownInterval);
                SubmitButton.onclick()
            }
        },1000)
    }
}