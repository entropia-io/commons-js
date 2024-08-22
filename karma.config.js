const path = require('path');

const webpackConfig = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'spec/webpack_generated'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.spec.karma.json',
                    },
                },
                exclude: /node_modules/,

            },
        ],
    },
    devtool: 'inline-source-map',
};

const realBrowser = String(process.env.BROWSER).match(/^(1|true)$/gi)
const travisLaunchers = {
    chrome_travis: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
    },
}

const localBrowsers = realBrowser ? Object.keys(travisLaunchers) : ['Chrome']

module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['jasmine', 'webpack'],
        files: [
            {pattern: 'src/browser/**/*.spec.ts'},
            {pattern: 'src/common/**/*.spec.ts'},
        ],
        preprocessors: {
            'src/**/*.spec.ts': ['webpack'],
        },
        webpack: webpackConfig,
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
        },
        colors: true,
        logLevel: config.DEBUG,
        autoWatch: false,
        browsers: localBrowsers,
        singleRun: true,
        concurrency: Infinity,
        failOnEmptyTestSuite: false,
    });
};
