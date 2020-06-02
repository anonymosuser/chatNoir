let tilesCount = 20;
let tileRadius = 40;
let tileMargin = 5;
let defaultActiveTilesCount = 20;
let catPosition;
let activeTiles;

function generateDefaultAcitveTiles() {
    let activeTiles = [];
    for (let k = 0; k < defaultActiveTilesCount; k++) {
        let i = Math.round(Math.random() * tilesCount)
        let j = Math.round(Math.random() * tilesCount)
        activeTiles[i] = activeTiles[i] || [];
        activeTiles[i][j] = 1;
    }

    if (activeTiles[catPosition.i] && activeTiles[catPosition.i][catPosition.j]) {
        activeTiles[catPosition.i][catPosition.j] = 0;
    }

    return activeTiles;
}

function getMoves(prevPosition) {
    let catI = prevPosition.i;
    let catJ = prevPosition.j;

    let moves = [
        { i: catI + 1, j: catJ },
        { i: catI - 1, j: catJ },
        { i: catI, j: catJ + 1 },
        { i: catI, j: catJ - 1 }
    ]
    if (catJ % 2) {
        moves.push({ i: catI - 1, j: catJ - 1 })
        moves.push({ i: catI - 1, j: catJ + 1 })
    } else {
        moves.push({ i: catI + 1, j: catJ - 1 })
        moves.push({ i: catI + 1, j: catJ + 1 })
    }

    return moves.map(move => ({ ...move, prevPosition }));
}

function getCatMove() {
    let catPath = [];
    catPath[catPosition.i] = [];
    catPath[catPosition.i][catPosition.j] = '0';

    function doit(moves, index) {
        let allMoves = [];
        moves.forEach(move => {
            let newMoves = getMoves(move);

            newMoves = newMoves.filter(move => {
                let { i, j } = move;
                if ((activeTiles[i] && activeTiles[i][j]) || (catPath[i] && catPath[i][j])) {
                    return false;
                }
                return true
            });

            if (index === 1) {
                if (newMoves.length) {
                    nextCatsMove = newMoves[0];
                } else {
                    done = true;
                    nextCatsMove = move;

                    setTimeout(() => {
                        alert('You Won!');
                        init();
                        render();
                    }, 100);
                    return;
                }
            }

            newMoves.forEach(move => {
                let { i, j, prevPosition } = move;
                catPath[i] = catPath[i] || [];
                catPath[i][j] = { index, prevPosition };

                if (!done && (i === 0 || j === 0 || i === tilesCount - 1 || j === tilesCount - 1)) {
                    done = true;
                    let current = move;

                    while (current.prevPosition) {
                        current = current.prevPosition;
                        if (current.prevPosition) {
                            nextCatsMove = current;
                        }
                    }
                }
            });

            allMoves = [...allMoves, ...newMoves];
        })

        return allMoves;
    }

    let nextCatsMove;
    let i = 0;
    let m = [catPosition];
    let done = false;

    while (i < 44 && !done) {
        i++;
        m = doit(m, i)
    }
    if (nextCatsMove) {
        let { i, j } = nextCatsMove;
        if ((i === 0 || j === 0 || i === tilesCount - 1 || j === tilesCount - 1)) {
            setTimeout(() => {
                alert('You lost...');
                init();
                render();
            }, 100);
        }
    }

    return nextCatsMove;
}

// let catPath = generateCatPath();
let catMove = getCatMove();
console.log('catpos', catPosition);

function handleTileClick(i, j) {
    activeTiles[i] = activeTiles[i] || [];
    activeTiles[i][j] = 1;

    catMove = getCatMove();
    if (!catMove) {
        debugger;
        catMove = getCatMove();
    }
    catPosition = { i: catMove.i, j: catMove.j };
    render();
}


const render = () => {
    let renderHtml = ``;

    for (let i = 0; i < tilesCount; i++) {
        for (let j = 0; j < tilesCount; j++) {
            let x = i * (tileRadius + tileMargin) + ((j % 2) ? 0 : (tileRadius + tileMargin) / 2);
            let y = j * (tileRadius);
            let activeClass = '';
            let clickHandler = `handleTileClick(${i},${j})`;

            if (catPosition.i === i && catPosition.j === j) {
                activeClass = 'cat';
            }

            if (activeTiles[i] && activeTiles[i][j]) {
                activeClass = 'active';
                clickHandler = '';
            }

            if (clickHandler) {
                activeClass += ' possible-move';
            }

            let isNextMoveClass = '';
            if (catMove.i === i && catMove.j === j) {
                isNextMoveClass = 'tile-next-move';
            }
            renderHtml += `
                <div onclick="${clickHandler}" class="tile ${activeClass} ${isNextMoveClass}" style="left: ${x}px; top: ${y}px;"></div>
            `;
        }
    }


    document.getElementById('main').innerHTML = renderHtml;

    needRerender = false;
};

function init() {
    catPosition = { i: Math.round(tilesCount / 2), j: Math.round(tilesCount / 2) };
    activeTiles = generateDefaultAcitveTiles();
}

init();
render();
