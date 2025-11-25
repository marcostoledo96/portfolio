// Karma configuration file
// Este archivo configura Karma para correr los tests unitarios con Jasmine y Chrome.
// Yo uso esta configuración por defecto de Angular porque me permite ejecutar tests
// de forma automática y ver los resultados en el navegador o en la consola.

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: {
                // Opciones de Jasmine (puedo agregar timeouts custom o configuraciones)
            },
            clearContext: false // deja visible el output de Jasmine en el navegador
        },
        jasmineHtmlReporter: {
            suppressAll: true // elimina mensajes de trazas duplicados
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/portfolio-frontend'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
        reporters: ['progress', 'kjhtml'],
        browsers: ['Chrome'],
        restartOnFileChange: true
    });
};
