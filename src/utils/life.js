export default function (cns, width, height) {
    const cnx = cns.getContext('2d')

    let column = height;
    let strik = width;

    cns.style.width = strik + "px";
    cns.style.height = column + "px";

    var scale = window.devicePixelRatio;

    cns.width = Math.floor(strik * scale);
    cns.height = Math.floor(column * scale);
    cnx.scale(scale, scale);

    const wisize = 15

    let col = Math.floor(height / wisize);
    let str = Math.floor(width / wisize);

    let com = []

    drawLife()
    function drawLife() {
        for (let i = 0; i < col; i++) {
            com[i] = [];
            for (let j = 0; j < str; j++) {
                if ((Math.round(Math.random() * 100) > 85)) {
                    com[i][j] = 1;
                } else {
                    com[i][j] = 0;
                }
            }
        }
    }


    function drawPoint() {
        cnx.clearRect(0, 0, strik, column)
        cnx.fillStyle = 'black'
        cnx.fillRect(0, 0, strik, column)
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < str; j++) {
                if (com[i][j] == 1) {
                    cnx.fillStyle = 'white';
                    cnx.fillRect(j * wisize, i * wisize, wisize, wisize)
                }
                if (com[i][j] == 0) {
                    cnx.fillStyle = 'yellow';
                    cnx.fillRect(j * wisize, i * wisize, wisize, wisize)
                }
            }
        }
    }



    function startDraw() {
        let mas = [];
        for (let i = 0; i < col; i++) {
            mas[i] = [];
            for (let j = 0; j < str; j++) {
                let neighboor = 0;
                if (com[fpm(i) - 1][j] == 1) neighboor++;
                if (com[i][fpp(j) + 1] == 1) neighboor++;
                if (com[spp(i) + 1][j] == 1) neighboor++;
                if (com[i][spm(j) - 1] == 1) neighboor++;
                if (com[fpm(i) - 1][fpp(j) + 1] == 1) neighboor++;
                if (com[spp(i) + 1][fpp(j) + 1] == 1) neighboor++;
                if (com[spp(i) + 1][spm(j) - 1] == 1) neighboor++;
                if (com[fpm(i) - 1][spm(j) - 1] == 1) neighboor++;

                if (com[i][j] == 1 && neighboor < 2) {
                    mas[i][j] = 0;
                }
                if (com[i][j] == 1 && (neighboor === 2 || neighboor === 3)) {
                    mas[i][j] = 1;
                }
                if (com[i][j] == 1 && neighboor > 3) {
                    mas[i][j] = 0;
                }
                if (!com[i][j] == 1 && neighboor === 3) {
                    mas[i][j] = 1;
                }
            }
        }
        com = mas;
        drawPoint()

        requestAnimationFrame(startDraw)
    }
    // setInterval(() => {
    //     startDraw()

    // }, 100)

    startDraw()

    function fpm(i) {
        if (i == 0) return col;
        else return i;
    }
    function spm(i) {
        if (i == 0) return str;
        else return i;
    }

    function fpp(i) {
        if (i == str - 1) return -1;
        else return i;
    }

    function spp(i) {
        if (i == col - 1) return -1;
        else return i;
    }

}