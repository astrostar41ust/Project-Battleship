import GameBoard from "./gameBoard.js";

class Player {
    constructor(name) {
      this.name = name;
      this.board = new GameBoard();
    }
  
    attack(opponent, coordinate) {
      return opponent.board.receiveAttack(coordinate);
    }
  
    generateRandomAttack(opponent) {
     
     
      while (true) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let randomCoordinate = [x, y];
  
        if (opponent.board.board[y][x] !== "x" && opponent.board.board[y][x] !== "m") {
          return randomCoordinate;
        } 
        
      }
    }
  }
  
export default Player
  