import { useEffect, useState } from "react";

const BOARD_SIZE = 20;

function createFood(snake) {
  let food;

  do {
    food = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (
    snake.some(
      (part) => part.x === food.x && part.y === food.y
    )
  );

  return food;
}

function App() {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);

  const [food, setFood] = useState({
    x: 15,
    y: 10,
  });

  const [direction, setDirection] = useState("RIGHT");
  const [nextDirection, setNextDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  function startGame() {
    const newSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];

    setSnake(newSnake);
    setFood(createFood(newSnake));
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key;

      if (key === "ArrowUp" && direction !== "DOWN") {
        setNextDirection("UP");
      }

      if (key === "ArrowDown" && direction !== "UP") {
        setNextDirection("DOWN");
      }

      if (key === "ArrowLeft" && direction !== "RIGHT") {
        setNextDirection("LEFT");
      }

      if (key === "ArrowRight" && direction !== "LEFT") {
        setNextDirection("RIGHT");
      }

      if (key === "Enter" && !playing) {
        startGame();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, playing]);

  useEffect(() => {
    if (!playing) return;

    const game = setInterval(() => {
      setSnake((currentSnake) => {
        const newDirection = nextDirection;
        setDirection(newDirection);

        const head = currentSnake[0];

        let newHead = {
          x: head.x,
          y: head.y,
        };

        if (newDirection === "UP") {
          newHead.y -= 1;
        }

        if (newDirection === "DOWN") {
          newHead.y += 1;
        }

        if (newDirection === "LEFT") {
          newHead.x -= 1;
        }

        if (newDirection === "RIGHT") {
          newHead.x += 1;
        }

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE
        ) {
          setPlaying(false);
          setGameOver(true);
          return currentSnake;
        }

        // Snake collision
        if (
          currentSnake.some(
            (part) =>
              part.x === newHead.x &&
              part.y === newHead.y
          )
        ) {
          setPlaying(false);
          setGameOver(true);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Food eaten
        if (
          newHead.x === food.x &&
          newHead.y === food.y
        ) {
          setScore((oldScore) => oldScore + 10);
          setFood(createFood(newSnake));

          return newSnake;
        }

        newSnake.pop();

        return newSnake;
      });
    }, 150);

    return () => clearInterval(game);
  }, [playing, nextDirection, food]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          🐍 Snake Game
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "20px",
            fontSize: "20px",
          }}
        >
          <div>
            Score: <strong>{score}</strong>
          </div>

          <div>
            Best: <strong>0</strong>
          </div>
        </div>

        <div
          style={{
            width: "400px",
            height: "400px",
            background: "#1f2937",
            border: "5px solid #374151",
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
            margin: "auto",
          }}
        >
          {Array.from({
            length: BOARD_SIZE * BOARD_SIZE,
          }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);

            const isSnake = snake.some(
              (part) =>
                part.x === x && part.y === y
            );

            const isHead =
              snake[0]?.x === x &&
              snake[0]?.y === y;

            const isFood =
              food.x === x &&
              food.y === y;

            return (
              <div
                key={index}
                style={{
                  width: "100%",
                  height: "100%",
                  background: isHead
                    ? "#22c55e"
                    : isSnake
                    ? "#4ade80"
                    : isFood
                    ? "#ef4444"
                    : "transparent",
                  borderRadius:
                    isHead || isSnake || isFood
                      ? "3px"
                      : "0",
                }}
              />
            );
          })}
        </div>

        {!playing && !gameOver && (
          <button
            onClick={startGame}
            style={{
              marginTop: "25px",
              padding: "14px 35px",
              fontSize: "20px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
            }}
          >
            ▶ START GAME
          </button>
        )}

        {gameOver && (
          <div style={{ marginTop: "20px" }}>
            <h2>💀 Game Over!</h2>

            <p style={{ fontSize: "20px" }}>
              Your Score: <strong>{score}</strong>
            </p>

            <button
              onClick={startGame}
              style={{
                padding: "14px 35px",
                fontSize: "18px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "10px",
                background: "#22c55e",
                color: "white",
                cursor: "pointer",
              }}
            >
              🔄 PLAY AGAIN
            </button>
          </div>
        )}

        <p
          style={{
            marginTop: "20px",
            color: "#9ca3af",
          }}
        >
          Use ↑ ↓ ← → arrow keys to control the snake
        </p>
      </div>
    </div>
  );
}

export default App;