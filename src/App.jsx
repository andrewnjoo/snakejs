import React, { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const SPEED = 200;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[newSnake.length - 1] };

    if (direction === 'UP') head.y -= 1;
    else if (direction === 'DOWN') head.y += 1;
    else if (direction === 'LEFT') head.x -= 1;
    else if (direction === 'RIGHT') head.x += 1;

    newSnake.push(head);

    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.shift();
    }

    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      newSnake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveSnake, SPEED);
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameOver]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      {gameOver ? (
        <div className="text-white text-center">
          <h1 className="text-4xl mb-4">Game Over</h1>
          <button
            onClick={() => {
              setSnake([{ x: 10, y: 10 }]);
              setFood({ x: 5, y: 5 });
              setDirection('RIGHT');
              setGameOver(false);
            }}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Restart
          </button>
        </div>
      ) : (
        <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >      
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`w-5 h-5 ${
                  isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-300'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
