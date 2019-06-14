var pwd = 'pwd';
var Test = /** @class */ (function () {
    function Test() {
    }
    Object.defineProperty(Test.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (newName) {
            if (pwd === 'pwd') {
                this._name = newName;
            }
            else {
                console.log('u can');
            }
        },
        enumerable: true,
        configurable: true
    });
    Test.hh = 'hello';
    return Test;
}());
