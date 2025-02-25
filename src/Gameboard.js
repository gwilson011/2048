import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./GameBoard.css";

const GameBoard = () => {
    const [board, setBoard] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const gameOverRef = useRef(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/start").then((response) => {
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
            .post("http://127.0.0.1:5000/move", { direction })
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
                    "http://127.0.0.1:5000/ai_move"
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

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <h1 style={{ fontFamily: "Tango", fontSize: "80px" }}>2048</h1>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 100px)",
                        gap: "10px",
                        paddingRight: "30px",
                        fontFamily: "Tango",
                    }}
                >
                    {board.flat().map((num, i) => (
                        <div
                            key={i}
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "8px",
                                background:
                                    num === 2
                                        ? "#eee3d9"
                                        : num === 4
                                        ? "#eddfc9"
                                        : num === 8
                                        ? "#f2b179"
                                        : num === 16
                                        ? "#f59563"
                                        : num === 32
                                        ? "#f57c5e"
                                        : num === 64
                                        ? "#f65d3b"
                                        : num === 128
                                        ? "#eece73"
                                        : num === 256
                                        ? "#eecc62"
                                        : num === 512
                                        ? "#edc851"
                                        : num === 1024
                                        ? "#edc851"
                                        : num === 2048
                                        ? "#eec22f"
                                        : "#ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "30px",
                            }}
                        >
                            {num || ""}
                        </div>
                    ))}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    justifyContent: "center",
                    height: "100vh",
                    minWidth: "200px",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        border: "3pt solid black",
                        borderRadius: "8px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <span style={{ fontFamily: "Pixeled", fontSize: "10px" }}>
                        SCORE
                    </span>
                    <span style={{ fontFamily: "Tango", fontSize: "30px" }}>
                        {score}
                    </span>
                </div>
                {gameOver && (
                    <div style={{ fontFamily: "Louis", color: "red" }}>
                        Game Over
                    </div>
                )}
                <button onClick={() => getAIMove()} className="solve-button">
                    SOLVE
                </button>
            </div>
        </div>
    );
};

export default GameBoard;
