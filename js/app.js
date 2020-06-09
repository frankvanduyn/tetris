document.addEventListener('DOMContentLoaded', () => {
  const grid = createGrid();
  //const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const lineDisplay = document.querySelector('#lines')
  const levelDisplay = document.querySelector('#level')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerID
  let score = 0
  let lines = 0
  let speed = 1000
  let level = 1
  let game = 0
  const colors = [
    '#ff7f27',
    '#ed1c24',
    '#a349a4',
    '#ffc90e',
    '#00a2e8',
    '#3f48cc',
    '#22b14c'
  ]

  function createGrid() {
    // the main grid
    let grid = document.querySelector(".grid")
    for (let i = 0; i < 200; i++) {
      let gridElement = document.createElement("div")
      grid.appendChild(gridElement)
    }

    // set base of grid
    for (let i = 0; i < 10; i++) {
      let gridElement = document.createElement("div")
      gridElement.setAttribute("class", "taken")
      grid.appendChild(gridElement)
    }

    let previousGrid = document.querySelector(".mini-grid")
    for (let i = 0; i < 12; i++) {
      let gridElement = document.createElement("div")
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }

  //The Tetrominoes
  const lTetromino = [
    [1, width + 2, width * 2 + 2, 2],
    [width * 2, width * 2 + 1, width + 2, width * 2 + 2],
    [0, width, width * 2 + 1, width * 2],
    [width, width * 2, width + 1, width + 2]
  ]

  const zTetromino = [
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const jTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const sTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, jTetromino, sTetromino]

  let currentPosition = 4
  let currentRotation = 0

  //Randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  //Draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
      squares[currentPosition + index].style.border = '1px solid white'
    })
  }

  //Undraw 
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
      squares[currentPosition + index].style.border = '1px solid white'
    })
  }

  //Assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if ((e.keyCode === 40) & (!current.some(index => squares[currentPosition + index + width].classList.contains('taken')))) {
      moveDown()
    }
  }
  document.addEventListener('keydown', control)

  //Move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //Freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      if (timerID) {
        clearInterval(timerID)
        timerID = null
      }
      setTimeout(freeze2, speed - 10);
      setSpeed()
    }
  }

  function freeze2() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //Start new Tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      currentRotation = 0
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      addScore()
      draw()
      displayShape()
      gameOver()
    }
  }

  //Move the Tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  //Move the Tetromino right, unless is the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  //Rotate the Tetromino
  function rotate() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    const isNearRightEdge = current.some(index => (currentPosition + index) % width === width - 2) /* For iTetronimo only */
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    currentRotation++
    //Correction when rotating at or near the edge
    if (isAtRightEdge) {
      if ((random === 0) & (currentRotation - 1 === 2)) currentPosition-- /* lTetromino */
      if ((random === 1) & (currentRotation - 1 === 0)) currentPosition-- /* zTetromino */
      if ((random === 1) & (currentRotation - 1 === 2)) currentPosition-- /* zTetromino */
      if ((random === 2) & (currentRotation - 1 === 3)) currentPosition-- /* tTetromino */
      if ((random === 4) & (currentRotation - 1 === 0)) currentPosition -= 2 /* iTetromino */
      if ((random === 4) & (currentRotation - 1 === 2)) currentPosition -= 2 /* iTetromino */
      if ((random === 5) & (currentRotation - 1 === 2)) currentPosition-- /* jTetromino */
      if ((random === 6) & (currentRotation - 1 === 0)) currentPosition-- /* sTetromino */
      if ((random === 6) & (currentRotation - 1 === 2)) currentPosition-- /* sTetromino */
    }
    if (isAtLeftEdge) {
      if ((random === 0) & (currentRotation - 1 === 0)) currentPosition++ /* lTetromino */
      if ((random === 2) & (currentRotation - 1 === 1)) currentPosition++ /* tTetromino */
      if ((random === 4) & (currentRotation - 1 === 0)) currentPosition++ /* iTetromino */
      if ((random === 4) & (currentRotation - 1 === 2)) currentPosition++ /* iTetromino */
      if ((random === 5) & (currentRotation - 1 === 0)) currentPosition++ /* jTetromino */
    }
    if (isNearRightEdge) {
      if ((random === 4) & (currentRotation - 1 === 0)) currentPosition-- /* iTetromino */
      if ((random === 4) & (currentRotation - 1 === 2)) currentPosition-- /* iTetromino */
    }
    //If rotation is 3, go back to 0
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  //Show up-next in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 3
  const displayIndex = 0

  //the Tetrominoes
  const upNextTetrominoes = [
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], /* lTetromino */
    [1, displayWidth, displayWidth + 1, displayWidth * 2], /* zTetromino */
    [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
    [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], /* iTetromino */
    [0, 1, displayWidth, displayWidth * 2], /* jTetromino */
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1] /* sTetromino */
  ]

  //Display the shape in the mini-grid display
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //Add functionality to the Button
  startBtn.addEventListener('click', () => {
    if (timerID) {
      clearInterval(timerID)
      timerID = null
    } else {
      if (game === 2) {
        resetGrid()
        game = 0
      }
      draw()
      setSpeed()
      if (game === 0) {
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
      }
      game = 1
    }
  })

  //Add score
  function addScore() {
    for (let i = 0; i <= 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        lines += 1
        scoreDisplay.innerHTML = score
        lineDisplay.innerHTML = lines
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
          squares[index].style.border = '1px solid white'
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
    levelUp()
  }

  //Level up every 20 lines, the speed will increase with 50 miliseconds (read: interval decreases)
  function levelUp() {
    if (Math.floor(lines / 20) != level - 1) {
      level++
      levelDisplay.innerHTML = level
    } 
  }

  //Set the interval starting from 1000 decreasing 50 for every level
  function setSpeed() {
    speed = 1000 - ((level - 1) * 50)
    timerID = setInterval(moveDown, speed)
  }

  //Gameover
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      // scoreDisplay.innerHTML = 'end'
      clearInterval(timerID)
      timerID = null
      game = 2
    }
  }

  //Reset Grid after Gameover
  function resetGrid() {
    score = 0
    scoreDisplay.innerHTML = score
    for (let i = 0; i <= 199; i++) {
      const divs = []
      divs.push(i)
      divs.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor = ''
        squares[index].style.border = '1px solid white'
      })
    }
  }
})