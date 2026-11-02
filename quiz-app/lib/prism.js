/* PrismJS 1.29.0 - Java & Oracle SQL/PLSQL Syntax Highlighting (Self-contained & offline) */
var _self = typeof window !== 'undefined' ? window : typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : {};
var Prism = (function(_self) {
  var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
  var uniqueId = 0;

  var _ = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function encode(tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, encode(tokens.content), tokens.alias);
        } else if (Array.isArray(tokens)) {
          return tokens.map(encode);
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
        }
      },
      type: function(o) {
        return Object.prototype.toString.call(o).slice(8, -1);
      }
    },
    languages: {},
    highlightAll: function(async, callback) {
      _.highlightAllUnder(document, async, callback);
    },
    highlightAllUnder: function(container, async, callback) {
      var env = {
        callback: callback,
        container: container,
        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      };
      var elements = env.container.querySelectorAll(env.selector);
      for (var i = 0, element; (element = elements[i++]);) {
        _.highlightElement(element, async === true, env.callback);
      }
    },
    highlightElement: function(element, async, callback) {
      var match = (element.className || '').match(lang);
      var language = match ? match[1].toLowerCase() : (window.__ACTIVE_COURSE === 'sql' ? 'sql' : 'java');
      if (language === 'plsql' || language === 'oracle' || (window.__ACTIVE_COURSE === 'sql' && language === 'java')) {
        language = 'sql';
      }
      var grammar = _.languages[language] || _.languages.java;
      if (!grammar) return;
      var code = element.textContent;
      element.innerHTML = _.highlight(code, grammar, language);
      if (callback) callback.call(element);
    },
    highlight: function(text, grammar, language) {
      var tokens = _.tokenize(text, grammar);
      return Token.stringify(_.util.encode(tokens), language);
    },
    tokenize: function(text, grammar) {
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) grammar[token] = rest[token];
        delete grammar.rest;
      }
      var tokenList = new LinkedList();
      addAfter(tokenList, tokenList.head, text);
      matchGrammar(text, tokenList, grammar, tokenList.head, 0);
      return toArray(tokenList);
    }
  };

  function Token(type, content, alias, matchedStr) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    this.length = (matchedStr || '').length | 0;
  }

  Token.stringify = function stringify(o, language) {
    if (typeof o == 'string') return o;
    if (Array.isArray(o)) {
      var s = '';
      for (var i = 0; i < o.length; i++) s += stringify(o[i], language);
      return s;
    }
    var env = {
      type: o.type,
      content: stringify(o.content, language),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language
    };
    if (o.alias) {
      var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
      Array.prototype.push.apply(env.classes, aliases);
    }
    return '<' + env.tag + ' class="' + env.classes.join(' ') + '">' + env.content + '</' + env.tag + '>';
  };

  function matchPattern(pattern, pos, text, lookbehind) {
    pattern.lastIndex = pos;
    var match = pattern.exec(text);
    if (match && lookbehind && match[1]) {
      var lookbehindLength = match[1].length;
      match.index += lookbehindLength;
      match[0] = match[0].slice(lookbehindLength);
    }
    return match;
  }

  function matchGrammar(text, tokenList, grammar, startNode, startPos) {
    for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) continue;
      var patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];
      for (var j = 0; j < patterns.length; ++j) {
        var patternObj = patterns[j];
        var pattern = patternObj.pattern || patternObj;
        var lookbehind = Boolean(patternObj.lookbehind);
        var inside = patternObj.inside;
        for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
          if (currentNode.value instanceof Token) continue;
          var str = currentNode.value;
          var match = matchPattern(pattern, 0, str, lookbehind);
          if (!match) continue;
          var from = match.index;
          var matchStr = match[0];
          var before = str.slice(0, from);
          var after = str.slice(from + matchStr.length);
          var reach = pos + str.length;
          var removeFrom = currentNode.prev;
          if (before) {
            removeFrom = addAfter(tokenList, removeFrom, before);
            pos += before.length;
          }
          removeRange(tokenList, removeFrom, currentNode);
          var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, patternObj.alias, matchStr);
          currentNode = addAfter(tokenList, removeFrom, wrapped);
          if (after) addAfter(tokenList, currentNode, after);
          if (currentNode === tokenList.tail) break;
        }
      }
    }
  }

  function LinkedList() {
    var head = { value: null, prev: null, next: null };
    var tail = { value: null, prev: head, next: null };
    head.next = tail;
    this.head = head;
    this.tail = tail;
    this.length = 0;
  }
  function addAfter(list, node, value) {
    var next = node.next;
    var newNode = { value: value, prev: node, next: next };
    node.next = newNode;
    next.prev = newNode;
    list.length++;
    return newNode;
  }
  function removeRange(list, node, count) {
    var next = node.next;
    var current = next;
    node.next = count.next;
    count.next.prev = node;
    list.length--;
  }
  function toArray(list) {
    var array = [];
    var node = list.head.next;
    while (node !== list.tail) {
      array.push(node.value);
      node = node.next;
    }
    return array;
  }

  return _;
})(_self);

