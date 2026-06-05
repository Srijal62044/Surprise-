// ===========================
// PHOTO PUZZLE GAME
// ===========================
(function() {
  const outer = document.getElementById('puzzle-outer');
  const IMG_SRC = 'p6.jpg';
  const GRID = 3;
  const TOTAL = GRID * GRID;
  let pieces = [];
  let selected = null;
  let solved = false;
  let moveCount = 0;

  outer.innerHTML = `
    <div class="puzzle-info" id="puzzle-info">Click two pieces to swap them. Moves: <span id="move-count">0</span></div>
    <div class="puzzle-board" id="puzzle-board" style="grid-template-columns:repeat(${GRID},1fr)"></div>
    <div class="puzzle-solved" id="puzzle-solved" style="display:none">
      Achievement Unlocked ❤️<br>
      <small style="font-family:var(--font-body);font-size:0.9rem;font-style:italic;color:var(--text-dim)">"Every piece eventually finds where it belongs."</small>
    </div>
    <button class="btn-primary" onclick="shufflePuzzle()" id="btn-shuffle" style="margin-top:10px">Shuffle Puzzle</button>
  `;

  const board = document.getElementById('puzzle-board');

  function buildPuzzle() {
    pieces = Array.from({ length: TOTAL }, (_, i) => i);
    solved = false;
    selected = null;
    moveCount = 0;
    updateMoveCount();
    document.getElementById('puzzle-solved').style.display = 'none';
    renderPuzzle();
  }

  window.shufflePuzzle = function() {
    pieces = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    solved = false;
    selected = null;
    moveCount = 0;
    updateMoveCount();
    document.getElementById('puzzle-solved').style.display = 'none';
    renderPuzzle();
  };

  function renderPuzzle() {
    board.innerHTML = '';
    pieces.forEach((correctIdx, pos) => {
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece' + (correctIdx === pos ? ' correct' : '');
      piece.dataset.pos = pos;
      piece.dataset.correct = correctIdx;

      const bx = (correctIdx % GRID) * (100 / (GRID - 1));
      const by = Math.floor(correctIdx / GRID) * (100 / (GRID - 1));
      piece.style.backgroundImage = `url(${IMG_SRC})`;
      piece.style.backgroundPosition = `${bx}% ${by}%`;
      piece.style.backgroundSize = `${GRID * 100}%`;

      piece.addEventListener('click', () => selectPiece(pos));
      board.appendChild(piece);
    });
    highlightSelected();
  }

  function selectPiece(pos) {
    if (solved) return;
    if (selected === null) {
      selected = pos;
      highlightSelected();
    } else {
      if (selected === pos) { selected = null; highlightSelected(); return; }
      // Swap
      const temp = pieces[selected];
      pieces[selected] = pieces[pos];
      pieces[pos] = temp;
      moveCount++;
      updateMoveCount();
      selected = null;
      renderPuzzle();
      checkSolved();
      if (navigator.vibrate) navigator.vibrate(30);
    }
  }

  function highlightSelected() {
    board.querySelectorAll('.puzzle-piece').forEach(p => {
      p.classList.toggle('selected', parseInt(p.dataset.pos) === selected);
    });
  }

  function checkSolved() {
    if (pieces.every((v, i) => v === i)) {
      solved = true;
      document.getElementById('puzzle-solved').style.display = 'block';
      document.getElementById('btn-shuffle').textContent = 'Play Again';
      launchConfetti();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
    }
  }

  function updateMoveCount() {
    const el = document.getElementById('move-count');
    if (el) el.textContent = moveCount;
  }

  // Initial build
  buildPuzzle();
  shufflePuzzle();
})();
