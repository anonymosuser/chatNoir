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

function handleTileClick(i, j) {
    console.log(i, j);
    moveCount++;

    if (moveCount % 2) {
        catPosition = { i, j };

        render();
        return;
    }

    activeTiles[i] = activeTiles[i] || [];
    activeTiles[i][j] = 1;
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

            renderHtml += `
                <div onclick="${clickHandler}" class="tile ${activeClass}" style="left: ${x}px; top: ${y}px;"></div>
            `;
        }
    }


    document.getElementById('main').innerHTML = renderHtml;

    needRerender = false;
};

render();
