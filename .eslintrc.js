module.exports = {
    "env": { "node": true },
    "extends": ["eslint:recommended", "prettier"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
    },
    "plugins": ["prettier"],
    "rules": {
        "prettier/prettier": "warn"
    }
};