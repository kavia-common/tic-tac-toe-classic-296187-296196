import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * AppComponent provides a fully client-side, accessible Tic Tac Toe game.
 * It renders a 3x3 board, alternates X/O turns, detects wins/draws,
 * shows status updates, and allows restarting the game.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /** Title for the header */
  title = 'Tic Tac Toe';

  /** 3x3 board represented as a flat array of 9 cells; each cell is 'X' | 'O' | null */
  board: (null | 'X' | 'O')[] = Array(9).fill(null);

  /** Current player turn */
  currentPlayer: 'X' | 'O' = 'X';

  /** Winner symbol if any */
  winner: null | 'X' | 'O' = null;

  /** True if the game is a draw */
  draw = false;

  /**
   * PUBLIC_INTERFACE
   * Resets the game state to initial values.
   */
  reset(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.draw = false;
  }

  /**
   * PUBLIC_INTERFACE
   * Handles a move at the given board index if valid.
   * Prevents overwriting and ignores input when game is over.
   * @param index index of the cell in the 0-8 range
   */
  handleMove(index: number): void {
    if (this.board[index] || this.winner) return;
    this.board[index] = this.currentPlayer;
    this.updateGameState();
    if (!this.winner && !this.draw) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  /**
   * Computes winner or draw state after a move.
   */
  private updateGameState(): void {
    const win = this.calculateWinner(this.board);
    if (win) {
      this.winner = win;
      this.draw = false;
      return;
    }
    if (this.board.every(cell => cell !== null)) {
      this.draw = true;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Calculates the winner given a board state.
   * @param board The 9-cell board
   * @returns 'X' | 'O' | null
   */
  calculateWinner(board: (null | 'X' | 'O')[]): 'X' | 'O' | null {
    const lines = [
      // rows
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      // cols
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      // diagonals
      [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  /**
   * PUBLIC_INTERFACE
   * Returns the current status text for display.
   */
  get statusText(): string {
    if (this.winner) {
      return `${this.winner} wins!`;
    }
    if (this.draw) {
      return 'Draw game.';
    }
    return `Player ${this.currentPlayer}'s turn`;
  }

  /**
   * PUBLIC_INTERFACE
   * Accessible ARIA label for a given cell index.
   * Includes the current value and position.
   */
  cellAriaLabel(index: number): string {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const value = this.board[index] ?? 'Empty';
    return `Cell row ${row} column ${col}, ${value}`;
  }

  /**
   * PUBLIC_INTERFACE
   * Keyboard handler for cell selection: activates on Enter or Space.
   */
  onCellKeydown(event: globalThis.KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleMove(index);
    }
  }
}
