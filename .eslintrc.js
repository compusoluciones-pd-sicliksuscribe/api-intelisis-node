module.exports = {
    "extends": "airbnb",
    "env": {
        "node": true,
        "mocha": true
    
    },
    "rules": {
        "arrow-parens": "off",
        "strict": "off",
        "prefer-template": "off",
        "no-param-reassign": "off",
        "max-len": ["warn", 200, { "ignoreComments": true }],
        "linebreak-style":"off",
        "import/newline-after-import":"off",
        "arrow-parens": ["error", "as-needed"]
    }
};

/* Para más información del porque realizamos esta configuración: https://github.com/airbnb/javascript */
