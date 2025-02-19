import numpy as np
import random
from game import Game

WEIGHT_MONOTONICITY = 2.0
WEIGHT_EMPTY_TILES = 3.0
WEIGHT_MERGE = 2.0
WEIGHT_CORNER = 1.0
MAX_DEPTH = 4


def evaluate_board(game: Game):
    return (
        WEIGHT_MONOTONICITY * monotonicity(game.board)
        + WEIGHT_EMPTY_TILES * empty_tiles(game.board)
        + WEIGHT_MERGE * merging_potential(game.board)
        + WEIGHT_CORNER * highest_tile_corner(game.board)
    )


def monotonicity(board):
    score = 0
    # Check rows
    for row in board:
        for i in range(3):
            if row[i] >= row[i + 1]:
                score += row[i]
    # Check columns
    board_array = np.array(board)  # Convert to numpy array for column operations
    for col in range(len(board)):
        column = board_array[:, col]
        for i in range(3):
            if column[i] >= column[i + 1]:
                score += column[i]
    return score


def empty_tiles(board):
    return np.sum(board == 0)


def merging_potential(board):
    score = 0
    for row in board:
        for i in range(3):
            if row[i] == row[i + 1]:
                score += row[i]
    return score


def highest_tile_corner(board):
    return max(board[0][0], board[0][3], board[3][0], board[3][3])


def get_possible_moves(game: Game):
    print(game.game_over())
    possible_moves = []
    for dir in ["left", "right", "up", "down"]:
        test_game = game.copy()
        test_game.move(dir)
        if not np.array_equal(game.board, test_game.board):
            possible_moves.append(dir)
    return possible_moves


def expectimax(game: Game, depth, is_maximizing_player):
    if depth == MAX_DEPTH or game.game_over():
        print(game.game_over())
        return evaluate_board(game)

    if is_maximizing_player:
        max_eval = float("-inf")
        for move in get_possible_moves(game):
            new_game = game.copy()
            new_game.move(move)
            eval = expectimax(new_game, depth + 1, False)
            max_eval = max(max_eval, eval)
        return max_eval
    else:
        empty_tiles = list(zip(*np.where(game.board == 0)))
        if not empty_tiles:
            return evaluate_board(game)

        score_sum = 0
        for r, c in empty_tiles:
            for tile in [2, 4]:
                new_game = game.copy()
                new_game.board[r, c] = tile
                prob = 0.9 if tile == 2 else 0.1
                score_sum += prob * expectimax(new_game, depth - 1, True)
        return score_sum / len(empty_tiles)


def get_best_move(game: Game):
    best_score = float("-inf")
    best_direction = None
    for move_direction in get_possible_moves(game):
        new_game = game.copy()
        new_game.move(move_direction)
        score = expectimax(new_game, MAX_DEPTH, False)
        if score > best_score:
            best_score, best_direction = score, move_direction
    return best_direction
