class Vertice {
    constructor(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.neighbors = [];
    };
    
    addNeighbour(neighbour) {
        if (!this.neighbors.includes(neighbour)) {
            this.neighbors.push(neighbour);
            this.neighbors.sort((a, b) => a - b);
        }
    }
}