import React, { useContext, useState } from 'react'
import './main.css';
import { assets } from '../../assets/assets/assets/assets';
import { Context } from '../../context/Context';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const Main = () => {
    const { OnSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const [isListening, setIsListening] = useState(false);

    if (recognition) {
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.continuous = true;

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setInput(transcript);
        };

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech Recognition error:', event.error);
            setIsListening(false);
        };
    }

    const startListening = () => {
        if (recognition) {
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (!input.trim()) {
                alert("Please provide some input");
                return;
            }
            event.preventDefault();
            OnSent();
        }
    };
    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {
                    !showResult ?
                        <>
                            <div className="greet">
                                <p><span>Hello, Dev.</span></p>
                                <p>How can I help you today</p>
                            </div>
                            <div className="cards">
                                <div className="card" onClick={() => OnSent("Suggest some beautiful places to see on an upcoming road trip")}>
                                    <p>Suggest some beautiful places to see on an upcoming road trip</p>
                                    <img src={assets.compass_icon} alt="" />
                                </div>
                                <div className="card" onClick={() => OnSent("Briefly summarize this concept: Urban Planning")}>
                                    <p>Briefly summarize this concept: Urban Planning</p>
                                    <img src={assets.bulb_icon} alt="" />
                                </div>
                                <div className="card" onClick={() => OnSent("Brainstorm team bonding activities for our work retreat")}>
                                    <p>Brainstorm team bonding activities for our work retreat</p>
                                    <img src={assets.message_icon} alt="" />
                                </div>
                                <div className="card" onClick={() => OnSent("Improve the readability of the following code")}>
                                    <p>Improve the readability of the following code</p>
                                    <img src={assets.code_icon} alt="" />
                                </div>
                            </div>
                        </>
                        :
                        <div className='result'>
                            <div className="result-title">
                                <img src={assets.user_icon} alt="" />
                                <p>{recentPrompt}</p>
                            </div>
                            <div className="result-data">
                                <img src={assets.gemini_icon} alt="" />
                                {loading ? <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                                    :
                                    <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                                    // <ReactMarkdown> {resultData || ""} </ReactMarkdown>
                                }
                            </div>
                        </div>

                }
                <div className="main-bottom">
                    <div className="search-box">
                        <input type="text" onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} value={input} name="" placeholder='Enter a Prompt here' id="" />
                        <div>
                            <img src={isListening ? assets.pause_icon : assets.mic_icon} onClick={isListening ? stopListening : startListening} alt="" />
                            <img
                                onClick={() => OnSent()}
                                style={{
                                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                                    opacity: input.trim() ? 1 : 0.5,
                                }}
                                src={assets.send_icon} alt=""
                                onPointerDown={(e) => !input.trim() && e.preventDefault()} />
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main
