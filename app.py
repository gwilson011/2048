from flask import Flask, jsonify, request  # type: ignore
from flask_cors import CORS

from game import Game  # type: ignore

app = Flask(__name__)
CORS(app)

# Placeholder for game state
game = None


@app.route("/start", methods=["GET"])
def start_game():
    global game
    game = Game()

    return jsonify({"board": game.get_board()})


@app.route("/move", methods=["POST"])
def move():
    data = request.json
    direction = data.get("direction")  # 'up', 'down', 'left', 'right'
    game.move(direction)
    return jsonify({"board": game.get_board(), "gameOver": game.game_over()})


@app.route("/ai_move", methods=["GET"])
def ai_move():
    # Import your AI functions
    from ai import get_best_move

    best_direction = get_best_move(game)

    return jsonify({"move": best_direction})


if __name__ == "__main__":
    app.run(debug=True)
