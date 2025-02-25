import random
import numpy as np


class Game:
    def __init__(self):
        self.board = [[0] * 4 for _ in range(4)]
        self.spawn_tile()
        self.spawn_tile()
        self.over = False
        self.score = 0

    def spawn_tile(self):
        empty_tiles = [
            (r, c) for r in range(4) for c in range(4) if self.board[r][c] == 0
        ]
        if empty_tiles:
            r, c = random.choice(empty_tiles)
            self.board[r][c] = 2 if random.random() < 0.9 else 4
            return True
        return False

    def game_over(self):
        return self.over

    def move(self, direction):
        original_board = [row[:] for row in self.board]  # Create a copy of the board

        # Implement logic to shift and merge tiles
        if direction == "up":
            self.move_up()
        elif direction == "down":
            self.move_down()
        elif direction == "left":
            self.move_left()
        elif direction == "right":
            self.move_right()

        # Only spawn a new tile if the board actually changed
        if self.board != original_board:
            if not self.spawn_tile():
                self.over = True  # Set game over if we can't spawn a new tile

        # Check if any moves are possible
        if not self.over:  # Only check if game isn't already over
            self.over = self.is_game_over()

        return self.board

    def move_up(self):
        for i in reversed(range(4)):
            for j in range(4):
                if self.board[i][j] != 0:
                    for k in reversed(range(0, i)):
                        if self.board[k][j] != 0:
                            if self.board[i][j] == self.board[k][j]:
                                self.board[k][j] = self.board[i][j] * 2
                                self.score += self.board[i][j] * 2
                                self.board[i][j] = 0
                        else:
                            self.board[k][j] = self.board[i][j]
                            self.board[i][j] = 0

    def move_down(self):
        for i in range(4):
            for j in range(4):
                if self.board[i][j] != 0:
                    for k in range(i + 1, 4):
                        if self.board[k][j] != 0:
                            if self.board[i][j] == self.board[k][j]:
                                self.board[k][j] = self.board[i][j] * 2
                                self.score += self.board[i][j] * 2
                                self.board[i][j] = 0
                        else:
                            self.board[k][j] = self.board[i][j]
                            self.board[i][j] = 0

    def move_right(self):
        for i in range(4):
            for j in range(3, -1, -1):  # Start from rightmost column
                if self.board[i][j] != 0:
                    for k in range(j + 1, 4):  # Check all positions to the right
                        if self.board[i][k] != 0:
                            if self.board[i][j] == self.board[i][k]:
                                self.board[i][k] = self.board[i][j] * 2
                                self.score += self.board[i][j] * 2
                                self.board[i][j] = 0
                                break  # Stop after merging
                        else:
                            self.board[i][k] = self.board[i][j]
                            self.board[i][j] = 0
                            break  # Stop after moving

    def move_left(self):
        for i in range(4):
            for j in range(1, 4):  # Start from second column
                if self.board[i][j] != 0:
                    for k in range(j):  # Check all positions to the left
                        if self.board[i][k] != 0:
                            if self.board[i][j] == self.board[i][k]:
                                self.board[i][k] = self.board[i][j] * 2
                                self.score += self.board[i][j] * 2
                                self.board[i][j] = 0
                                break  # Stop after merging
                        else:
                            self.board[i][k] = self.board[i][j]
                            self.board[i][j] = 0
                            break  # Stop after moving

    def get_board(self):
        return self.board

    def get_score(self):
        return self.score

    def is_game_over(self):
        # Check for empty cells
        if any(0 in row for row in self.board):
            return False

        # Check for possible merges in all directions
        for i in range(4):
            for j in range(4):
                # Check horizontal merges
                if j < 3 and self.board[i][j] == self.board[i][j + 1]:
                    return False
                # Check vertical merges
                if i < 3 and self.board[i][j] == self.board[i + 1][j]:
                    return False

        return True

    def copy(self):
        new_game = Game()
        new_game.board = [row[:] for row in self.board]
        new_game.over = self.over
        return new_game
