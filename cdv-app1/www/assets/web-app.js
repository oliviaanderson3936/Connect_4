'use strict';



;define("web-app/app", ["exports", "web-app/resolver", "ember-load-initializers", "web-app/config/environment"], function (_exports, _resolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
  var _default = App;
  _exports.default = _default;
});
;define("web-app/components/connect-4", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    //Variables before the game starts
    playing: false,
    winner: undefined,
    draw: false,
    didInsertElement: function () {
      //The stage is what appear on the screen
      var stage = new createjs.Stage(this.$('#stage')[0]); // Draw the Grid/Board

      var board = new createjs.Shape();
      var graphics = board.graphics;
      graphics.beginFill('#ffffff');
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
      graphics.drawRect(299, 0, 2, 300); //This puts space outside the grid to make it look in the centre

      board.x = 35;
      board.y = 35; //the board is invisible at the start

      board.alpha = 0;
      this.set('board', board); //this adds the board to the stage

      stage.addChild(board); //Create Markers

      var markers = {
        'red': [],
        'yellow': [] //the board can fill 42 counters, so each counter can only appear 21 times

      };

      for (var x = 0; x < 21; x++) {
        //Creating red marker
        var redMarker = new createjs.Shape();
        graphics = redMarker.graphics;
        graphics.beginFill('#FF0000');
        graphics.setStrokeStyle(10);
        graphics.drawCircle(0, 0, 20);
        redMarker.visible = false; //this adds the red counter to the stage

        stage.addChild(redMarker);
        markers.red.push(redMarker); //Creating yellow marker

        var yellowMarker = new createjs.Shape();
        graphics = yellowMarker.graphics;
        graphics.beginFill('#FFFF00');
        graphics.setStrokeStyle(10);
        graphics.drawCircle(0, 0, 20);
        yellowMarker.visible = false; //this adds the yellow counter to the stage

        stage.addChild(yellowMarker);
        markers.yellow.push(yellowMarker);
      }

      this.set('markers', markers);
      this.set('stage', stage); //this updates the stage

      createjs.Ticker.addEventListener("tick", stage);
    },
    //This is the click event, it runs whenever there is a click
    click: function (ev) {
      if (this.get('playing') && !this.get('winner')) {
        //This is the area, which is the grid, the players are able to click.
        if (ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >= 35 && ev.offsetY >= 35 && ev.offsetX < 380 && ev.offsetY < 335) {
          var x = Math.floor((ev.offsetX - 35) / 50);
          var y = Math.floor((ev.offsetY - 35) / 50);
          var state = this.get('state'); //This enables the player to click on a counter, which is already place, and a counter will be placed at the top of the stack of counters

          while (state[x][y] == 'red' || state[x][y] == 'yellow') {
            y = y - 1;
          }

          if (!state[x][y]) {
            var player = this.get('player');
            state[x][y] = player;
            var move_count = this.get('moves')[player];
            var marker = this.get('markers')[player][move_count];
            marker.visible = true; //This calculation makes the counters fit inside the squares in the grid

            if (player == 'red') {
              marker.x = 60 + x * 50;
              marker.y = 60 + y * 50;
            } else {
              marker.x = 60 + x * 50;
              marker.y = 60 + y * 50;
            }

            this.check_winner(); //This allows for the yellow counter to appear after red and it will loop

            this.get('moves')[player] = move_count + 1;

            if (player == 'red') {
              this.set('player', 'yellow');
            } else {
              this.set('player', 'red');
            } //This will use the plug-in to display the message to say who goes next on the mobile app


            if (!this.get('winner') && window.plugins && window.plugins.toast) {
              window.plugins.toast.showShortBottom(this.get('player').toUpperCase() + ' to Play Next');
            }
          }
        }
      }
    },
    check_winner: function () {
      //These are co-ordinates of winning patterns.
      var patterns = [//Diagonals
      [[0, 2], [1, 3], [2, 4], [3, 5]], [[0, 1], [1, 2], [2, 3], [3, 4]], [[1, 2], [2, 3], [3, 4], [4, 5]], [[0, 0], [1, 1], [2, 2], [3, 3]], [[1, 1], [2, 2], [3, 3], [4, 4]], [[2, 2], [3, 3], [4, 4], [5, 5]], [[0, 1], [2, 1], [3, 2], [4, 3]], [[2, 1], [3, 2], [4, 3], [5, 4]], [[3, 2], [4, 3], [5, 4], [6, 5]], [[2, 0], [3, 1], [4, 2], [5, 3]], [[3, 1], [4, 2], [5, 3], [6, 4]], [[3, 0], [4, 1], [5, 2], [6, 3]], [[0, 3], [1, 2], [2, 1], [3, 0]], [[4, 0], [3, 1], [2, 2], [1, 3]], [[0, 4], [1, 3], [2, 2], [3, 1]], [[5, 0], [4, 1], [3, 2], [2, 3]], [[4, 1], [3, 2], [2, 3], [1, 4]], [[0, 5], [1, 4], [2, 3], [3, 2]], [[1, 5], [2, 4], [3, 3], [4, 2]], [[2, 4], [3, 3], [4, 2], [5, 1]], [[3, 3], [4, 2], [5, 1], [6, 0]], [[2, 5], [3, 4], [4, 3], [5, 2]], [[3, 4], [4, 3], [5, 2], [6, 1]], [[3, 5], [4, 4], [5, 3], [6, 2]], //Horizontals
      [[0, 0], [1, 0], [2, 0], [3, 0]], [[1, 0], [2, 0], [3, 0], [4, 0]], [[2, 0], [3, 0], [4, 0], [5, 0]], [[3, 0], [4, 0], [5, 0], [6, 0]], [[0, 1], [1, 1], [2, 1], [3, 1]], [[1, 1], [2, 1], [3, 1], [4, 1]], [[2, 1], [3, 1], [4, 1], [5, 1]], [[3, 1], [4, 1], [5, 1], [6, 1]], [[0, 2], [1, 2], [2, 2], [3, 2]], [[1, 2], [2, 2], [3, 2], [4, 2]], [[2, 2], [3, 2], [4, 2], [5, 2]], [[3, 2], [4, 2], [5, 2], [6, 2]], [[0, 3], [1, 3], [2, 3], [3, 3]], [[1, 3], [2, 3], [3, 3], [4, 3]], [[2, 3], [3, 3], [4, 3], [5, 3]], [[3, 3], [4, 3], [5, 3], [6, 3]], [[0, 4], [1, 4], [2, 4], [3, 4]], [[1, 4], [2, 4], [3, 4], [4, 4]], [[2, 4], [3, 4], [4, 4], [5, 4]], [[3, 4], [4, 4], [5, 4], [6, 4]], [[0, 5], [1, 5], [2, 5], [3, 5]], [[1, 5], [2, 5], [3, 5], [4, 5]], [[2, 5], [3, 5], [4, 5], [5, 5]], [[3, 5], [4, 5], [5, 5], [6, 5]], //Verticals
      [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 1], [0, 2], [0, 3], [0, 4]], [[0, 2], [0, 3], [0, 4], [0, 5]], [[1, 0], [1, 1], [1, 2], [1, 3]], [[1, 1], [1, 2], [1, 3], [1, 4]], [[1, 2], [1, 3], [1, 4], [1, 5]], [[2, 0], [2, 1], [2, 2], [2, 3]], [[2, 1], [2, 2], [2, 3], [2, 4]], [[2, 2], [2, 3], [2, 4], [2, 5]], [[3, 0], [3, 1], [3, 2], [3, 3]], [[3, 1], [3, 2], [3, 3], [3, 4]], [[3, 2], [3, 3], [3, 4], [3, 5]], [[4, 0], [4, 1], [4, 2], [4, 3]], [[4, 1], [4, 2], [4, 3], [4, 4]], [[4, 2], [4, 3], [4, 4], [4, 5]], [[5, 0], [5, 1], [5, 2], [5, 3]], [[5, 1], [5, 2], [5, 3], [5, 4]], [[5, 2], [5, 3], [5, 4], [5, 5]], [[6, 0], [6, 1], [6, 2], [6, 3]], [[6, 1], [6, 2], [6, 3], [6, 4]], [[6, 2], [6, 3], [6, 4], [6, 5]]];
      var state = this.get('state'); //If one of the players get their counters on one of the winning patterns, the player wins

      for (var pidx = 0; pidx < patterns.length; pidx++) {
        var pattern = patterns[pidx];
        var winner = state[pattern[0][0]][pattern[0][1]];

        if (winner) {
          for (var idx = 1; idx < pattern.length; idx++) {
            if (winner != state[pattern[idx][0]][pattern[idx][1]]) {
              winner = undefined;
              break;
            }
          } //If there is a winner, players can't put their counters on anymore


          if (winner) {
            this.set('winner', winner);
            break;
          }
        }
      } //If there is no winners, then it is a draw


      if (!this.get('winner')) {
        var draw = true;

        for (var x = 0; x <= 2; x++) {
          for (var y = 0; y <= 2; y++) {
            if (!state[x][y]) {
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
      start: function () {
        var board = this.get('board');
        board.alpha = 0; //This makes the grid appear

        createjs.Tween.get(board).to({
          alpha: 1
        }, 1000); //playing turns to true

        this.set('playing', true);
        this.set('winner', undefined);
        this.set('draw', false); //All the squares become empty

        this.set('state', [[undefined, undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined, undefined]]); //Moves have been reset

        this.set('moves', {
          'red': 0,
          'yellow': 0
        });
        this.set('player', 'red');
        var markers = this.get('markers');

        for (var idx = 0; idx < 21; idx++) {
          markers.red[idx].visible = false;
          markers.yellow[idx].visible = false;
        } //A message to say red starts the game


        if (window.plugins && window.plugins.toast) {
          window.plugins.toast.showShortBottom('Red to Play Next');
        }
      }
    }
  });

  _exports.default = _default;
});
;define("web-app/components/welcome-page", ["exports", "ember-welcome-page/components/welcome-page"], function (_exports, _welcomePage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
;define("web-app/helpers/app-version", ["exports", "web-app/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = Ember.Helper.helper(appVersion);

  _exports.default = _default;
});
;define("web-app/helpers/pluralize", ["exports", "ember-inflector/lib/helpers/pluralize"], function (_exports, _pluralize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _pluralize.default;
  _exports.default = _default;
});
;define("web-app/helpers/singularize", ["exports", "ember-inflector/lib/helpers/singularize"], function (_exports, _singularize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _singularize.default;
  _exports.default = _default;
});
;define("web-app/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "web-app/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("web-app/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("web-app/initializers/ember-data", ["exports", "ember-data/setup-container", "ember-data"], function (_exports, _setupContainer, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
      adapter: 'custom'
    });
    ```
  
    ```app/controllers/posts.js
    import { Controller } from '@ember/controller';
  
    export default Controller.extend({
      // ...
    });
  
    When the application is initialized, `ApplicationStore` will automatically be
    instantiated, and the instance of `PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */
  var _default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
  _exports.default = _default;
});
;define("web-app/initializers/export-application-global", ["exports", "web-app/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("web-app/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (_exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
  _exports.default = _default;
});
;define("web-app/resolver", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _emberResolver.default;
  _exports.default = _default;
});
;define("web-app/router", ["exports", "web-app/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });
  Router.map(function () {
    this.route('game', {
      path: '/'
    });
  });
  var _default = Router;
  _exports.default = _default;
});
;define("web-app/routes/game", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("web-app/services/ajax", ["exports", "ember-ajax/services/ajax"], function (_exports, _ajax) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("web-app/templates/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "JWfrqgSE",
    "block": "{\"symbols\":[],\"statements\":[[7,\"section\"],[11,\"id\",\"app\"],[9],[0,\"\\n  \"],[7,\"header\"],[9],[0,\"\\n    \"],[7,\"h1\"],[9],[4,\"link-to\",[\"game\"],null,{\"statements\":[[0,\"CONNECT 4\"]],\"parameters\":[]},null],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"article\"],[9],[0,\"\\n    \"],[1,[21,\"outlet\"],false],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"footer\"],[9],[0,\"\\n  \"],[10],[0,\"\\n\"],[10],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "web-app/templates/application.hbs"
    }
  });

  _exports.default = _default;
});
;define("web-app/templates/components/connect-4", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "cDBCSnjh",
    "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[23,[\"playing\"]]],null,{\"statements\":[[4,\"if\",[[23,[\"winner\"]]],null,{\"statements\":[[0,\"    \"],[7,\"div\"],[9],[0,\"\\n      Player \"],[1,[21,\"winner\"],false],[0,\" won!\\n    \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[23,[\"draw\"]]],null,{\"statements\":[[0,\"    we'll call it a draw.\\n\"]],\"parameters\":[]},null],[0,\"    \"],[7,\"button\"],[9],[0,\"Restart\"],[3,\"action\",[[22,0,[]],\"start\"]],[10],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[7,\"button\"],[9],[0,\"Start\"],[3,\"action\",[[22,0,[]],\"start\"]],[10],[0,\"\\n\"]],\"parameters\":[]}],[7,\"canvas\"],[11,\"id\",\"stage\"],[11,\"width\",\"380\"],[11,\"height\",\"380\"],[9],[10],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "web-app/templates/components/connect-4.hbs"
    }
  });

  _exports.default = _default;
});
;define("web-app/templates/game", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "LLXiXRHl",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"connect-4\"],false],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "web-app/templates/game.hbs"
    }
  });

  _exports.default = _default;
});
;

;define('web-app/config/environment', [], function() {
  var prefix = 'web-app';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("web-app/app")["default"].create({"name":"web-app","version":"0.0.0+53dce908"});
          }
        
//# sourceMappingURL=web-app.map
