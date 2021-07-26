import React, { useState, useEffect } from 'react';
import UIFx from 'uifx';
import './index.css';
import file from '../../sounds/beep.mp3';
const beep = new UIFx(file);
let pomodori = 1;

export default function Pomodoro() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [message, setMessage] = useState(false);
    const [status, setStatus] = useState('Work time!');
    const [enabled, setEnabled] = useState(false);
    const [preset, setPreset] = useState('normal');
    const messageBox = document.querySelector('#message');
    const buttons = document.querySelectorAll('.btn');

    const presets = {
        normal: {
            initial: 25,
            work: 24,
            break: 4,
            longBreak: 15
        },
        short: {
            initial: 20,
            work: 19,
            break: 4,
            longBreak: 15
        },
        long: {
            initial: 30,
            work: 29,
            break: 9,
            longBreak: 20
        }
    }

    useEffect(() => {
        if (enabled) {
            buttons.forEach(i => i.style.opacity = '0.5');

            if (status === 'Work time!') {
                document.body.style.backgroundColor = '#ec3434';
                messageBox.innerHTML = `Work time! ${pomodori}° Pomodori`;

            } else {
                messageBox.innerHTML = pomodori === 4 ? `Long break time! ${pomodori}° Pomodori`: `Short break time! ${pomodori}° Pomodori`;
                document.body.style.backgroundColor = '#3461ff';
            }

            document.title = `${minutes < 10 ? `0${minutes}`: minutes}:${seconds < 10 ? `0${seconds}`: seconds} - ${status}`;

            let interval = setInterval(() => {
                clearInterval(interval);

                if (seconds === 0) {
                    if (minutes !== 0) {
                        setMinutes(minutes - 1);
                        setSeconds(59);

                    } else {
                        pomodori = status === 'Break time!' ? pomodori === 4 ? pomodori = 0 : pomodori += 1: pomodori;
                        beep.play();
                        
                        setMessage(!message);
                        setStatus(message ? 'Work time!': 'Break time!');
                        setMinutes(message ? presets[preset].work: pomodori === 4 ? presets[preset].longBreak: presets[preset].break);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }

            }, document.hidden ? 500: 1000);
        }
    }, [seconds, enabled]);

    function handlePresets(preset) {
        if (!enabled) {
            const confirm = window.confirm(`Are you sure you want to select ${preset} preset?`);

            if (confirm) {
                setPreset(preset);
                setMinutes(presets[preset].initial);
                setSeconds(0);
            }
        }
    }
    
    function handleEnabled(bool) {
        if (!bool) {
            document.body.style.backgroundColor = 'rgb(11, 11, 11)';
            document.title = 'Stopped - Pomoclock';
            messageBox.innerHTML = 'Stopped';
            buttons.forEach(i => i.style.opacity = '1');
        }
        
        setEnabled(bool);
    }

    function handleTimer(action) {
        if (!enabled) {
            const confirm = window.confirm(`Are you sure you want to ${action} 1 minute?`);
            setMinutes(confirm && action === 'add' ? minutes + 1: confirm && minutes > 0 ? minutes - 1: minutes);
        }
    }

    return (
        <div className="pomodoro-timer">
            <div className="options">
                <h1>Presets</h1>
                <button className="btn" id="btnN" onClick={() => handlePresets('normal')} title="5m short break / 15m long break">Normal</button>
                <button className="btn" id="btnS" onClick={() => handlePresets('short')} title="5m short break / 15m long break">Short</button>
                <button className="btn" id="btnL" onClick={() => handlePresets('long')} title="10m short break / 20m long break">Long</button>
                <hr />
            </div>
            <div className="message-box">
                <h1 id="message">Stopped</h1>
            </div>
            <div className="timer">
                <h1 title="Timer">{minutes < 10 ? `0${minutes}`: minutes}:{seconds < 10 ? `0${seconds}`: seconds}</h1>
                <button onClick={() => handleEnabled(true)} title="Start timer">Start</button>
                <button onClick={() => handleEnabled(false)} title="Stop timer">Stop</button>
                <button className="btn" id="btnP" onClick={() => handleTimer('add')} title="Add 1 minute">+1m</button>
                <button className="btn" id="btnM" onClick={() => handleTimer('remove')} title="Remove 1 minute">-1m</button>
                <br />
                <input type="text" placeholder="Task" title="Task textbox" />
            </div>
        </div>
    );
}