// App.jsx
/*
import React, { useState, useEffect } from 'react';

export default function App() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [texts, setTexts] = useState([]);
  const [gridSize, setGridSize] = useState(37); // n x n 크기 조절 변수 (기본값: 37)
  const [flashTime, setFlashTime] = useState(0);

  useEffect(() => {
    if (isFlashing) {
      const interval = setInterval(() => {
        const newTexts = [];
        for (let i = 0; i < gridSize; i++) {
          const speedX = Math.random() * 2 + 1; // X축 이동 속도
          const speedY = Math.random() * 2 + 1; // Y축 이동 속도
          const xPos = Math.random() * window.innerWidth;
          const yPos = Math.random() * window.innerHeight;
          newTexts.push({
            text: '대파스를 찬양하라',
            x: xPos,
            y: yPos,
            speedX: speedX,
            speedY: speedY,
            width: 200,
            height: 40
          });
        }
        setTexts(newTexts);
      }, 10);

      // Flash duration for 0.01 sec
      setTimeout(() => {
        setIsFlashing(false);
      }, 10); // 10ms for flashing

      return () => clearInterval(interval);
    }
  }, [isFlashing, gridSize]);

  const handleButtonClick = () => {
    setIsFlashing(true);
    setFlashTime(Date.now());
  };

  const handleGridSizeChange = (event) => {
    setGridSize(event.target.value);
  };

  const moveText = (text) => {
    // Update the position of each text based on speed
    let newX = text.x + text.speedX;
    let newY = text.y + text.speedY;

    // If the text reaches the boundary, reverse the direction (bounce effect)
    if (newX > window.innerWidth - text.width || newX < 0) {
      text.speedX = -text.speedX;
    }
    if (newY > window.innerHeight - text.height || newY < 0) {
      text.speedY = -text.speedY;
    }

    return { ...text, x: newX, y: newY };
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <button onClick={handleButtonClick}>점멸 시작</button>
      <input
        type="number"
        value={gridSize}
        onChange={handleGridSizeChange}
        min="1"
        max="100"
        style={{ marginTop: '10px' }}
      />
      <label> 텍스트 개수</label>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isFlashing ? (flashTime % 20 < 10 ? 'black' : 'white') : 'transparent',
          transition: 'background-color 0.1s',
        }}
      />

      {texts.map((text, idx) => {
        const updatedText = moveText(text); // Move text according to speed

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: updatedText.y + 'px',
              left: updatedText.x + 'px',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {updatedText.text}
          </div>
        );
      })}
    </div>
  );
}
*/


import React, { useState, useEffect } from 'react';

export default function App() {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [second, setSecond] = useState('');
  const [alarmTime, setAlarmTime] = useState(null);
  const [alarmStartTime, setAlarmStartTime] = useState(null);
  const [alarmEndTime, setAlarmEndTime] = useState(null);
  const [isRinging, setIsRinging] = useState(false);
  const [flash, setFlash] = useState(false);
  const [gameNumbers, setGameNumbers] = useState([]);
  const [currentClick, setCurrentClick] = useState(1);
  const [clickedButtons, setClickedButtons] = useState([]);
  let gridSize = 2; // n x n 크기 조절 변수 (예: 3이면 3x3, 4면 4x4)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');

      if (alarmTime === `${hh}:${mm}:${ss}` && !isRinging) {
        const nowStr = `${hh}:${mm}:${ss}`;
        console.log(`🔔 Alarm ringing at ${nowStr}`);
        setIsRinging(true);
        setAlarmStartTime(nowStr);
        const size = gridSize * gridSize;
        setGameNumbers(shuffleArray(Array.from({ length: size }, (_, i) => i + 1)));
        setCurrentClick(1);
        setClickedButtons([]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [alarmTime, isRinging, gridSize]);

  useEffect(() => {
    let flashInterval;
    if (isRinging) {
      flashInterval = setInterval(() => {
        setFlash(f => !f);
      }, 500);
    } else {
      setFlash(false);
    }
    return () => clearInterval(flashInterval);
  }, [isRinging]);

  const handleSetAlarm = () => {
    if (hour !== '' && minute !== '' && second !== '') {
      const timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
      setAlarmTime(timeStr);
      console.log(`⏱️ Alarm set for ${timeStr}`);
      alert(`Alarm set for ${timeStr}`);
    }
  };

  const handleGameClick = (num) => {
    if (num === currentClick) {
      const newClicked = [...clickedButtons, num];
      setClickedButtons(newClicked);
      setCurrentClick(currentClick + 1);
      if (currentClick === gridSize * gridSize) {
        const now = new Date();
        const endStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        gridSize += 1;
        console.log(`✅ Alarm dismissed at ${endStr}`);
        setAlarmEndTime(endStr);
        console.log(`⏱️ Alarm was set for: ${alarmStartTime}`);
        console.log(`✅ Alarm was dismissed at: ${endStr}`);
        setIsRinging(false);
        setAlarmTime(null);
      }
    } else {
      setClickedButtons([]);
      setCurrentClick(1);
    }
  };

  const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: flash ? 'black' : 'white',
      color: flash ? 'white' : 'black',
      transition: 'background-color 0.2s, color 0.2s'
    }}>
      {!isRinging && (
        <>
          <h1>Set Alarm</h1>
          <input
            type="number"
            placeholder="Hour (0-23)"
            value={hour}
            onChange={e => setHour(e.target.value)}
          />
          <input
            type="number"
            placeholder="Minute (0-59)"
            value={minute}
            onChange={e => setMinute(e.target.value)}
          />
          <input
            type="number"
            placeholder="Second (0-59)"
            value={second}
            onChange={e => setSecond(e.target.value)}
          />
          <button onClick={handleSetAlarm}>Set Alarm</button>
          {alarmStartTime && alarmEndTime && (
            <div style={{ marginTop: '20px' }}>
              <p>🔓 Alarm triggered at: {alarmStartTime}</p>
              <p>✅ Alarm dismissed at: {alarmEndTime}</p>
            </div>
          )}
        </>
      )}

      {isRinging && (
        <>
          <h1>⏰ Alarm Ringing! ⏰</h1>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 60px)`,
            gridGap: '10px'
          }}>
            {gameNumbers.map((num, idx) => (
              <button
                key={idx}
                onClick={() => handleGameClick(num)}
                style={{
                  width: '60px',
                  height: '60px',
                  fontSize: '20px',
                  opacity: clickedButtons.includes(num) ? 0.3 : 1
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}