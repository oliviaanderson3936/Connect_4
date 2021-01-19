import Component from '@ember/component';


export default Component.extend({

  //There are 3 variables needed before the game starts
  //playing - as default it is set as false, this changes when player clicks start
  //winner - set as undefined and only changes when someone wins the game
  //draw - as default it is set as false, this is because the game has not been completed
  playing: false,
  winner: undefined,
  draw: false,

  didInsertElement: function() {
    //The stage is what appears on the screen when the application is started
    var stage = new createjs.Stage(this.$('#stage')[0]);

    // Draw the game board using variables for board and graphics
    var board = new createjs.Shape();
    var graphics = board.graphics;
    graphics.beginFill('#ffffff');
    // Draw horizontal and vertical grids 
    graphics.drawRect(0, 49, 350, 2);
    graphics.drawRect(0, 99, 350, 2);
    graphics.drawRect(0, 149, 350, 2);
    graphics.drawRect(0, 199, 350, 2);
    graphics.drawRect(0, 249, 350, 2);
    graphics.drawRect(49, 0, 2, 300);
    graphics.drawRect(99, 0, 2, 300);
    graphics.drawRect(149, 0, 2, 300);
    graphics.drawRect(199, 0, 2, 300);
    graphics.drawRect(249, 0, 2, 300);
    graphics.drawRect(299, 0, 2, 300);
    //This puts space outside the grid to make it look in the centre
    board.x = 35;
    board.y = 35;
    //board alpha 0 makes the game board invisible when the application loads...
    //becomes visible when game starts
    board.alpha = 0;
    this.set('board', board);
    //this adds the game board/grids to the stage
    stage.addChild(board);
    
    //Create Markers
    //create varibales for markers (red and yellow)
    var markers = {
      'red': [],
      'yellow': []
    }
    //the board can fill 42 counters, so each counter can only appear 21 times
    for (var x = 0; x < 21; x++) {
      //Creating red marker with variable redMarker
      var redMarker = new createjs.Shape();
      graphics = redMarker.graphics;
      graphics.beginFill('#FF0000');
      graphics.setStrokeStyle(10);
      graphics.drawCircle(0, 0, 20); //draws circle with radius of 20
      redMarker.visible = false; //as default marker is not visible until game is started by player
      //this adds the red counter to the stage
      stage.addChild(redMarker);
      markers.red.push(redMarker);

      //Creating yellow marker with variable yellowMarker
      var yellowMarker = new createjs.Shape();
      graphics = yellowMarker.graphics;
      graphics.beginFill('#FFFF00');
      graphics.setStrokeStyle(10);
      graphics.drawCircle(0, 0, 20); //draws circle with radius of 20
      yellowMarker.visible = false; //as default marker is not visible until game is started by player
      //this adds the yellow counter to the stage
      stage.addChild(yellowMarker);
      markers.yellow.push(yellowMarker);
    }

    this.set('markers', markers);
    this.set('stage', stage);

    //updating the stage
    createjs.Ticker.addEventListener("tick", stage);
  },

  //This is the click event, it runs whenever there is a click
  click: function(ev) {
    if(this.get('playing') && !this.get('winner')) {
      //This is the area, which is the grid, the players are able to click but only if clicked within the parameters of the board
      if(ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >= 35 && ev.offsetY >= 35 && ev.offsetX < 380 && ev.offsetY < 335) {
        //board rendered 35 pixels across, this has to be taken away. divide the 35 by 50 (height) to get value
        var x = Math.floor((ev.offsetX - 35) / 50);
        //board rendered 35 pixels down, this has to be taken away. divide the 35 by 50 (height) to get value
        var y = Math.floor((ev.offsetY - 35) / 50);
        var state = this.get('state');
        
        //This enables the player to click on a counter, which is already place, and a counter will be placed at the top of the stack of counters
        while (state[x][y] == 'red' || state[x][y] =='yellow') {
          y = y - 1;
        }
        
        if(!state[x][y]) {
          var player = this.get('player')
          state[x][y] = player;
          var move_count = this.get('moves')[player];
          var marker = this.get('markers')[player][move_count];
          marker.visible = true; //makes marker visible when added
          //This calculation makes the counters fit inside the squares in the grid
          if (player == 'red') {
            marker.x = 60 + x * 50;
            marker.y = 60 + y * 50;
          } else {
            marker.x = 60 + x * 50;
            marker.y = 60 + y * 50;
          }
          this.check_winner();
          
          //This allows for the yellow counter to appear after red and it will loop
          this.get('moves')[player] = move_count + 1;
          //alternate which players turn it is
          if (player == 'red') {
            this.set('player', 'yellow');
          } else {
            this.set('player', 'red');
          }
          //This will use the plug-in to display the message to say who goes next on the mobile app
          if(!this.get('winner') && window.plugins && window.plugins.toast) {
            window.plugins.toast.showShortBottom(this.get('player').toUpperCase() + ' to Play Next');
          }
        }
      }
    }
  },

  check_winner: function() {
    //these are co-ordinates of winning patterns.
    var patterns = [
      //diagonal winning pattern
      [[0, 2], [1, 3], [2, 4], [3, 5]],
      [[0, 1], [1, 2], [2, 3], [3, 4]],
      [[1, 2], [2, 3], [3, 4], [4, 5]],
      [[0, 0], [1, 1], [2, 2], [3, 3]],
      [[1, 1], [2, 2], [3, 3], [4, 4]],
      [[2, 2], [3, 3], [4, 4], [5, 5]],
      [[0, 1], [2, 1], [3, 2], [4, 3]],
      [[2, 1], [3, 2], [4, 3], [5, 4]],
      [[3, 2], [4, 3], [5, 4], [6, 5]],
      [[2, 0], [3, 1], [4, 2], [5, 3]],
      [[3, 1], [4, 2], [5, 3], [6, 4]],
      [[3, 0], [4, 1], [5, 2], [6, 3]],
      [[0, 3], [1, 2], [2, 1], [3, 0]],
      [[4, 0], [3, 1], [2, 2], [1, 3]],
      [[0, 4], [1, 3], [2, 2], [3, 1]],
      [[5, 0], [4, 1], [3, 2], [2, 3]],
      [[4, 1], [3, 2], [2, 3], [1, 4]],
      [[0, 5], [1, 4], [2, 3], [3, 2]],
      [[1, 5], [2, 4], [3, 3], [4, 2]],
      [[2, 4], [3, 3], [4, 2], [5, 1]],
      [[3, 3], [4, 2], [5, 1], [6, 0]],
      [[2, 5], [3, 4], [4, 3], [5, 2]],
      [[3, 4], [4, 3], [5, 2], [6, 1]],
      [[3, 5], [4, 4], [5, 3], [6, 2]],
      //horizontal winning patterns
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[1, 0], [2, 0], [3, 0], [4, 0]],
      [[2, 0], [3, 0], [4, 0], [5, 0]],
      [[3, 0], [4, 0], [5, 0], [6, 0]],
      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[1, 1], [2, 1], [3, 1], [4, 1]],
      [[2, 1], [3, 1], [4, 1], [5, 1]],
      [[3, 1], [4, 1], [5, 1], [6, 1]],
      [[0, 2], [1, 2], [2, 2], [3, 2]],
      [[1, 2], [2, 2], [3, 2], [4, 2]],
      [[2, 2], [3, 2], [4, 2], [5, 2]],
      [[3, 2], [4, 2], [5, 2], [6, 2]],
      [[0, 3], [1, 3], [2, 3], [3, 3]],
      [[1, 3], [2, 3], [3, 3], [4, 3]],
      [[2, 3], [3, 3], [4, 3], [5, 3]],
      [[3, 3], [4, 3], [5, 3], [6, 3]],
      [[0, 4], [1, 4], [2, 4], [3, 4]],
      [[1, 4], [2, 4], [3, 4], [4, 4]],
      [[2, 4], [3, 4], [4, 4], [5, 4]],
      [[3, 4], [4, 4], [5, 4], [6, 4]],
      [[0, 5], [1, 5], [2, 5], [3, 5]],
      [[1, 5], [2, 5], [3, 5], [4, 5]],
      [[2, 5], [3, 5], [4, 5], [5, 5]],
      [[3, 5], [4, 5], [5, 5], [6, 5]],
      //vertical winning patterns
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 1], [0, 2], [0, 3], [0, 4]],
      [[0, 2], [0, 3], [0, 4], [0, 5]],
      [[1, 0], [1, 1], [1, 2], [1, 3]],
      [[1, 1], [1, 2], [1, 3], [1, 4]],
      [[1, 2], [1, 3], [1, 4], [1, 5]],
      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[2, 1], [2, 2], [2, 3], [2, 4]],
      [[2, 2], [2, 3], [2, 4], [2, 5]],
      [[3, 0], [3, 1], [3, 2], [3, 3]],
      [[3, 1], [3, 2], [3, 3], [3, 4]],
      [[3, 2], [3, 3], [3, 4], [3, 5]],
      [[4, 0], [4, 1], [4, 2], [4, 3]],
      [[4, 1], [4, 2], [4, 3], [4, 4]],
      [[4, 2], [4, 3], [4, 4], [4, 5]],
      [[5, 0], [5, 1], [5, 2], [5, 3]],
      [[5, 1], [5, 2], [5, 3], [5, 4]],
      [[5, 2], [5, 3], [5, 4], [5, 5]],
      [[6, 0], [6, 1], [6, 2], [6, 3]],
      [[6, 1], [6, 2], [6, 3], [6, 4]],
      [[6, 2], [6, 3], [6, 4], [6, 5]]
    ];
    var state = this.get('state');
    
    //If one of the players get their counters on one of the winning patterns, the player wins
    for(var pidx = 0; pidx < patterns.length; pidx++) {
      var pattern = patterns[pidx];
      var winner = state[pattern[0][0]][pattern[0][1]];
      
      if(winner) {
        //loops over all of the co ordinates starting with idx=1
        for(var idx = 1; idx <pattern.length; idx++) {
          if(winner != state[pattern[idx][0]][pattern[idx][1]]) {
            winner = undefined;
            break;
          }
        }
        //If there is a winner, players can't put their counters on anymore (game finished)
        if(winner){
          this.set('winner', winner);
          break;
        }
      }
    }
    //If there are no winners, then it is a draw
    if(!this.get('winner')) {
      var draw = true;
      for(var x = 0; x <= 2; x++) {
        for(var y = 0; y <= 2; y++) {
          if(!state[x][y]) {
            draw = false;
            break;
          }
        }
      }
      this.set('draw', draw);
    }
},

  actions: {
    //This will run, when the 'start' button is clicked
    start: function() {
      var board = this.get('board');
      board.alpha = 0;
      //makes the grid visible
      createjs.Tween.get(board).to({alpha: 1}, 1000);
      //playing turns to true
      this.set('playing', true); //when player clicks start the function will be user to change variable to true
      this.set('winner', undefined); //undefined at start of the game
      this.set('draw', false);
      
      //game state upon start
      //undefined indicates no player markers are played in the slot yet 
      this.set('state', [
          [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
          [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
          [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
          [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
          [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
          [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
          [undefined, undefined, undefined, undefined, undefined, undefined, undefined]]);
          
      //Moves have been reset for each user at start/restart of game
      this.set('moves', {'red': 0, 'yellow': 0});
      this.set('player', 'red');
      var markers = this.get('markers');
      for(var idx = 0; idx < 21; idx++) {
        markers.red[idx].visible = false;
        markers.yellow[idx].visible = false;
      }
      //A message to say red starts the game
      if(window.plugins && window.plugins.toast) {
        window.plugins.toast.showShortBottom('Red to Play Next');
      }
    }
  }
});
