module.exports = { 
  'extends': 'airbnb-base',
  'env': {
    'node': true,
    'es6': true,
    'mocha': true
  },
  'parserOptions': {
    'ecmaVersion': 2017
  },
  'rules': {
  // Reference
  //  'off' or 0 - turn the rule off
  //  'warn' or 1 - turn the rule on as a warning (doesn’t affect exit code)
  //  'error' or 2 - turn the rule on as an error (exit code is 1 when triggered)
  'array-bracket-spacing': [1, 'never'], // disallow spaces between array brackets and other tokens
  'block-scoped-var': 2, // treat var statements as if they were block scoped (off by default). 0: deep destructuring is not compatible https://github.com/eslint/eslint/issues/1863
  'brace-style': [2, '1tbs', { 'allowSingleLine': true }], // enforces consistent brace style for blocks
  'camelcase': 2, // enforces camelcase style for property names
  'computed-property-spacing': [2, 'never'], // disallows spaces inside computed property brackets
  'comma-spacing': [1, {'before': false, 'after': true}], // enforce spacing before and after comma
  'comma-style': [1, 'last'], // enforce one true comma style (off by default)
  'curly': 2, // enforces curly braces for code block statements, even if one line
  'consistent-this': [1, 'me'], // enforces consistent naming when capturing the current execution context (off by default)
  'eol-last': 1, // enforce newline at the end of file, with no multiple empty lines
  'eqeqeq': [2, 'smart'], // require the use of === and !==
  'max-depth': [1, 3], // disallow more than 3 nested code blocks
  'max-len': [1, 80], // enforces a maximum line length to increase code readability and maintainability
  'max-statements': [1, 15], // enforces a maximum number of statements allowed in function blocks
  'new-cap': 1, // requires constructor names to begin with a capital letter
  'no-extend-native': 2, // disallows directly modifying the prototype of built-in objects
  'no-mixed-spaces-and-tabs': 2, // disallows mixed spaces and tabs for indentation
  'no-trailing-spaces': 2, // disallows trailing whitespace (spaces, tabs, and other Unicode whitespace characters) at the end of lines
  'no-unused-vars': 1, // aimed at eliminating unused variables, functions, and parameters of functions
  'no-use-before-define': [2, 'nofunc'], // error when it encounters a reference to an identifier that has not yet been declared
  'object-curly-spacing': [2, 'never'], // enforce consistent spacing inside braces of object literals, destructuring assignments, and import/export specifiers
  'quotes': [2, 'single', { 'allowTemplateLiterals': true }], // enforces the consistent use of either backticks, double, or single quotes
  'quote-props': [1, 'as-needed', {'keywords': true}], // require quotes around object literal property names (off by default)
  'semi-style': [2, 'last'], //  reports line terminators around semicolons
  'keyword-spacing': [2, {'before': true, 'after': true}], // enforces consistent spacing around keywords and keyword-like tokens
  'space-unary-ops': 2, // enforces consistency regarding the spaces after words unary operators and after/before nonwords unary operators
  'indent': ['error', 2], // enforces a consistent indentation style of 2 spaces
  'vars-on-top': 2, // requires to declare all vars on top of their containing scope (off by default)
  'no-else-return': 2, // disallow else after a return in an if (off by default)
  'semi' :['error', 'always'],
  'import/no-unresolved': 0,
  'no-console': 'off',
  'no-unused-expressions': 'off',
  'no-shadow': ['error', { 'allow': ['error', 'result'] }],
  'no-empty': ['error', { 'allowEmptyCatch': true }],
  'import/no-dynamic-require': 0,
  }
};