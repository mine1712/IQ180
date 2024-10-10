import { useState, useEffect } from 'react';
import '../css/Multiplayer-temp.css';
import io from 'socket.io-client';

const server = io.connect('http://localhost:5172');

function Multiplayertemp() {
  const [numbers, setNumbers] = useState([]);
  const [targetResult, setTargetResult] = useState(null);
  const [operators, setOperators] = useState(['+', '-', '*', '/']);
  const [userResult, setUserResult] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [draggedOperatorIndex, setDraggedOperatorIndex] = useState(null);
  const [draggedNumberIndex, setDraggedNumberIndex] = useState(null);

  useEffect(() => {
    // Fetch numbers and target result from the backend
    server.on('numbers', (data) => {
      setNumbers(data.numbers);
      setTargetResult(data.targetResult);
    });

    // Request numbers and target result from the backend
    server.emit('requestNumbers');
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTimeUp(true);
    }
  }, [timeLeft]);

  const calculateResult = () => {
    const isSolvable = (nums, target) => {
      const helper = (nums, target) => {
        if (nums.length === 1) {
          return Math.abs(nums[0] - target) < 1e-6;
        }

        for (let i = 0; i < nums.length; i++) {
          for (let j = 0; j < nums.length; j++) {
            if (i !== j) {
              const remaining = nums.filter((_, index) => index !== i && index !== j);
              for (const op of operators) {
                let result;
                if (op === '+') result = nums[i] + nums[j];
                if (op === '-') result = nums[i] - nums[j];
                if (op === '*') result = nums[i] * nums[j];
                if (op === '/' && nums[j] !== 0) result = nums[i] / nums[j];

                if (result !== undefined) {
                  if (helper([...remaining, result], target)) {
                    return true;
                  }
                }
              }
            }
          }
        }
        return false;
      };

      return helper(nums, target);
    };

    const result = isSolvable(numbers, targetResult);
    setUserResult(result ? targetResult : 'Invalid expression');
    setIsCorrect(result);
  };

  const handleNameSubmit = () => {
    setShowNameInput(false);
    server.emit('joinRoom', { room: selectedRoom, name: userName });
  };

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
    setShowModal(false);
    setShowNameInput(true);
  };

  const handleNumberDragStart = (index) => {
    setDraggedNumberIndex(index);
  };

  const handleNumberDrop = (index) => {
    if (draggedNumberIndex !== null) {
      const newNumbers = [...numbers];
      const [draggedNumber] = newNumbers.splice(draggedNumberIndex, 1);
      newNumbers.splice(index, 0, draggedNumber);
      setNumbers(newNumbers);
      setDraggedNumberIndex(null);
    }
  };

  const handleOperatorDragStart = (index) => {
    setDraggedOperatorIndex(index);
  };

  const handleOperatorDrop = (index) => {
    if (draggedOperatorIndex !== null) {
      const newOperators = [...operators];
      const [draggedOperator] = newOperators.splice(draggedOperatorIndex, 1);
      newOperators.splice(index, 0, draggedOperator);
      setOperators(newOperators);
      setDraggedOperatorIndex(null);
    }
  };

  return (
    <div>
      {showNameInput && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter Your Name</h2>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              placeholder="Your name" 
              className='input'
            />
            <button onClick={handleNameSubmit}>Submit</button>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select a Room</h2>
            <button onClick={() => handleRoomSelection('Room 1')}>Room 1</button>
            <button onClick={() => handleRoomSelection('Room 2')}>Room 2</button>
            <button onClick={() => handleRoomSelection('Room 3')}>Room 3</button>
          </div>
        </div>
      )}
      <h1>Hi <span id='greeting'>{userName}</span>,</h1>
      <h2>You&apos;re now connected to {selectedRoom}.</h2>
      <h2>Arrange Operators</h2>
      {numbers.length > 0 && (
        <div>
          <div>
            {numbers.map((number, index) => (
              <span
                key={index}
                disabled={isTimeUp}
                draggable
                onDragStart={() => handleNumberDragStart(index)}
                onDrop={() => handleNumberDrop(index)}
                onDragOver={(e) => e.preventDefault()}
                id = "span_num_ops"
              >
                {number}
              </span>
            ))}
            <div>
              {operators.map((op, index) => (
                <span
                  key={index}
                  disabled={isTimeUp}
                  draggable
                  onDragStart={() => handleOperatorDragStart(index)}
                  onDrop={() => handleOperatorDrop(index)}
                  onDragOver={(e) => e.preventDefault()}
                  id = "span_num_ops"
                >
                  {op}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>Target Result: {targetResult}</h3>
          </div>
          <button onClick={calculateResult} disabled={isTimeUp}>Calculate</button>
          {userResult !== null && (
            <div>
              <h3>Your Result: {userResult}</h3>
              {isCorrect !== null && (
                <h3>{isCorrect ? 'Correct!' : 'Incorrect, try again.'}</h3>
              )}
            </div>
          )}
          <div>
            <h3>Time Left: {timeLeft} seconds</h3>
            {isTimeUp && <h3>Time&apos;s up!</h3>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Multiplayertemp;
