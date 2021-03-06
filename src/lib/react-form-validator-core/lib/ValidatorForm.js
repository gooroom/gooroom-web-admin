'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ValidationRules = require('./ValidationRules');

var _ValidationRules2 = _interopRequireDefault(_ValidationRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable */

/* eslint-enable */


var ValidatorForm = function (_React$Component) {
    _inherits(ValidatorForm, _React$Component);

    function ValidatorForm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ValidatorForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ValidatorForm.__proto__ || Object.getPrototypeOf(ValidatorForm)).call.apply(_ref, [this].concat(args))), _this), _this.getChildContext = function () {
            return {
                form: {
                    attachToForm: _this.attachToForm,
                    detachFromForm: _this.detachFromForm,
                    instantValidate: _this.instantValidate,
                    debounceTime: _this.debounceTime
                }
            };
        }, _this.instantValidate = _this.props.instantValidate !== undefined ? _this.props.instantValidate : true, _this.debounceTime = _this.props.debounceTime, _this.childs = [], _this.errors = [], _this.attachToForm = function (component) {
            if (_this.childs.indexOf(component) === -1) {
                _this.childs.push(component);
            }
        }, _this.detachFromForm = function (component) {
            var componentPos = _this.childs.indexOf(component);
            if (componentPos !== -1) {
                _this.childs = _this.childs.slice(0, componentPos).concat(_this.childs.slice(componentPos + 1));
            }
        }, _this.submit = function (event) {
            if (event) {
                event.preventDefault();
            }
            _this.errors = [];
            var result = _this.walk(_this.childs);
            if (_this.errors.length) {
                _this.props.onError(_this.errors);
            }
            if (result) {
                _this.props.onSubmit(event);
            }
            return result;
        }, _this.walk = function (children, dryRun) {
            var self = _this;
            var result = true;
            if (Array.isArray(children)) {
                children.forEach(function (input) {
                    if (!self.checkInput(input, dryRun)) {
                        result = false;
                    }
                    return input;
                });
            } else {
                result = self.walk([children], dryRun);
            }
            return result;
        }, _this.checkInput = function (input, dryRun) {
            var result = true;
            var validators = input.props.validators;
            if (validators && !_this.validate(input, true, dryRun)) {
                result = false;
            }
            return result;
        }, _this.validate = function (input, includeRequired, dryRun) {
            var _input$props = input.props,
                value = _input$props.value,
                validators = _input$props.validators,
                name = _input$props.name;

            var result = [];
            var valid = true;
            var validateResult = false;
            var component = _this.find(_this.childs, function (component) {
                return component.props.name === name;
            });
            validators.map(function (validator) {
                validateResult = _this.constructor.getValidator(validator, value, includeRequired);
                result.push({ input: input, result: validateResult });
                component.validate(component.props.value, true, dryRun);
                return validator;
            });
            result.map(function (item) {
                if (!item.result) {
                    valid = false;
                    _this.errors.push(item.input);
                }
                return item;
            });
            return valid;
        }, _this.find = function (collection, fn) {
            for (var i = 0, l = collection.length; i < l; i++) {
                var item = collection[i];
                if (fn(item)) {
                    return item;
                }
            }
            return null;
        }, _this.resetValidations = function () {
            _this.childs.forEach(function (child) {
                child.validateDebounced.cancel();
                child.setState({ isValid: true });
            });
        }, _this.isFormValid = function () {
            var dryRun = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            return _this.walk(_this.childs, dryRun);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ValidatorForm, [{
        key: 'render',
        value: function render() {
            // eslint-disable-next-line
            var _props = this.props,
                onSubmit = _props.onSubmit,
                instantValidate = _props.instantValidate,
                onError = _props.onError,
                debounceTime = _props.debounceTime,
                children = _props.children,
                rest = _objectWithoutProperties(_props, ['onSubmit', 'instantValidate', 'onError', 'debounceTime', 'children']);

            return _react2.default.createElement(
                'form',
                _extends({}, rest, { onSubmit: this.submit }),
                children
            );
        }
    }]);

    return ValidatorForm;
}(_react2.default.Component);

ValidatorForm.getValidator = function (validator, value, includeRequired) {
    var result = true;
    var name = validator;
    if (name !== 'required' || includeRequired) {
        var extra = void 0;
        var splitIdx = validator.indexOf(':');
        if (splitIdx !== -1) {
            name = validator.substring(0, splitIdx);
            extra = validator.substring(splitIdx + 1);
        }
        result = _ValidationRules2.default[name](value, extra);
    }
    return result;
};

ValidatorForm.addValidationRule = function (name, callback) {
    _ValidationRules2.default[name] = callback;
};

ValidatorForm.childContextTypes = {
    form: _propTypes2.default.object
};

ValidatorForm.propTypes = {
    //onSubmit: _propTypes2.default.func.isRequired,
    instantValidate: _propTypes2.default.bool,
    children: _propTypes2.default.node,
    onError: _propTypes2.default.func,
    debounceTime: _propTypes2.default.number
};

ValidatorForm.defaultProps = {
    onError: function onError() {},
    debounceTime: 0
};

exports.default = ValidatorForm;