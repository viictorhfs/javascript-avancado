'use strict';

//Polyfill para caso Array.includes não seja suportado nativamente

if (!Array.prototype.includes) {
    console.log('Polyfill para Array.ioncludes aplicado.');

    Array.prototype.includes = function (elemento) {
        return this.indexOf(elemento) != -1;
    };
}
//# sourceMappingURL=es6.js.map