// Java Grammar Definition
Prism.languages.java = {
  'doc-comment': {
    pattern: /\/\*\*[\s\S]*?(?:\*\/|$)/,
    greedy: true,
    alias: 'comment'
  },
  'comment': [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true, greedy: true },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }
  ],
  'string': {
    pattern: /"(?:\\.|[^"\\\r\n])*"/,
    greedy: true
  },
  'annotation': {
    pattern: /(^|[^.])@\w+(?:\s*\([^)]*\))?/,
    lookbehind: true,
    alias: 'punctuation'
  },
  'class-name': [
    {
      pattern: /(\b(?:class|interface|extends|implements|instanceof|new|record|enum)\s+)(?!boolean|byte|char|short|int|long|float|double)[A-Z]\w*/,
      lookbehind: true
    },
    {
      pattern: /\b[A-Z]\w*(?=\s*<)/
    },
    {
      pattern: /\b[A-Z]\w*(?=\s+[\w$]+\s*[:=;,)])/,
    }
  ],
  'keyword': /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|open|opens|package|permits|private|protected|provides|public|record|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
  'boolean': /\b(?:false|true)\b/,
  'number': /\b0b[01][01_]*L?\b|\b0x(?:\.?[0-9a-f_p+-]+|[\da-f_]+(?:\.[\da-f_]*)?(?:p[+-]?\d+)?)[fl]?\b|\b(?:\d[\d_]*(?:\.[\d_]*)?|\.\d[\d_]*)(?:e[+-]?\d+)?[\w$]*\b/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};

