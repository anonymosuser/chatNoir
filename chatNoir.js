let catCaptured = false
// let numOfSartingSquars = 4+math.floor(6*(Math.random))
let tilesCount = 20;
let tileRadius = 40;
let tileMargin = 5;
let defaultActiveTilesCount = 20;
let catPosition = { i: Math.round(tilesCount / 2), j: Math.round(tilesCount / 2) };
let moveCount = 1;

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
let activeTiles = generateDefaultAcitveTiles();

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
    // // cats move
    // let moves = getMoves(catPosition);

    // moves = moves.filter(move => {
    //     // if this square is take - move is not possible
    //     let { i, j } = move;
    //     if ((activeTiles[i] && activeTiles[i][j]) || (catPath[i] && catPath[i][j])) {
    //         return false;
    //     }
    //     return true
    // });
    // moves.forEach(move => {
    //     catPath[move.i] = catPath[move.i] || [];
    //     catPath[move.i][move.j] = 1;
    // });

    function doit(moves, index) {
        let allMoves = [];
        moves.forEach(move => {
            let newMoves = getMoves(move);

            newMoves = newMoves.filter(move => {
                // if this square is take - move is not possible
                let { i, j } = move;
                if ((activeTiles[i] && activeTiles[i][j]) || (catPath[i] && catPath[i][j])) {
                    return false;
                }
                return true
            });

            newMoves.forEach(move => {
                let { i, j, prevPosition } = move;
                catPath[i] = catPath[i] || [];
                catPath[i][j] = { index, prevPosition };

                if (!done && (i === 0 || j === 0 || i === tilesCount - 1 || j === tilesCount - 1)) {
                    done = true;
                    let current  =prevPosition;
                    // nextCatsMove = ...;
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
    let foundPath = null;
    while (i < 44 && !done) {
        i++;
        m = doit(m, i)
    }
    // let m0 = [catPosition];
    // let m1 = doit(m0, 1);
    // let m2 = doit(m1, 2);
    // let m3 = doit(m2, 3);
    // let m4 = doit(m3, 4);
    // let m5 = doit(m4, 5);
    // let m6 = doit(m5, 6);








    // merge catPath and activeMoves

    return nextCatsMove;
}

// let catPath = generateCatPath();
let catMove = getCatMove();
console.log('catpos', catPosition);

function handleTileClick(i, j) {
    console.log(i, j);
    moveCount++;

    if (moveCount % 2) {
        catPosition = { i, j };
        
        catMove = getCatMove();
        render();
        return;
    }

    activeTiles[i] = activeTiles[i] || [];
    activeTiles[i][j] = 1;

    catMove = getCatMove();
    render();
}

// if (catCaptured) {
//     render();
// }

// if (catEcaped) {
//     render();
// }


/// TODO: cleanup
const render = () => {
    let renderHtml = ``;
    //add head
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

            if (!(moveCount % 2)) {
                // cats move
                let catI = catPosition.i;
                let catJ = catPosition.j;

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

                // if this tile is possible for cat to move - 
                let isMovePossible = false;
                for (let k = 0; k < moves.length; k++) {
                    if (i === moves[k].i && j === moves[k].j) {
                        isMovePossible = true;
                    }
                }

                if (!isMovePossible) {
                    clickHandler = ''
                } else {
                    activeClass += ' possible-move';
                }
            } else if (clickHandler) {
                activeClass += ' possible-move';
            }
            // let catPathIndex = '';
            // let catPathData = '';
            // if (catPath[i] && catPath[i][j]) {
            //     catPathIndex = catPath[i][j].index || catPath[i][j];
            //     catPathData = '';
            //     let current = catPath[i][j];

            //     while (current.prevPosition) {
            //         catPathData += `(${current.prevPosition.i}, ${current.prevPosition.j})`
            //         current = current.prevPosition;
            //     }
            // }
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

render();
