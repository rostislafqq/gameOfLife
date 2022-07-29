const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution; // гибкая ширина/высота
const ROWS = canvas.height / resolution; // гибкая ширина/высота

function buildGrid() {
  return new Array(COLS)
    .fill(null) // очень грубо говоря это резервация памяти рахмером столбцов (если оставить это будет 2д массив нулей )
    .map(() =>
      new Array(ROWS)
        .fill(null) // а вот теперь создается новый массив строкам (если оставить это будет 2д массив нулей )
        .map(() => Math.floor(Math.random() * 2)),
    ); // заполнение 0/1
}

let grid = buildGrid();
console.log(grid);

requestAnimationFrame(update); //вызов обновления кадров из функции

function update() {
  grid = nextGen(grid);
  render(grid);
  requestAnimationFrame(update);
}

function nextGen(grid) {
  const nextGen = grid.map((arr) => [...arr]); //след поколение = сетке карты. затем возвращается разброс массива . это даст точную копию нужного массива . и теперь возможно перебрать каждую ячейку сетки

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        // поиск соседей
        for (let j = -1; j < 2; j++) {
          // поиск соседей
          if (i === 0 && j === 0) {
            // поиск соседей (чтоб не считал сам себя)
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            // края
            const currentNeighbour = grid[col + i][row + j]; // счет соседей
            numNeighbours += currentNeighbour; // счет соседей
          }
        }
      }

      // правила
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0; // убиываем клетку в следующем поколении
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0; // убиываем клетку в следующем поколении
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1; // добавляем клетку
      }
    }
  }
  return nextGen;
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      let cell = grid[col][row];

      ctx.beginPath(); // отoбрaжение на холсте
      ctx.rect(col * resolution, row * resolution, resolution, resolution); // ну это просто позиции . х у width height
      ctx.fillStyle = cell ? '#33f3' : '#fff'; // true false
      ctx.fill();
      // ctx.stroke(); //(будет сетка)
    }
  }
}
