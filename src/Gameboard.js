import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./GameBoard.css";

const GameBoard = () => {
    const [board, setBoard] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const gameOverRef = useRef(false);

    useEffect(() => {
        axios
            .get("https://gwilson011.pythonanywhere.com/start")
            .then((response) => {
                setBoard(response.data.board);
            });

        // Add keyboard event listener
        const handleKeyPress = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    handleMove("left");
                    break;
                case "ArrowRight":
                    handleMove("right");
                    break;
                case "ArrowUp":
                    handleMove("up");
                    break;
                case "ArrowDown":
                    handleMove("down");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []); // Empty dependency array

    const handleMove = (direction) => {
        axios
            .post("https://gwilson011.pythonanywhere.com/move", { direction })
            .then((response) => {
                setBoard(response.data.board);
                if (response.data.gameOver) {
                    setGameOver(true);
                    gameOverRef.current = true;
                }
                setScore(response.data.score);
                console.log(response.data.score);
            });
    };

    const getAIMove = async () => {
        const makeMove = async () => {
            if (gameOverRef.current) return;
            try {
                const response = await axios.get(
                    "https://gwilson011.pythonanywhere.com/ai_move"
                );
                if (response.data.move) {
                    handleMove(response.data.move);
                }
                // Schedule the next move after this one completes
                setTimeout(makeMove, 100);
            } catch (error) {
                console.error("Error getting AI move:", error);
                // Even if there's an error, try again after delay
                setTimeout(makeMove, 100);
            }
        };

        // Start the first move
        makeMove();
    };

    const getTileColor = (num) => {
        switch (num) {
            case 2:
                return "#eee3d9";
            case 4:
                return "#eddfc9";
            case 8:
                return "#f2b179";
            case 16:
                return "#f59563";
            case 32:
                return "#f57c5e";
            case 64:
                return "#f65d3b";
            case 128:
                return "#eece73";
            case 256:
                return "#eecc62";
            case 512:
                return "#edc851";
            case 1024:
                return "#edc851";
            case 2048:
                return "#eec22f";
            default:
                return "#ccc";
        }
    };

    return (
        <div className="game-container">
            <div className="board-section">
                <h1 className="title">2048</h1>
                <div className="grid">
                    {board.flat().map((num, i) => (
                        <div
                            key={i}
                            className="tile"
                            style={{ background: getTileColor(num) }}
                        >
                            {num || ""}
                        </div>
                    ))}
                </div>
            </div>
            <div className="sidebar">
                <div className="score-box">
                    <span className="score-label">SCORE</span>
                    <span className="score-value">{score}</span>
                </div>
                {gameOver && <div className="game-over">Game Over</div>}
                <button onClick={getAIMove} className="solve-button">
                    SOLVE
                </button>
            </div>
        </div>
    );
};

export default GameBoard;
