'use strict';

define("web-app/tests/integration/components/connect-4-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | connect-4', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "N8vk39gq",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"connect-4\"],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), ''); // Template block usage:

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "34GUti6k",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"connect-4\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define("web-app/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('components/connect-4.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/connect-4.js should pass ESLint\n\n13:21 - \'createjs\' is not defined. (no-undef)\n16:21 - \'createjs\' is not defined. (no-undef)\n46:27 - \'createjs\' is not defined. (no-undef)\n57:30 - \'createjs\' is not defined. (no-undef)\n72:5 - \'createjs\' is not defined. (no-undef)\n234:7 - \'createjs\' is not defined. (no-undef)');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('routes/game.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/game.js should pass ESLint\n\n');
  });
});
define("web-app/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('web-app/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'web-app/templates/application.hbs should pass TemplateLint.\n\nweb-app/templates/application.hbs\n  3:19  error  you must use double quotes in templates  quotes\n');
  });
  QUnit.test('web-app/templates/components/connect-4.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'web-app/templates/components/connect-4.hbs should pass TemplateLint.\n\nweb-app/templates/components/connect-4.hbs\n  2:0  error  Incorrect indentation for `{{! //this will appear on the screen, if a player wins }}` beginning at L2:C0. Expected `{{! //this will appear on the screen, if a player wins }}` to be at an indentation of 2 but was found at 0.  block-indentation\n  12:4  error  Incorrect indentation for `<button>` beginning at L12:C4. Expected `<button>` to be at an indentation of 2 but was found at 4.  block-indentation\n  14:4  error  Incorrect indentation for `<button>` beginning at L14:C4. Expected `<button>` to be at an indentation of 2 but was found at 4.  block-indentation\n  12:21  error  you must use double quotes in templates  quotes\n  14:21  error  you must use double quotes in templates  quotes\n');
  });
  QUnit.test('web-app/templates/game.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'web-app/templates/game.hbs should pass TemplateLint.\n\n');
  });
});
define("web-app/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('integration/components/connect-4-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/connect-4-test.js should pass ESLint\n\n');
  });
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/game-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/game-test.js should pass ESLint\n\n');
  });
});
define("web-app/tests/test-helper", ["web-app/app", "web-app/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("web-app/tests/unit/routes/game-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | game', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:game');
      assert.ok(route);
    });
  });
});
define('web-app/config/environment', [], function() {
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

require('web-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
