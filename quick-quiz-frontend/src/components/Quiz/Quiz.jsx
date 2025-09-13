import React, { useState, useRef } from 'react'
import './Quiz.css'
import data from '../../assets/data';

const Quiz = () => {
    let [index, setIndex] = useState(0);
    let [questions, setQuestions] = useState(data[index]);
    let [locked, setLocked] = useState(false);
    let [showScore, setShowScore] = useState(false);

    let scoreRef = useRef(0);
    let option1 = useRef(null);
    let option2 = useRef(null);
    let option3 = useRef(null);
    let option4 = useRef(null);
    let options = [option1, option2, option3, option4];

    const checkAns = (e, ans) => {
        if (locked) return;

        if (questions.answer === ans) {
            e.target.classList.add("correct");
            setLocked(true);
            scoreRef.current += 1;
        }
        else {
            e.target.classList.add("wrong");
            setLocked(true);
            options[questions.answer - 1].current.classList.add("correct");

        }
    }
    const reset=()=>{
        setIndex(0);
        setQuestions(data[0]);
        setLocked(false);
        scoreRef.current=0;
        setShowScore(false);
        options.map((option) => {
            option.current.classList.remove("correct");
            option.current.classList.remove("wrong");
        });
    }
    const next = () => {
        if (locked === true) {
            if (index === data.length - 1) {
                setShowScore(true);
                return;
            }
            setIndex(++index);
            setQuestions(data[index]);
            setLocked(false);
            options.map((option) => {
                option.current.classList.remove("correct");
                option.current.classList.remove("wrong");
            });
            return null;
           
        }
    }

    return (
        <div className='container'>
            <h1>Quick Quiz</h1>
            <hr />
            {showScore ? <> <h2>You scored {scoreRef.current} out of {data.length}</h2>
                <button onClick={reset}>Reset</button ></> : <>
                <h2>{index + 1}. {questions.question}</h2>
                <ul>
                    <li ref={option1} onClick={(e) => { checkAns(e, 1) }}>{questions.options[0]}</li>
                    <li ref={option2} onClick={(e) => { checkAns(e, 2) }}>{questions.options[1]}</li>
                    <li ref={option3} onClick={(e) => { checkAns(e, 3) }}>{questions.options[2]}</li>
                    <li ref={option4} onClick={(e) => { checkAns(e, 4) }}>{questions.options[3]}</li>
                </ul>
                <button onClick={next}>Next</button>
                <div className="index">{index + 1} of {data.length} questions</div>
            </>}

        </div>
    )
}

export default Quiz;