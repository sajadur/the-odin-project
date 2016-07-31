
var gridWidth = 30;
var gridHeight = 20;
var square = '<div class="square"></div>';
var squareClr = '<div class="square clear"></div>';
var container = $('.grid');
var squareClass = $('.square');


$(document).ready(function() {

  var snake = (function() {
    var direction = 'r';
    var parts = [[3,1], [2,1], [1,1]];
    var length = 3;
    var food;

    // move snake in current direction ev speed ms
    var run = setInterval(function() {move();}, 300);

    var init = function() {

      // draw initial snake
      for (var i = 0; i < length; i++) {
        var nthChild = pos(parts[i]);
        part = container.children().eq(nthChild);
        part.css("background-color", "red");
      }

      generateFood();

      $(document).keydown(function(e) {
        switch (e.which) {
          case 39:
            if (!overlap('r')) {
              direction = 'r';
            }
            break;

          case 40:
            if (!overlap('d')) {
              direction = 'd';
            }
            break;

          case 37:
            if (!overlap('l')) {
              direction = 'l';
            }
            break;

          case 38:
            if (!overlap('u')) {
              direction = 'u';
            }
            break;

          // case 32:
          //   clearInterval(snake.run); // stop loop
          //   break;

          default:
        }

      });

    };


    var generateFood = function() {
      var nthChild = Math.floor(Math.random() * gridWidth * gridHeight);

      foodDiv = container.children().eq(nthChild);
      foodDiv.css("background-color", "green");

      food = coord(nthChild + 1);
    };

    // Check if new head will overlap its second part
    // Prevent snake from going in the opposite direction
    var overlap = function(d) {
      if (length < 2)
        return false;

      // head = parts[0];
      var newHead = getNewHeadCoord(d);

      if (newHead[0] == parts[1][0] && newHead[1] == parts[1][1]) {
        return true;
      } else {
        return false;
      }
    };

    // TODO: fix new head not updated
    // Return new head coordinate based on the direction
    var getNewHeadCoord = function(d) {
      var oldHead = parts[0];
      var newHead = oldHead;

      switch (d) {
        case 'r':
          newHead = [oldHead[0]+1, oldHead[1]];
          break;

        case 'l':
          newHead = [oldHead[0]-1, oldHead[1]];
          break;

        case 'u':
          newHead = [oldHead[0], oldHead[1]-1];
          break;

        case 'd':
          newHead = [oldHead[0], oldHead[1]+1];
          break;
      }

      // debug
      // console.log(`oldhead: ${oldHead}`);
      // console.log(`newhead: ${newHead}`);

      return newHead;
    };


    // update parts of snake after one move
    var move = function() {
      var newHead = getNewHeadCoord(direction);
      // console.log('newhead:'+newHead[0]+','+newHead[1]);
      // console.log('parts:'+parts[0][0]+' '+parts[0][1]+','+parts[1][0]+' '+parts[1][1]+','+parts[2][0]+' '+parts[2][1]);

      // check if new head valid
      if (badMove(newHead)) {
        console.log('Game Over!');
        clearInterval(run); // stop loop
        return;
      }

      // update snake
      update(newHead);

    };

    // update snake
    var update = function(head) {
      var oldTail = parts[length-1];

      // add new head
      parts.unshift(head);
      dot = container.children().eq(pos(head));
      dot.css({
        'background-color': 'red',
      });

      if (eatFood(head)) {
        length++;
        generateFood();
      } else {
        // remove tail
        parts.pop();
        dot = container.children().eq(pos(oldTail));
        dot.css({
          'background-color': 'white',
        });
      }
    };

    // return true if eat food, else false
    var eatFood = function(newHead) {
      if (comparePart(newHead, food)) {
        return true;
      } else {
        return false;
      }
    };

    var badMove = function(head) {
      // out of grid
      if (head[0] > gridWidth || head[0] < 1 || head[1] > gridHeight || head[1] < 1) {
        return true;
      }

      // hit itself (5th part and beyond)
      if (findPart(head)) {
        return true;
      }

      return false;
    };

    // if found: return true
    // else return false
    var findPart = function(coord) {
      // can only hit 3rd and beyond
      for (var i = 3; i < length; i++) {
        if (comparePart(coord, parts[i])) {
          return true;
        }
      }

      return false;
    };

    // return true if same
    // else false
    var comparePart = function(coord1, coord2) {
      if (coord1[0] == coord2[0] && coord1[1] == coord2[1]) {
        return true;
      }

      return false;
    };


    // return position (starting from 0) of a coordinate
    var pos = function(coord) {
      return gridWidth * (coord[1] - 1) + coord[0] - 1;
    };

    // return coordinate of a position (starting from 1)
    var coord = function(pos) {
      // not at last column
      if (pos % gridWidth) {
        return [pos % gridWidth, Math.floor(pos / gridWidth) + 1];
      } else {
        return [gridWidth, Math.floor(pos / gridWidth)];
      }
    };

    return {
      init: init,
    };

  })();

  var grid = (function() {
    for (var i = 0; i < gridHeight; i++) {
      container.append(squareClr);

      for (var j = 1; j < gridWidth; j++) {
        container.append(square);
      }
    }

    snake.init();
  })();
});
