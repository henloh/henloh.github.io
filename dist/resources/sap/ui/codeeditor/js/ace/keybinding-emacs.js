ace.define("ace/occur",[],function(e,n,t){"use strict";var r=e("./lib/oop");var a=e("./range").Range;var i=e("./search").Search;var s=e("./edit_session").EditSession;var o=e("./search_highlight").SearchHighlight;function c(){}r.inherits(c,i);(function(){this.enter=function(e,n){if(!n.needle)return false;var t=e.getCursorPosition();this.displayOccurContent(e,n);var r=this.originalToOccurPosition(e.session,t);e.moveCursorToPosition(r);return true};this.exit=function(e,n){var t=n.translatePosition&&e.getCursorPosition();var r=t&&this.occurToOriginalPosition(e.session,t);this.displayOriginalContent(e);if(r)e.moveCursorToPosition(r);return true};this.highlight=function(e,n){var t=e.$occurHighlight=e.$occurHighlight||e.addDynamicMarker(new o(null,"ace_occur-highlight","text"));t.setRegexp(n);e._emit("changeBackMarker")};this.displayOccurContent=function(e,n){this.$originalSession=e.session;var t=this.matchingLines(e.session,n);var r=t.map(function(e){return e.content});var a=new s(r.join("\n"));a.$occur=this;a.$occurMatchingLines=t;e.setSession(a);this.$useEmacsStyleLineStart=this.$originalSession.$useEmacsStyleLineStart;a.$useEmacsStyleLineStart=this.$useEmacsStyleLineStart;this.highlight(a,n.re);a._emit("changeBackMarker")};this.displayOriginalContent=function(e){e.setSession(this.$originalSession);this.$originalSession.$useEmacsStyleLineStart=this.$useEmacsStyleLineStart};this.originalToOccurPosition=function(e,n){var t=e.$occurMatchingLines;var r={row:0,column:0};if(!t)return r;for(var a=0;a<t.length;a++){if(t[a].row===n.row)return{row:a,column:n.column}}return r};this.occurToOriginalPosition=function(e,n){var t=e.$occurMatchingLines;if(!t||!t[n.row])return n;return{row:t[n.row].row,column:n.column}};this.matchingLines=function(e,n){n=r.mixin({},n);if(!e||!n.needle)return[];var t=new i;t.set(n);return t.findAll(e).reduce(function(n,t){var r=t.start.row;var a=n[n.length-1];return a&&a.row===r?n:n.concat({row:r,content:e.getLine(r)})},[])}}).call(c.prototype);var l=e("./lib/dom");l.importCssString(".ace_occur-highlight {\n    border-radius: 4px;\n    background-color: rgba(87, 255, 8, 0.25);\n    position: absolute;\n    z-index: 4;\n    box-sizing: border-box;\n    box-shadow: 0 0 4px rgb(91, 255, 50);\n}\n.ace_dark .ace_occur-highlight {\n    background-color: rgb(80, 140, 85);\n    box-shadow: 0 0 4px rgb(60, 120, 70);\n}\n","incremental-occur-highlighting",false);n.Occur=c});ace.define("ace/commands/occur_commands",[],function(e,n,t){var r=e("../config"),a=e("../occur").Occur;var i={name:"occur",exec:function(e,n){var t=!!e.session.$occur;var r=(new a).enter(e,n);if(r&&!t)l.installIn(e)},readOnly:true};var s=[{name:"occurexit",bindKey:"esc|Ctrl-G",exec:function(e){var n=e.session.$occur;if(!n)return;n.exit(e,{});if(!e.session.$occur)l.uninstallFrom(e)},readOnly:true},{name:"occuraccept",bindKey:"enter",exec:function(e){var n=e.session.$occur;if(!n)return;n.exit(e,{translatePosition:true});if(!e.session.$occur)l.uninstallFrom(e)},readOnly:true}];var o=e("../keyboard/hash_handler").HashHandler;var c=e("../lib/oop");function l(){}c.inherits(l,o);(function(){this.isOccurHandler=true;this.attach=function(e){o.call(this,s,e.commands.platform);this.$editor=e};var e=this.handleKeyboard;this.handleKeyboard=function(n,t,r,a){var i=e.call(this,n,t,r,a);return i&&i.command?i:undefined}}).call(l.prototype);l.installIn=function(e){var n=new this;e.keyBinding.addKeyboardHandler(n);e.commands.addCommands(s)};l.uninstallFrom=function(e){e.commands.removeCommands(s);var n=e.getKeyboardHandler();if(n.isOccurHandler)e.keyBinding.removeKeyboardHandler(n)};n.occurStartCommand=i});ace.define("ace/commands/incremental_search_commands",[],function(e,n,t){var r=e("../config");var a=e("../lib/oop");var i=e("../keyboard/hash_handler").HashHandler;var s=e("./occur_commands").occurStartCommand;n.iSearchStartCommands=[{name:"iSearch",bindKey:{win:"Ctrl-F",mac:"Command-F"},exec:function(e,n){r.loadModule(["core","ace/incremental_search"],function(t){var r=t.iSearch=t.iSearch||new t.IncrementalSearch;r.activate(e,n.backwards);if(n.jumpToFirstMatch)r.next(n)})},readOnly:true},{name:"iSearchBackwards",exec:function(e,n){e.execCommand("iSearch",{backwards:true})},readOnly:true},{name:"iSearchAndGo",bindKey:{win:"Ctrl-K",mac:"Command-G"},exec:function(e,n){e.execCommand("iSearch",{jumpToFirstMatch:true,useCurrentOrPrevSearch:true})},readOnly:true},{name:"iSearchBackwardsAndGo",bindKey:{win:"Ctrl-Shift-K",mac:"Command-Shift-G"},exec:function(e){e.execCommand("iSearch",{jumpToFirstMatch:true,backwards:true,useCurrentOrPrevSearch:true})},readOnly:true}];n.iSearchCommands=[{name:"restartSearch",bindKey:{win:"Ctrl-F",mac:"Command-F"},exec:function(e){e.cancelSearch(true)}},{name:"searchForward",bindKey:{win:"Ctrl-S|Ctrl-K",mac:"Ctrl-S|Command-G"},exec:function(e,n){n.useCurrentOrPrevSearch=true;e.next(n)}},{name:"searchBackward",bindKey:{win:"Ctrl-R|Ctrl-Shift-K",mac:"Ctrl-R|Command-Shift-G"},exec:function(e,n){n.useCurrentOrPrevSearch=true;n.backwards=true;e.next(n)}},{name:"extendSearchTerm",exec:function(e,n){e.addString(n)}},{name:"extendSearchTermSpace",bindKey:"space",exec:function(e){e.addString(" ")}},{name:"shrinkSearchTerm",bindKey:"backspace",exec:function(e){e.removeChar()}},{name:"confirmSearch",bindKey:"return",exec:function(e){e.deactivate()}},{name:"cancelSearch",bindKey:"esc|Ctrl-G",exec:function(e){e.deactivate(true)}},{name:"occurisearch",bindKey:"Ctrl-O",exec:function(e){var n=a.mixin({},e.$options);e.deactivate();s.exec(e.$editor,n)}},{name:"yankNextWord",bindKey:"Ctrl-w",exec:function(e){var n=e.$editor,t=n.selection.getRangeOfMovements(function(e){e.moveCursorWordRight()}),r=n.session.getTextRange(t);e.addString(r)}},{name:"yankNextChar",bindKey:"Ctrl-Alt-y",exec:function(e){var n=e.$editor,t=n.selection.getRangeOfMovements(function(e){e.moveCursorRight()}),r=n.session.getTextRange(t);e.addString(r)}},{name:"recenterTopBottom",bindKey:"Ctrl-l",exec:function(e){e.$editor.execCommand("recenterTopBottom")}},{name:"selectAllMatches",bindKey:"Ctrl-space",exec:function(e){var n=e.$editor,t=n.session.$isearchHighlight,r=t&&t.cache?t.cache.reduce(function(e,n){return e.concat(n?n:[])},[]):[];e.deactivate(false);r.forEach(n.selection.addRange.bind(n.selection))}},{name:"searchAsRegExp",bindKey:"Alt-r",exec:function(e){e.convertNeedleToRegExp()}}].map(function(e){e.readOnly=true;e.isIncrementalSearchCommand=true;e.scrollIntoView="animate-cursor";return e});function o(e){this.$iSearch=e}a.inherits(o,i);(function(){this.attach=function(e){var t=this.$iSearch;i.call(this,n.iSearchCommands,e.commands.platform);this.$commandExecHandler=e.commands.on("exec",function(n){if(!n.command.isIncrementalSearchCommand)return t.deactivate();n.stopPropagation();n.preventDefault();var r=e.session.getScrollTop();var a=n.command.exec(t,n.args||{});e.renderer.scrollCursorIntoView(null,.5);e.renderer.animateScrolling(r);return a})};this.detach=function(e){if(!this.$commandExecHandler)return;e.commands.off("exec",this.$commandExecHandler);delete this.$commandExecHandler};var e=this.handleKeyboard;this.handleKeyboard=function(n,t,r,a){if((t===1||t===8)&&r==="v"||t===1&&r==="y")return null;var i=e.call(this,n,t,r,a);if(i&&i.command){return i}if(t==-1){var s=this.commands.extendSearchTerm;if(s){return{command:s,args:r}}}return false}}).call(o.prototype);n.IncrementalSearchKeyboardHandler=o});ace.define("ace/incremental_search",[],function(e,n,t){"use strict";var r=e("./lib/oop");var a=e("./range").Range;var i=e("./search").Search;var s=e("./search_highlight").SearchHighlight;var o=e("./commands/incremental_search_commands");var c=o.IncrementalSearchKeyboardHandler;function l(){this.$options={wrap:false,skipCurrent:false};this.$keyboardHandler=new c(this)}r.inherits(l,i);function d(e){return e instanceof RegExp}function u(e){var n=String(e),t=n.indexOf("/"),r=n.lastIndexOf("/");return{expression:n.slice(t+1,r),flags:n.slice(r+1)}}function h(e,n){try{return new RegExp(e,n)}catch(n){return e}}function m(e){return h(e.expression,e.flags)}(function(){this.activate=function(e,n){this.$editor=e;this.$startPos=this.$currentPos=e.getCursorPosition();this.$options.needle="";this.$options.backwards=n;e.keyBinding.addKeyboardHandler(this.$keyboardHandler);this.$originalEditorOnPaste=e.onPaste;e.onPaste=this.onPaste.bind(this);this.$mousedownHandler=e.on("mousedown",this.onMouseDown.bind(this));this.selectionFix(e);this.statusMessage(true)};this.deactivate=function(e){this.cancelSearch(e);var n=this.$editor;n.keyBinding.removeKeyboardHandler(this.$keyboardHandler);if(this.$mousedownHandler){n.off("mousedown",this.$mousedownHandler);delete this.$mousedownHandler}n.onPaste=this.$originalEditorOnPaste;this.message("")};this.selectionFix=function(e){if(e.selection.isEmpty()&&!e.session.$emacsMark){e.clearSelection()}};this.highlight=function(e){var n=this.$editor.session,t=n.$isearchHighlight=n.$isearchHighlight||n.addDynamicMarker(new s(null,"ace_isearch-result","text"));t.setRegexp(e);n._emit("changeBackMarker")};this.cancelSearch=function(e){var n=this.$editor;this.$prevNeedle=this.$options.needle;this.$options.needle="";if(e){n.moveCursorToPosition(this.$startPos);this.$currentPos=this.$startPos}else{n.pushEmacsMark&&n.pushEmacsMark(this.$startPos,false)}this.highlight(null);return a.fromPoints(this.$currentPos,this.$currentPos)};this.highlightAndFindWithNeedle=function(e,n){if(!this.$editor)return null;var t=this.$options;if(n){t.needle=n.call(this,t.needle||"")||""}if(t.needle.length===0){this.statusMessage(true);return this.cancelSearch(true)}t.start=this.$currentPos;var r=this.$editor.session,i=this.find(r),s=this.$editor.emacsMark?!!this.$editor.emacsMark():!this.$editor.selection.isEmpty();if(i){if(t.backwards)i=a.fromPoints(i.end,i.start);this.$editor.selection.setRange(a.fromPoints(s?this.$startPos:i.end,i.end));if(e)this.$currentPos=i.end;this.highlight(t.re)}this.statusMessage(i);return i};this.addString=function(e){return this.highlightAndFindWithNeedle(false,function(n){if(!d(n))return n+e;var t=u(n);t.expression+=e;return m(t)})};this.removeChar=function(e){return this.highlightAndFindWithNeedle(false,function(e){if(!d(e))return e.substring(0,e.length-1);var n=u(e);n.expression=n.expression.substring(0,n.expression.length-1);return m(n)})};this.next=function(e){e=e||{};this.$options.backwards=!!e.backwards;this.$currentPos=this.$editor.getCursorPosition();return this.highlightAndFindWithNeedle(true,function(n){return e.useCurrentOrPrevSearch&&n.length===0?this.$prevNeedle||"":n})};this.onMouseDown=function(e){this.deactivate();return true};this.onPaste=function(e){this.addString(e)};this.convertNeedleToRegExp=function(){return this.highlightAndFindWithNeedle(false,function(e){return d(e)?e:h(e,"ig")})};this.convertNeedleToString=function(){return this.highlightAndFindWithNeedle(false,function(e){return d(e)?u(e).expression:e})};this.statusMessage=function(e){var n=this.$options,t="";t+=n.backwards?"reverse-":"";t+="isearch: "+n.needle;t+=e?"":" (not found)";this.message(t)};this.message=function(e){if(this.$editor.showCommandLine){this.$editor.showCommandLine(e);this.$editor.focus()}}}).call(l.prototype);n.IncrementalSearch=l;var g=e("./lib/dom");g.importCssString(".ace_marker-layer .ace_isearch-result {  position: absolute;  z-index: 6;  box-sizing: border-box;}div.ace_isearch-result {  border-radius: 4px;  background-color: rgba(255, 200, 0, 0.5);  box-shadow: 0 0 4px rgb(255, 200, 0);}.ace_dark div.ace_isearch-result {  background-color: rgb(100, 110, 160);  box-shadow: 0 0 4px rgb(80, 90, 140);}","incremental-search-highlighting",false);var f=e("./commands/command_manager");(function(){this.setupIncrementalSearch=function(e,n){if(this.usesIncrementalSearch==n)return;this.usesIncrementalSearch=n;var t=o.iSearchStartCommands;var r=n?"addCommands":"removeCommands";this[r](t)}}).call(f.CommandManager.prototype);var p=e("./editor").Editor;e("./config").defineOptions(p.prototype,"editor",{useIncrementalSearch:{set:function(e){this.keyBinding.$handlers.forEach(function(n){if(n.setupIncrementalSearch){n.setupIncrementalSearch(this,e)}});this._emit("incrementalSearchSettingChanged",{isEnabled:e})}}})});ace.define("ace/keyboard/emacs",[],function(e,n,t){"use strict";var r=e("../lib/dom");e("../incremental_search");var a=e("../commands/incremental_search_commands");var i=e("./hash_handler").HashHandler;n.handler=new i;n.handler.isEmacs=true;n.handler.$id="ace/keyboard/emacs";var s=false;var o;var c;n.handler.attach=function(e){if(!s){s=true;r.importCssString("            .emacs-mode .ace_cursor{                border: 1px rgba(50,250,50,0.8) solid!important;                box-sizing: border-box!important;                background-color: rgba(0,250,0,0.9);                opacity: 0.5;            }            .emacs-mode .ace_hidden-cursors .ace_cursor{                opacity: 1;                background-color: transparent;            }            .emacs-mode .ace_overwrite-cursors .ace_cursor {                opacity: 1;                background-color: transparent;                border-width: 0 0 2px 2px !important;            }            .emacs-mode .ace_text-layer {                z-index: 4            }            .emacs-mode .ace_cursor-layer {                z-index: 2            }","emacsMode")}o=e.session.$selectLongWords;e.session.$selectLongWords=true;c=e.session.$useEmacsStyleLineStart;e.session.$useEmacsStyleLineStart=true;e.session.$emacsMark=null;e.session.$emacsMarkRing=e.session.$emacsMarkRing||[];e.emacsMark=function(){return this.session.$emacsMark};e.setEmacsMark=function(e){this.session.$emacsMark=e};e.pushEmacsMark=function(e,n){var t=this.session.$emacsMark;if(t)this.session.$emacsMarkRing.push(t);if(!e||n)this.setEmacsMark(e);else this.session.$emacsMarkRing.push(e)};e.popEmacsMark=function(){var e=this.emacsMark();if(e){this.setEmacsMark(null);return e}return this.session.$emacsMarkRing.pop()};e.getLastEmacsMark=function(e){return this.session.$emacsMark||this.session.$emacsMarkRing.slice(-1)[0]};e.emacsMarkForSelection=function(e){var n=this.selection,t=this.multiSelect?this.multiSelect.getAllRanges().length:1,r=n.index||0,a=this.session.$emacsMarkRing,i=a.length-(t-r),s=a[i]||n.anchor;if(e){a.splice(i,1,"row"in e&&"column"in e?e:undefined)}return s};e.on("click",d);e.on("changeSession",l);e.renderer.$blockCursor=true;e.setStyle("emacs-mode");e.commands.addCommands(g);n.handler.platform=e.commands.platform;e.$emacsModeHandler=this;e.on("copy",this.onCopy);e.on("paste",this.onPaste)};n.handler.detach=function(e){e.renderer.$blockCursor=false;e.session.$selectLongWords=o;e.session.$useEmacsStyleLineStart=c;e.off("click",d);e.off("changeSession",l);e.unsetStyle("emacs-mode");e.commands.removeCommands(g);e.off("copy",this.onCopy);e.off("paste",this.onPaste);e.$emacsModeHandler=null};var l=function(e){if(e.oldSession){e.oldSession.$selectLongWords=o;e.oldSession.$useEmacsStyleLineStart=c}o=e.session.$selectLongWords;e.session.$selectLongWords=true;c=e.session.$useEmacsStyleLineStart;e.session.$useEmacsStyleLineStart=true;if(!e.session.hasOwnProperty("$emacsMark"))e.session.$emacsMark=null;if(!e.session.hasOwnProperty("$emacsMarkRing"))e.session.$emacsMarkRing=[]};var d=function(e){e.editor.session.$emacsMark=null};var u=e("../lib/keys").KEY_MODS;var h={C:"ctrl",S:"shift",M:"alt",CMD:"command"};var m=["C-S-M-CMD","S-M-CMD","C-M-CMD","C-S-CMD","C-S-M","M-CMD","S-CMD","S-M","C-CMD","C-M","C-S","CMD","M","S","C"];m.forEach(function(e){var n=0;e.split("-").forEach(function(e){n=n|u[h[e]]});h[n]=e.toLowerCase()+"-"});n.handler.onCopy=function(e,t){if(t.$handlesEmacsOnCopy)return;t.$handlesEmacsOnCopy=true;n.handler.commands.killRingSave.exec(t);t.$handlesEmacsOnCopy=false};n.handler.onPaste=function(e,n){n.pushEmacsMark(n.getCursorPosition())};n.handler.bindKey=function(e,n){if(typeof e=="object")e=e[this.platform];if(!e)return;var t=this.commandKeyBinding;e.split("|").forEach(function(e){e=e.toLowerCase();t[e]=n;var r=e.split(" ").slice(0,-1);r.reduce(function(e,n,t){var r=e[t-1]?e[t-1]+" ":"";return e.concat([r+n])},[]).forEach(function(e){if(!t[e])t[e]="null"})},this)};n.handler.getStatusText=function(e,n){var t="";if(n.count)t+=n.count;if(n.keyChain)t+=" "+n.keyChain;return t};n.handler.handleKeyboard=function(e,n,t,r){if(r===-1)return undefined;var a=e.editor;a._signal("changeStatus");if(n==-1){a.pushEmacsMark();if(e.count){var i=new Array(e.count+1).join(t);e.count=null;return{command:"insertstring",args:i}}}var s=h[n];if(s=="c-"||e.count){var o=parseInt(t[t.length-1]);if(typeof o==="number"&&!isNaN(o)){e.count=Math.max(e.count,0)||0;e.count=10*e.count+o;return{command:"null"}}}if(s)t=s+t;if(e.keyChain)t=e.keyChain+=" "+t;var c=this.commandKeyBinding[t];e.keyChain=c=="null"?t:"";if(!c)return undefined;if(c==="null")return{command:"null"};if(c==="universalArgument"){e.count=-4;return{command:"null"}}var l;if(typeof c!=="string"){l=c.args;if(c.command)c=c.command;if(c==="goorselect"){c=a.emacsMark()?l[1]:l[0];l=null}}if(typeof c==="string"){if(c==="insertstring"||c==="splitline"||c==="togglecomment"){a.pushEmacsMark()}c=this.commands[c]||a.commands.commands[c];if(!c)return undefined}if(!c.readOnly&&!c.isYank)e.lastCommand=null;if(!c.readOnly&&a.emacsMark())a.setEmacsMark(null);if(e.count){var o=e.count;e.count=0;if(!c||!c.handlesCount){return{args:l,command:{exec:function(e,n){for(var t=0;t<o;t++)c.exec(e,n)},multiSelectAction:c.multiSelectAction}}}else{if(!l)l={};if(typeof l==="object")l.count=o}}return{command:c,args:l}};n.emacsKeys={"Up|C-p":{command:"goorselect",args:["golineup","selectup"]},"Down|C-n":{command:"goorselect",args:["golinedown","selectdown"]},"Left|C-b":{command:"goorselect",args:["gotoleft","selectleft"]},"Right|C-f":{command:"goorselect",args:["gotoright","selectright"]},"C-Left|M-b":{command:"goorselect",args:["gotowordleft","selectwordleft"]},"C-Right|M-f":{command:"goorselect",args:["gotowordright","selectwordright"]},"Home|C-a":{command:"goorselect",args:["gotolinestart","selecttolinestart"]},"End|C-e":{command:"goorselect",args:["gotolineend","selecttolineend"]},"C-Home|S-M-,":{command:"goorselect",args:["gotostart","selecttostart"]},"C-End|S-M-.":{command:"goorselect",args:["gotoend","selecttoend"]},"S-Up|S-C-p":"selectup","S-Down|S-C-n":"selectdown","S-Left|S-C-b":"selectleft","S-Right|S-C-f":"selectright","S-C-Left|S-M-b":"selectwordleft","S-C-Right|S-M-f":"selectwordright","S-Home|S-C-a":"selecttolinestart","S-End|S-C-e":"selecttolineend","S-C-Home":"selecttostart","S-C-End":"selecttoend","C-l":"recenterTopBottom","M-s":"centerselection","M-g":"gotoline","C-x C-p":"selectall","C-Down":{command:"goorselect",args:["gotopagedown","selectpagedown"]},"C-Up":{command:"goorselect",args:["gotopageup","selectpageup"]},"PageDown|C-v":{command:"goorselect",args:["gotopagedown","selectpagedown"]},"PageUp|M-v":{command:"goorselect",args:["gotopageup","selectpageup"]},"S-C-Down":"selectpagedown","S-C-Up":"selectpageup","C-s":"iSearch","C-r":"iSearchBackwards","M-C-s":"findnext","M-C-r":"findprevious","S-M-5":"replace",Backspace:"backspace","Delete|C-d":"del","Return|C-m":{command:"insertstring",args:"\n"},"C-o":"splitline","M-d|C-Delete":{command:"killWord",args:"right"},"C-Backspace|M-Backspace|M-Delete":{command:"killWord",args:"left"},"C-k":"killLine","C-y|S-Delete":"yank","M-y":"yankRotate","C-g":"keyboardQuit","C-w|C-S-W":"killRegion","M-w":"killRingSave","C-Space":"setMark","C-x C-x":"exchangePointAndMark","C-t":"transposeletters","M-u":"touppercase","M-l":"tolowercase","M-/":"autocomplete","C-u":"universalArgument","M-;":"togglecomment","C-/|C-x u|S-C--|C-z":"undo","S-C-/|S-C-x u|C--|S-C-z":"redo","C-x r":"selectRectangularRegion","M-x":{command:"focusCommandLine",args:"M-x "}};n.handler.bindKeys(n.emacsKeys);n.handler.addCommands({recenterTopBottom:function(e){var n=e.renderer;var t=n.$cursorLayer.getPixelPosition();var r=n.$size.scrollerHeight-n.lineHeight;var a=n.scrollTop;if(Math.abs(t.top-a)<2){a=t.top-r}else if(Math.abs(t.top-a-r*.5)<2){a=t.top}else{a=t.top-r*.5}e.session.setScrollTop(a)},selectRectangularRegion:function(e){e.multiSelect.toggleBlockSelection()},setMark:{exec:function(e,n){if(n&&n.count){if(e.inMultiSelectMode)e.forEachSelection(o);else o();o();return}var t=e.emacsMark(),r=e.selection.getAllRanges(),a=r.map(function(e){return{row:e.start.row,column:e.start.column}}),i=true,s=r.every(function(e){return e.isEmpty()});if(i&&(t||!s)){if(e.inMultiSelectMode)e.forEachSelection({exec:e.clearSelection.bind(e)});else e.clearSelection();if(t)e.pushEmacsMark(null);return}if(!t){a.forEach(function(n){e.pushEmacsMark(n)});e.setEmacsMark(a[a.length-1]);return}function o(){var n=e.popEmacsMark();n&&e.moveCursorToPosition(n)}},readOnly:true,handlesCount:true},exchangePointAndMark:{exec:function e(n,t){var r=n.selection;if(!t.count&&!r.isEmpty()){r.setSelectionRange(r.getRange(),!r.isBackwards());return}if(t.count){var a={row:r.lead.row,column:r.lead.column};r.clearSelection();r.moveCursorToPosition(n.emacsMarkForSelection(a))}else{r.selectToPosition(n.emacsMarkForSelection())}},readOnly:true,handlesCount:true,multiSelectAction:"forEach"},killWord:{exec:function(e,t){e.clearSelection();if(t=="left")e.selection.selectWordLeft();else e.selection.selectWordRight();var r=e.getSelectionRange();var a=e.session.getTextRange(r);n.killRing.add(a);e.session.remove(r);e.clearSelection()},multiSelectAction:"forEach"},killLine:function(e){e.pushEmacsMark(null);e.clearSelection();var t=e.getSelectionRange();var r=e.session.getLine(t.start.row);t.end.column=r.length;r=r.substr(t.start.column);var a=e.session.getFoldLine(t.start.row);if(a&&t.end.row!=a.end.row){t.end.row=a.end.row;r="x"}if(/^\s*$/.test(r)){t.end.row++;r=e.session.getLine(t.end.row);t.end.column=/^\s*$/.test(r)?r.length:0}var i=e.session.getTextRange(t);if(e.prevOp.command==this)n.killRing.append(i);else n.killRing.add(i);e.session.remove(t);e.clearSelection()},yank:function(e){e.onPaste(n.killRing.get()||"");e.keyBinding.$data.lastCommand="yank"},yankRotate:function(e){if(e.keyBinding.$data.lastCommand!="yank")return;e.undo();e.session.$emacsMarkRing.pop();e.onPaste(n.killRing.rotate());e.keyBinding.$data.lastCommand="yank"},killRegion:{exec:function(e){n.killRing.add(e.getCopyText());e.commands.byName.cut.exec(e);e.setEmacsMark(null)},readOnly:true,multiSelectAction:"forEach"},killRingSave:{exec:function(e){e.$handlesEmacsOnCopy=true;var t=e.session.$emacsMarkRing.slice(),r=[];n.killRing.add(e.getCopyText());setTimeout(function(){function n(){var n=e.selection,t=n.getRange(),a=n.isBackwards()?t.end:t.start;r.push({row:a.row,column:a.column});n.clearSelection()}e.$handlesEmacsOnCopy=false;if(e.inMultiSelectMode)e.forEachSelection({exec:n});else n();e.setEmacsMark(null);e.session.$emacsMarkRing=t.concat(r.reverse())},0)},readOnly:true},keyboardQuit:function(e){e.selection.clearSelection();e.setEmacsMark(null);e.keyBinding.$data.count=null},focusCommandLine:function(e,n){if(e.showCommandLine)e.showCommandLine(n)}});n.handler.addCommands(a.iSearchStartCommands);var g=n.handler.commands;g.yank.isYank=true;g.yankRotate.isYank=true;n.killRing={$data:[],add:function(e){e&&this.$data.push(e);if(this.$data.length>30)this.$data.shift()},append:function(e){var n=this.$data.length-1;var t=this.$data[n]||"";if(e)t+=e;if(t)this.$data[n]=t},get:function(e){e=e||1;return this.$data.slice(this.$data.length-e,this.$data.length).reverse().join("\n")},pop:function(){if(this.$data.length>1)this.$data.pop();return this.get()},rotate:function(){this.$data.unshift(this.$data.pop());return this.get()}}});(function(){ace.require(["ace/keyboard/emacs"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();