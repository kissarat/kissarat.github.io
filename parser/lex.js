lexems = {
  // keyword: /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)/,
  literal: /^[a-z]\w*/,
  number: /^\d+(\.\d+)?/,
  space: /^\s+/,
  line: ';',
  assign: '=',
  or: '|',
  plus: '+',
  repeat: '[',
  endrepeat: ']',
  brace: '(',
  endbrace: ')',
  bracket: '{',
  endbracket: '}',
  string: {
    pattern: /^("([^"](\\")?)*"|'([^'](\\')?)*')/,
    parse(string) {
      return JSON.parse(string)
    }
  }
};

stackTokens = ['repeat', 'brace', 'bracket'];
binary = ['or', 'plus', 'assign', 'line'];

class Token {
  constructor(...args) {
    this.args = args
  }
}

function scan(string) {
  if (0 === string.length) {
    return [];
  }
  for (const [name, entry] of Object.entries(lexems)) {
    if ('string' === typeof entry) {
      if (string.indexOf(entry) === 0) {
        return [[name], ...scan(string.slice(entry.length))]
      }
      continue;
    }
    const m = (entry.pattern || entry).exec(string);
    if (m) {
      return [
        [name, entry.parse ? entry.parse(m[0]) : m[0]],
        ...scan(string.slice(m[0].length))
      ]
    }
  }
  const result = scan(string.slice(1));
  if ('unknown' === result[0][0]) {
    result[0][1] = string[0] + result[0][1];
    return result
  }
  return [
    ['unknown', string[0]],
    ...result
  ];
}

function ignore(tokens, list = ['unknown', 'space']) {
  return tokens.filter(t => list.indexOf(t[0]) < 0)
}

function single(array) {
  return 1 === array.length ? array[0] : array;
}

function parse(tokens) {
  let i = 0;

  function _parse() {
    let result = [];
    for (; i < tokens.length; i++) {
      const token = tokens[i];
      const name = token[0];
      if (stackTokens.indexOf(name) >= 0) {
        i++;
        const stack = _parse();
        if (name instanceof Array) {
          console.error('Array ', name)
        }
        if (binary.indexOf(stack[0]) >= 0) {
          result.push([name, stack]);
        }
        else {
          result.push([name, ...stack]);
        }
      }
      // if (binary.indexOf(name) >= 0) {
      //   i++;
      //   const left = result.slice(0);
      //   const [first, ...right] = _parse();
      // if (name === first) {
      //   return [name, left, ...right];
      // }
      // if (binary.indexOf(first) > binary.indexOf(name)) {
      //   return [name, [first, left, ...right]]
      // }
      // return [name, left, [first, ...right]];
      // }
      // else {
      if (name.indexOf('end') === 0) {
        break;
      }
      else {
        result.push(token);
      }
      // }
    }
    return result;
  }

  return _parse();
}

Array.prototype.out = function () {
  return this.map(t => t.join(':')).join(' ')
};

Array.prototype.json = function () {
  return JSON.stringify(this, null, '\t')
};

Array.prototype.pretty = function () {
  return this.map(t => stackTokens.indexOf(t[0]) >= 0 ? t.pretty() : ('string' === typeof t ? t : t.join(':')))
}
