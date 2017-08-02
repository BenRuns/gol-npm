(function () {

    var sortFunction = function (a, b) {
        if (a[0] === b[0]) {
            if (a[1] === b[1]) {
                return 0;
            }

            return (a[1] < b[1]) ? -1 : 1;
        }

        return (a[0] < b[0]) ? -1 : 1;
    };


    var binary_contains = function (point, array) {

        if (array.length === 0) {
            return false;
        }
        var middle = array[Math.floor(array.length / 2)];

        if (point[0] === middle[0] && point[1] === middle[1]) {
            return true;
        }

        if (array.length > 1) {
            if (sortFunction(point, middle) === -1) {
                return binary_contains(point, array.slice(0, Math.floor(array.length / 2)));
            }
            return binary_contains(point, array.slice(Math.floor(array.length / 2)));
        }

        return false;

    };

    var track_iteration = function (iteration) {
        var iteration_div = document.getElementById("iteration");
        iteration_div.innerHTML =  iteration + " iterations";
    };


    var contains_point = function (point, array) {
        return binary_contains(point, array);
    };



    var plot_point = function (array) {

        array = array === undefined ? [[]] : array;
        var grid = document.getElementById("test_id").children[0];
        var population_div = document.getElementById("population");
        population_div.innerHTML = (array.length + " cells");

        var points = "";
        var i, point, x_point, y_point;
        for (i = 0; i < array.length; i += 1) {
            if (i > 0) {
                points  += ", ";
            }
            point = array[i];

            x_point =  point['0'] * 5 + 'px';
            y_point =  point['1'] * 5 + 'px';
            points += (x_point + " " + y_point + " black");
        }
        grid.style.boxShadow = points;

    };


    var neighbors = function (x, y) {

        return [[(x + 1), y],
               [(x - 1), y],
               [(x + 1), (y + 1)],
               [(x - 1), (y - 1)],
               [(x + 1), (y - 1)],
               [(x - 1), (y + 1)],
               [x, (y + 1)],
               [x, (y - 1)]];
    };


    var neighbors_count = function (x, y, cells) {
        //takes a sorted array
        var counter = 0;
        var to_check = neighbors(x, y);
        var i;

        for (i = 0; i < to_check.length; i += 1) {
            if (contains_point(to_check[i], cells)) {
                counter += 1;
            }
        }

        return counter;
    };



    var next_state = function (cells) {

        var next_states = [];
        var checked = {};
        var point, count, xy, i, neighbor, cell_count;

        for (point = 0; point < cells.length; point += 1) {
            count = checked.hasOwnProperty(cells[point]) ? checked[cells[point]][0] : neighbors_count(cells[point][0], cells[point][1], cells);
            if (!checked.hasOwnProperty(cells[point])) {
                checked[cells[point]] = [count,0];
            }

            if ((count === 2 || count === 3) && (checked[cells[point]][1] === 0) ){

                next_states.push(cells[point]);
                checked[cells[point]][1] = 1;
            }

            neighbor = neighbors(cells[point][0], cells[point][1]);

            for (i = 0; i < neighbor.length ; i += 1) {
                xy = neighbor[i];
                if (!checked.hasOwnProperty(xy)) {
                    checked[xy] = [neighbors_count(xy[0], xy[1], cells),0];

                    cell_count = checked[xy][0];

                    if (cell_count === 3) {
                        next_states.push(xy); 
                        checked[xy][1] = 1;  
                    }
                }
            }

        }
        return next_states.sort(sortFunction);
    };



    
    var intID;
    

    var run_sim = function () {
        clear_sim();
        var next = add_points(document.getElementById("cells").value);
        var x = 0;
        track_iteration(x);



        intID = setInterval(function () {
            x = x + 1;
            plot_point(next);
            next = next_state(next);
            track_iteration(x);
            }, 300);

    };

    var stop_sim = function () {
        clearInterval(intID);

    };


    var clear_sim = function () {
        stop_sim();
        plot_point([]);
        track_iteration(0);
    };



    var add_points = function (value) {
        var points = [];
        var added_cells = document.getElementById("cells").value;
        var grid_size = 70;
        var i, x, y;

        for (i = 0; i < added_cells; i += 1) {
            x = Math.floor(Math.random() * (grid_size - 1)) + 1;
            y = Math.floor(Math.random() * (grid_size - 1)) + 1;
            points.push([x, y]);
        }
        return points.sort(sortFunction)
    };
    


    

    document.getElementById('start').onclick = run_sim;
    document.getElementById("stop").onclick = stop_sim;
    document.getElementById("clear").onclick = clear_sim;

    document.getElementById("add_cells").onclick = add_points;
})()

//tests for next states
//tests for sort function

// xox
// xox
// xox
//(1,0),(1,1),(1,2)

//console.log("first test" ,next_state([[1,0],[1,1],[1,2]]) == [[0,1],[1,1],[2,1]] )

// should return
// xxx
// ooo
// xxx

//(0,1),(1,1),(2,1)

// xxx
// xox
// xox
//[[1,0],[1,1]]

// should return []
// xxx
// xxx
// xxx

// []

// xxxxx
// xoxox
// xoxox
// xoxox

// next_state([[1,0],[1,1],[1,2],[3,0],[3,1],[3,2]])
// should return  [[0,1],[1,1],[3,1],[4,1]]

// xxxxx
// xxxxx
// ooxoo
// xxxxx


