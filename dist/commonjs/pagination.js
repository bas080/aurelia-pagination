'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _aureliaFramework = require('aurelia-framework');

var _aureliaTemplating = require('aurelia-templating');

var _spoonxAureliaOrm = require('spoonx/aurelia-orm');

var Pagination = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Pagination, [{
    key: 'page',
    decorators: [_aureliaFramework.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'limit',
    decorators: [_aureliaFramework.bindable],
    initializer: function initializer() {
      return 20;
    },
    enumerable: true
  }, {
    key: 'count',
    decorators: [_aureliaFramework.bindable],
    initializer: function initializer() {
      return 0;
    },
    enumerable: true
  }, {
    key: 'pagechange',
    decorators: [_aureliaFramework.bindable],
    initializer: function initializer() {
      return null;
    },
    enumerable: true
  }, {
    key: 'pageCount',
    decorators: [(0, _aureliaFramework.computedFrom)('count', 'limit')],
    get: function get() {
      return Math.ceil(this.count / this.limit);
    }
  }], null, _instanceInitializers);

  function Pagination(entityManager, element) {
    _classCallCheck(this, _Pagination);

    _defineDecoratedPropertyDescriptor(this, 'page', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'limit', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'count', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'pagechange', _instanceInitializers);

    this.entityManager = entityManager;
    this.element = element;
  }

  _createDecoratedClass(Pagination, [{
    key: 'attached',
    value: function attached() {
      this.resource = this.element.getAttribute('resource');
      if (!this.resource) {
        return;
      }
      this.repository = this.entityManager.getRepository(this.resource);
      this.updateRecordCount();
    }
  }, {
    key: 'loadPrevious',
    value: function loadPrevious() {
      this.load(this.page - 1);
    }
  }, {
    key: 'loadNext',
    value: function loadNext() {
      this.load(this.page + 1);
    }
  }, {
    key: 'load',
    value: function load(page) {
      var _this = this;

      if (page === 0) {
        return;
      }

      page = page || 1;

      if (this.pageCount && page > this.pageCount) {
        return;
      }

      if (typeof this.pagechange === 'function') {
        this.pagechange({ page: page }).then(function () {
          _this.page = page;
        });
      } else {
        this.page = page;
      }
    }
  }, {
    key: 'updateRecordCount',
    value: function updateRecordCount() {
      var _this2 = this;

      if (this.repository) {
        this.repository.count().then(function (response) {
          return _this2.count = response.count;
        })['catch'](function (error) {
          throw new Error('Error updating count : ' + error);
        });
      }
    }
  }], null, _instanceInitializers);

  var _Pagination = Pagination;
  Pagination = (0, _aureliaTemplating.customElement)('pagination')(Pagination) || Pagination;
  Pagination = (0, _aureliaFramework.inject)(_spoonxAureliaOrm.EntityManager, Element)(Pagination) || Pagination;
  return Pagination;
})();

exports.Pagination = Pagination;