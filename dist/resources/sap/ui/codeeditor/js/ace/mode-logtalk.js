ace.define("ace/mode/logtalk_highlight_rules",[],function(e,t,o){"use strict";var n=e("../lib/oop");var r=e("./text_highlight_rules").TextHighlightRules;var i=function(){this.$rules={start:[{token:"punctuation.definition.comment.logtalk",regex:"/\\*",push:[{token:"punctuation.definition.comment.logtalk",regex:"\\*/",next:"pop"},{defaultToken:"comment.block.logtalk"}]},{todo:"fix grouping",token:["comment.line.percentage.logtalk","punctuation.definition.comment.logtalk"],regex:"%.*$\\n?"},{todo:"fix grouping",token:["storage.type.opening.logtalk","punctuation.definition.storage.type.logtalk"],regex:":-\\s(?:object|protocol|category|module)(?=[(])"},{todo:"fix grouping",token:["storage.type.closing.logtalk","punctuation.definition.storage.type.logtalk"],regex:":-\\send_(?:object|protocol|category)(?=[.])"},{caseInsensitive:false,token:"storage.type.relations.logtalk",regex:"\\b(?:complements|extends|i(?:nstantiates|mp(?:orts|lements))|specializes)(?=[(])"},{caseInsensitive:false,todo:"fix grouping",token:["storage.modifier.others.logtalk","punctuation.definition.storage.modifier.logtalk"],regex:":-\\s(?:e(?:lse|ndif)|built_in|dynamic|synchronized|threaded)(?=[.])"},{caseInsensitive:false,todo:"fix grouping",token:["storage.modifier.others.logtalk","punctuation.definition.storage.modifier.logtalk"],regex:":-\\s(?:c(?:alls|oinductive)|e(?:lif|n(?:coding|sure_loaded)|xport)|i(?:f|n(?:clude|itialization|fo))|reexport|set_(?:logtalk|prolog)_flag|uses)(?=[(])"},{caseInsensitive:false,todo:"fix grouping",token:["storage.modifier.others.logtalk","punctuation.definition.storage.modifier.logtalk"],regex:":-\\s(?:alias|info|d(?:ynamic|iscontiguous)|m(?:eta_(?:non_terminal|predicate)|ode|ultifile)|p(?:ublic|r(?:otected|ivate))|op|use(?:s|_module)|synchronized)(?=[(])"},{token:"keyword.operator.message-sending.logtalk",regex:"(:|::|\\^\\^)"},{token:"keyword.operator.external-call.logtalk",regex:"([{}])"},{token:"keyword.operator.mode.logtalk",regex:"(\\?|@)"},{token:"keyword.operator.comparison.term.logtalk",regex:"(@=<|@<|@>|@>=|==|\\\\==)"},{token:"keyword.operator.comparison.arithmetic.logtalk",regex:"(=<|<|>|>=|=:=|=\\\\=)"},{token:"keyword.operator.bitwise.logtalk",regex:"(<<|>>|/\\\\|\\\\/|\\\\)"},{token:"keyword.operator.evaluable.logtalk",regex:"\\b(?:e|pi|div|mod|rem)\\b(?![-!(^~])"},{token:"keyword.operator.evaluable.logtalk",regex:"(\\*\\*|\\+|-|\\*|/|//)"},{token:"keyword.operator.misc.logtalk",regex:"(:-|!|\\\\+|,|;|--\x3e|->|=|\\=|\\.|=\\.\\.|\\^|\\bas\\b|\\bis\\b)"},{caseInsensitive:false,token:"support.function.evaluable.logtalk",regex:"\\b(a(bs|cos|sin|tan|tan2)|c(eiling|os)|div|exp|flo(at(_(integer|fractional)_part)?|or)|log|m(ax|in|od)|r(em|ound)|s(i(n|gn)|qrt)|t(an|runcate)|xor)(?=[(])"},{token:"support.function.control.logtalk",regex:"\\b(?:true|fa(?:il|lse)|repeat|(?:instantiation|system)_error)\\b(?![-!(^~])"},{token:"support.function.control.logtalk",regex:"\\b((?:type|domain|existence|permission|representation|evaluation|resource|syntax)_error)(?=[(])"},{token:"support.function.control.logtalk",regex:"\\b(?:ca(?:ll|tch)|ignore|throw|once)(?=[(])"},{token:"support.function.chars-and-bytes-io.logtalk",regex:"\\b(?:(?:get|p(?:eek|ut))_(c(?:har|ode)|byte)|nl)(?=[(])"},{token:"support.function.chars-and-bytes-io.logtalk",regex:"\\bnl\\b"},{token:"support.function.atom-term-processing.logtalk",regex:"\\b(?:atom_(?:length|c(?:hars|o(?:ncat|des)))|sub_atom|char_code|number_c(?:har|ode)s)(?=[(])"},{caseInsensitive:false,token:"support.function.term-testing.logtalk",regex:"\\b(?:var|atom(ic)?|integer|float|c(?:allable|ompound)|n(?:onvar|umber)|ground|acyclic_term)(?=[(])"},{token:"support.function.term-comparison.logtalk",regex:"\\b(compare)(?=[(])"},{token:"support.function.term-io.logtalk",regex:"\\b(?:read(_term)?|write(?:q|_(?:canonical|term))?|(current_)?(?:char_conversion|op))(?=[(])"},{caseInsensitive:false,token:"support.function.term-creation-and-decomposition.logtalk",regex:"\\b(arg|copy_term|functor|numbervars|term_variables)(?=[(])"},{caseInsensitive:false,token:"support.function.term-unification.logtalk",regex:"\\b(subsumes_term|unify_with_occurs_check)(?=[(])"},{caseInsensitive:false,token:"support.function.stream-selection-and-control.logtalk",regex:"\\b(?:(?:se|curren)t_(?:in|out)put|open|close|flush_output|stream_property|at_end_of_stream|set_stream_position)(?=[(])"},{token:"support.function.stream-selection-and-control.logtalk",regex:"\\b(?:flush_output|at_end_of_stream)\\b"},{token:"support.function.prolog-flags.logtalk",regex:"\\b((?:se|curren)t_prolog_flag)(?=[(])"},{token:"support.function.compiling-and-loading.logtalk",regex:"\\b(logtalk_(?:compile|l(?:ibrary_path|oad|oad_context)|make(_target_action)?))(?=[(])"},{token:"support.function.compiling-and-loading.logtalk",regex:"\\b(logtalk_make)\\b"},{caseInsensitive:false,token:"support.function.event-handling.logtalk",regex:"\\b(?:(?:abolish|define)_events|current_event)(?=[(])"},{token:"support.function.implementation-defined-hooks.logtalk",regex:"\\b(?:(?:create|current|set)_logtalk_flag|halt)(?=[(])"},{token:"support.function.implementation-defined-hooks.logtalk",regex:"\\b(halt)\\b"},{token:"support.function.sorting.logtalk",regex:"\\b((key)?(sort))(?=[(])"},{caseInsensitive:false,token:"support.function.entity-creation-and-abolishing.logtalk",regex:"\\b((c(?:reate|urrent)|abolish)_(?:object|protocol|category))(?=[(])"},{caseInsensitive:false,token:"support.function.reflection.logtalk",regex:"\\b((object|protocol|category)_property|co(mplements_object|nforms_to_protocol)|extends_(object|protocol|category)|imp(orts_category|lements_protocol)|(instantiat|specializ)es_class)(?=[(])"},{token:"support.function.logtalk",regex:"\\b((?:for|retract)all)(?=[(])"},{caseInsensitive:false,token:"support.function.execution-context.logtalk",regex:"\\b(?:context|parameter|se(?:lf|nder)|this)(?=[(])"},{token:"support.function.database.logtalk",regex:"\\b(?:a(?:bolish|ssert(?:a|z))|clause|retract(all)?)(?=[(])"},{token:"support.function.all-solutions.logtalk",regex:"\\b((?:bag|set)of|f(?:ind|or)all)(?=[(])"},{caseInsensitive:false,token:"support.function.multi-threading.logtalk",regex:"\\b(threaded(_(call|once|ignore|exit|peek|wait|notify))?)(?=[(])"},{caseInsensitive:false,token:"support.function.engines.logtalk",regex:"\\b(threaded_engine(_(create|destroy|self|next(?:_reified)?|yield|post|fetch))?)(?=[(])"},{caseInsensitive:false,token:"support.function.reflection.logtalk",regex:"\\b(?:current_predicate|predicate_property)(?=[(])"},{token:"support.function.event-handler.logtalk",regex:"\\b(?:before|after)(?=[(])"},{token:"support.function.message-forwarding-handler.logtalk",regex:"\\b(forward)(?=[(])"},{token:"support.function.grammar-rule.logtalk",regex:"\\b(?:expand_(?:goal|term)|(?:goal|term)_expansion|phrase)(?=[(])"},{token:"punctuation.definition.string.begin.logtalk",regex:"'",push:[{token:"constant.character.escape.logtalk",regex:"\\\\([\\\\abfnrtv\"']|(x[a-fA-F0-9]+|[0-7]+)\\\\)"},{token:"punctuation.definition.string.end.logtalk",regex:"'",next:"pop"},{defaultToken:"string.quoted.single.logtalk"}]},{token:"punctuation.definition.string.begin.logtalk",regex:'"',push:[{token:"constant.character.escape.logtalk",regex:"\\\\."},{token:"punctuation.definition.string.end.logtalk",regex:'"',next:"pop"},{defaultToken:"string.quoted.double.logtalk"}]},{token:"constant.numeric.logtalk",regex:"\\b(0b[0-1]+|0o[0-7]+|0x[0-9a-fA-F]+)\\b"},{token:"constant.numeric.logtalk",regex:"\\b(0'\\\\.|0'.|0''|0'\")"},{token:"constant.numeric.logtalk",regex:"\\b(\\d+\\.?\\d*((e|E)(\\+|-)?\\d+)?)\\b"},{token:"variable.other.logtalk",regex:"\\b([A-Z_][A-Za-z0-9_]*)\\b"}]};this.normalizeRules()};n.inherits(i,r);t.LogtalkHighlightRules=i});ace.define("ace/mode/folding/cstyle",[],function(e,t,o){"use strict";var n=e("../../lib/oop");var r=e("../../range").Range;var i=e("./fold_mode").FoldMode;var a=t.FoldMode=function(e){if(e){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end))}};n.inherits(a,i);(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/;this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/;this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/;this._getFoldWidgetBase=this.getFoldWidget;this.getFoldWidget=function(e,t,o){var n=e.getLine(o);if(this.singleLineBlockCommentRe.test(n)){if(!this.startRegionRe.test(n)&&!this.tripleStarBlockCommentRe.test(n))return""}var r=this._getFoldWidgetBase(e,t,o);if(!r&&this.startRegionRe.test(n))return"start";return r};this.getFoldWidgetRange=function(e,t,o,n){var r=e.getLine(o);if(this.startRegionRe.test(r))return this.getCommentRegionBlock(e,r,o);var i=r.match(this.foldingStartMarker);if(i){var a=i.index;if(i[1])return this.openingBracketBlock(e,i[1],o,a);var l=e.getCommentFoldRange(o,a+i[0].length,1);if(l&&!l.isMultiLine()){if(n){l=this.getSectionRange(e,o)}else if(t!="all")l=null}return l}if(t==="markbegin")return;var i=r.match(this.foldingStopMarker);if(i){var a=i.index+i[0].length;if(i[1])return this.closingBracketBlock(e,i[1],o,a);return e.getCommentFoldRange(o,a,-1)}};this.getSectionRange=function(e,t){var o=e.getLine(t);var n=o.search(/\S/);var i=t;var a=o.length;t=t+1;var l=t;var s=e.getLength();while(++t<s){o=e.getLine(t);var g=o.search(/\S/);if(g===-1)continue;if(n>g)break;var c=this.getFoldWidgetRange(e,"all",t);if(c){if(c.start.row<=i){break}else if(c.isMultiLine()){t=c.end.row}else if(n==g){break}}l=t}return new r(i,a,l,e.getLine(l).length)};this.getCommentRegionBlock=function(e,t,o){var n=t.search(/\s*$/);var i=e.getLength();var a=o;var l=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;var s=1;while(++o<i){t=e.getLine(o);var g=l.exec(t);if(!g)continue;if(g[1])s--;else s++;if(!s)break}var c=o;if(c>a){return new r(a,n,c,t.length)}}}).call(a.prototype)});ace.define("ace/mode/logtalk",[],function(e,t,o){"use strict";var n=e("../lib/oop");var r=e("./text").Mode;var i=e("../tokenizer").Tokenizer;var a=e("./logtalk_highlight_rules").LogtalkHighlightRules;var l=e("./folding/cstyle").FoldMode;var s=function(){this.HighlightRules=a;this.foldingRules=new l;this.$behaviour=this.$defaultBehaviour};n.inherits(s,r);(function(){this.lineCommentStart="%";this.blockComment={start:"/*",end:"*/"};this.$id="ace/mode/logtalk"}).call(s.prototype);t.Mode=s});(function(){ace.require(["ace/mode/logtalk"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();