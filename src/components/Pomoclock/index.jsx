import React, { useState, useEffect } from 'react';
import UIFx from 'uifx';
import './index.css';
import file from '../../sounds/beep.mp3';

export default function Pomodoro() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [message, setMessage] = useState(false);
    const [status, setStatus] = useState('Work time!');
    const [enabled, setEnabled] = useState(false);
    const messageBox = document.querySelector('#message');
    const beep = new UIFx(file);

    useEffect(() => {
        if (enabled) {
            if (status === 'Work time!') {
                document.body.style.backgroundColor = '#ec3434';
                messageBox.innerHTML = 'Work time!';
            } else {
                document.body.style.backgroundColor = '#3461ff';
            }

            document.title = `${minutes < 10 ? `0${minutes}`: minutes}:${seconds < 10 ? `0${seconds}`: seconds} - ${status}`;

            const interval = setInterval(() => {
                clearInterval(interval);

                if (seconds === 0) {
                    if (minutes !== 0) {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    } else {
                        messageBox.innerHTML = 'Break time!';
                        
                        beep.play();
                        setMessage(!message);
                        setStatus(message ? 'Work time!': 'Break time!');
                        setMinutes(message ? 24: 4);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }
    }, [seconds, enabled]);
    
    function handleEnabled(bool) {
        if (!bool) {
            document.body.style.backgroundColor = 'rgb(11, 11, 11)';
            document.title = 'Stopped - Pomoclock';
            messageBox.innerHTML = 'Stopped';
        }

        setEnabled(bool);
    }

    return (
        <div className="app">
        <div className="pomodoro-timer">
            <div className="message-box">
                <h1 id="message">Stopped</h1>
            </div>
            <div className="timer">
                <h1>{minutes < 10 ? `0${minutes}`: minutes}:{seconds < 10 ? `0${seconds}`: seconds}</h1>
                <button onClick={() => handleEnabled(true)}>Start</button>
                <button onClick={() => handleEnabled(false)}>Stop</button>
                <br />
                <input type="text" placeholder="Task" />
            </div>
        </div>
        </div>
    )
}