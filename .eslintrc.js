module.exports = {
    "extends": "airbnb",
    "env": {
        "node": true,
        "mocha": true
    
    },
    "rules": {
        "strict": "off",
        "prefer-template": "off",
        "no-param-reassign": "off",
        "max-len": ["warn", 200, { "ignoreComments": true }],
        "linebreak-style":"off",
        "import/newline-after-import":"off"
    }
};

/* Para más información del porque realizamos esta configuración: https://github.com/airbnb/javascript */