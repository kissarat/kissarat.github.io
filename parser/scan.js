const constants = {
    Line: ';',
    Assign: '=',
    Or: '|',
    Plus: '+',
    Repeat: '[',
    EndRepeat: ']',
    Brace: '(',
    EndBrace: ')',
    Bracket: '{',
    EndBracket: '}'
};

class Lexeme {
    constructor(name) {
        this.name = name
    }
}

class StringLexeme extends Lexeme {
    constructor(name, value) {
        super(name)
        this.value = value
    }
}

class PatternLexeme extends Lexeme {
    constructor(name, pattern, parse) {
        super(name)
        this.pattern = pattern
        this.parse = parse || null
    }

    // parse(raw) {
    //     return this.pattern.exec(raw)
    // }
}

const lexemes = [
    {
        name: 'String',
        pattern: /^"(([^"](\\")?)*)"/,
        parse(raw) {
            return JSON.parse(raw)
        }
    },
    {
        name: 'Char',
        pattern: /^'([^']|\\'|\\x[\da-f]{2}|\\u[\da-f]{4})'/i,
        parse(raw) {
            return JSON.parse(raw)
        }
    },
    {
        name: 'Space',
        pattern: /^\s+/
    },
    {
        name: 'Literal',
        pattern: /^[a-z]\w*/
    },
    {
        name: 'Rational',
        pattern: /^-?\d+\.\d+/,
        parse(raw) {
            return +raw
        }
    },
    {
        name: 'Integer',
        pattern: /^-?\d+/,
        parse(raw) {
            return +raw
        }
    },
]
    .map(lexeme => new PatternLexeme(
        lexeme.name,
        lexeme.pattern,
        lexeme.parse
    ))
    .concat(
        Object.keys(constants).map(name => new StringLexeme(
            name,
            constants[name]
        ))
    )

Object.freeze(lexemes)

class Token {
    constructor(lexeme) {
        this.lexeme = lexeme
    }

    toString() {
        return this.lexeme.value
    }
}

class ValueToken extends Token {
    constructor(lexeme, value) {
        super(lexeme)
        this.value = value
    }

    toString() {
        return this.value
    }
}

const Space = lexemes.find(lexeme => 'Space' === lexeme.name)

const maxGas = 8 * 1024

function* scan(fragments) {
    let gas = 0;
    for (let fragment of fragments) {
        while (fragment.length > 0) {
            let token
            if (gas < maxGas) {
                gas++
            } else {
                throw new Error('Out of gas')
            }
            for (const lexeme of lexemes) {
                if (lexeme instanceof PatternLexeme) {
                    const match = lexeme.pattern.exec(fragment)
                    if (match) {
                        let value;
                        if ('function' === typeof lexeme.parse) {
                            value = lexeme.parse(fragment)
                        } else {
                            value = match.length > 1
                                ? match[1]
                                : match[0]
                        }
                        token = new ValueToken(lexeme, value)
                        fragment = fragment.slice(match[0].length)
                        if (token.lexeme.name === Space.name) {
                            continue
                        }
                    }
                } else if (lexeme instanceof StringLexeme) {
                    if (fragment.indexOf(lexeme.value) === 0) {
                        token = new Token(lexeme)
                        fragment = fragment.slice(lexeme.value.length)
                    }
                } else if (lexeme) {
                    throw new Error(`Invalid lexeme type ${lexeme.constructor.name}`)
                } else {
                    // console.error(lexemes.indexOf(lexeme), lexemes)
                    throw new Error('Undefined lexeme')
                }
            }
            if (!token) {
                throw new Error(`Unknown fragment ${fragment}`)
            }
            yield token
        }
    }
}