// Oracle SQL & PL/SQL Grammar Definition
Prism.languages.sql = {
  'comment': [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true, greedy: true },
    { pattern: /(^|[^\\])--.*/, lookbehind: true, greedy: true }
  ],
  'string': {
    pattern: /q'\[[\s\S]*?\]'|q'\{[\s\S]*?\}'|q'<[\s\S]*?>'|q'\([\s\S]*?\)'|'(?:''|[^'\r\n])*'|"(?:""|[^"\r\n])*"/i,
    greedy: true
  },
  'function': /\b(?:NVL2?|COALESCE|NULLIF|DECODE|TO_CHAR|TO_DATE|TO_NUMBER|TO_TIMESTAMP|CAST|EXTRACT|SUBSTR|INSTR|LENGTH|LPAD|RPAD|TRIM|LTRIM|RTRIM|REPLACE|TRANSLATE|UPPER|LOWER|INITCAP|ROUND|TRUNC|MOD|CEIL|FLOOR|ABS|SIGN|ADD_MONTHS|MONTHS_BETWEEN|LAST_DAY|NEXT_DAY|SYSDATE|CURRENT_DATE|SYSTIMESTAMP|LOCALTIMESTAMP|COUNT|SUM|AVG|MIN|MAX|LISTAGG|ROW_NUMBER|RANK|DENSE_RANK|NTILE|LEAD|LAG|FIRST_VALUE|LAST_VALUE|NTH_VALUE|GROUPING|GROUPING_ID|SYS_CONNECT_BY_PATH|REGEXP_LIKE|REGEXP_SUBSTR|REGEXP_INSTR|REGEXP_REPLACE|REGEXP_COUNT|RAISE_APPLICATION_ERROR|SQLCODE|SQLERRM|DBMS_OUTPUT|PUT_LINE)\b/i,
  'keyword': /\b(?:SELECT|FROM|WHERE|GROUP|BY|HAVING|ORDER|ASC|DESC|NULLS|FIRST|LAST|FETCH|NEXT|ONLY|WITH|TIES|OFFSET|ROWS?|RANGE|UNBOUNDED|PRECEDING|FOLLOWING|CURRENT|DISTINCT|UNIQUE|ALL|AS|INTO|VALUES|SET|INSERT|UPDATE|DELETE|MERGE|USING|MATCHED|THEN|CREATE|OR|REPLACE|ALTER|DROP|TRUNCATE|RENAME|COMMENT|GRANT|REVOKE|COMMIT|ROLLBACK|SAVEPOINT|TRANSACTION|READ|WRITE|ISOLATION|LEVEL|SERIALIZABLE|TABLE|GLOBAL|TEMPORARY|EXTERNAL|ORGANIZATION|HEAP|INDEX|CLUSTER|VIEW|MATERIALIZED|SEQUENCE|SYNONYM|PUBLIC|PRIVATE|PRIMARY|FOREIGN|KEY|REFERENCES|CHECK|DEFAULT|GENERATED|ALWAYS|IDENTITY|ON|CASCADE|CONSTRAINT|ENABLE|DISABLE|VALIDATE|NOVALIDATE|DEFERRABLE|INITIALLY|DEFERRED|IMMEDIATE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|NATURAL|UNION|INTERSECT|MINUS|EXCEPT|IN|NOT|BETWEEN|LIKE|ESCAPE|IS|NULL|EXISTS|ANY|SOME|AND|CASE|WHEN|ELSE|END|OVER|PARTITION|WITHIN|ROLLUP|CUBE|SETS|PIVOT|UNPIVOT|START|CONNECT|PRIOR|NOCYCLE|SIBLINGS|LATERAL|APPLY|FOR|NOWAIT|WAIT|SKIP|LOCKED|RETURNING|DECLARE|BEGIN|EXCEPTION|OTHERS|CURSOR|OPEN|CLOSE|LOOP|WHILE|EXIT|CONTINUE|REVERSE|IF|ELSIF|PROCEDURE|FUNCTION|RETURN|PACKAGE|BODY|TRIGGER|BEFORE|AFTER|INSTEAD|OF|EACH|COMPOUND|STATEMENT|PRAGMA|AUTONOMOUS_TRANSACTION|EXCEPTION_INIT|SERIALLY_REUSABLE|AUTHID|DEFINER|CURRENT_USER|DETERMINISTIC|RESULT_CACHE|NOCOPY|OUT|TYPE|RECORD|VARRAY|BULK|COLLECT|LIMIT|FORALL|INDICES|SAVE|EXCEPTIONS|EXECUTE|RAISE|ROWTYPE|FOUND|NOTFOUND|ROWCOUNT|ISOPEN|BULK_EXCEPTIONS|ROWID|ROWNUM|DUAL|NUMBER|VARCHAR2|CHAR|NVARCHAR2|DATE|TIMESTAMP|CLOB|BLOB|RAW|PLS_INTEGER|BINARY_INTEGER|BOOLEAN|SYS_REFCURSOR)\b/i,
  'boolean': /\b(?:TRUE|FALSE|NULL)\b/i,
  'number': /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  'operator': /:=|=>|\|\||!=|<>|<=|>=|[=<>+\-*/%]/,
  'punctuation': /[{}[\];(),.:]/
};

if (typeof window !== 'undefined') {
  window.Prism = Prism;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}
