// Chicken Puzzle Game
class ChickenPuzzle {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.grid = [];
        this.gridSize = 4;
        this.init();
    }

    init() {
        this.createGrid();
        this.render();
    }

    createGrid() {
        this.grid = [];
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            this.grid.push(Math.floor(Math.random() * 3));
        }
    }

    checkMatch(index) {
        const row = Math.floor(index / this.gridSize);
        const col = index % this.gridSize;
        let matches = 0;

        // Check horizontal
        if (this.grid[index] === this.grid[index - 1] && 
                this.grid[index] === this.grid[index + 1]) {
            matches++;
        }

        // Check vertical
        if (this.grid[index] === this.grid[index - this.gridSize] && 
                this.grid[index] === this.grid[index + this.gridSize]) {
            matches++;
        }

        return matches > 0;
    }

    click(index) {
        if (this.checkMatch(index)) {
            this.score += 10;
            this.grid[index] = -1;
            this.render();
        }
    }

    render() {
        console.log(`Level: ${this.level} | Score: ${this.score}`);
        console.log(this.grid);
    }
}

// Start game
const game = new ChickenPuzzle();