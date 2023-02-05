sap.ui.define(["./BaseController","../model/formatter","sap/ui/model/json/JSONModel"],function(t,e,r){function n(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const a=n(t);const o=n(e);const s=a.extend("de.henloh.prodts.controller.Permutation",{constructor:function t(){a.prototype.constructor.apply(this,arguments);this.formatter=o},onInit:function t(){var e=new r;document.title="Permutation";e.setData({text:""});this.getView().setModel(e,"View");this.getRouter().getRoute("main").attachPatternMatched(this.onPatternMatched,this)},onPatternMatched:function t(e){},clearData:function t(e){var r=this.getView().getModel("View");r.setProperty("/Final"," ");r.setProperty("/text"," ")},downloadCSV:function t(e){var r=this.getView().getModel("View");var n=r.getProperty("/Final");var a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURI(n);a.target="_blank";a.download="generiert.csv";a.click()},generateCSV:function t(e){var r=this.getView().getModel("View");var n=r.getProperty("/text");try{var a="";var o=JSON.parse(n);for(const t of o.columns){a+=t.title+";"}a+="\n";var s=Object.keys(o.data);var l=0;for(const t of s){l==0?l=o.data[t].length:l*=o.data[t].length}var i=[];var u=function(t,e,r){for(let g=0;g<t.length;g++){var n=t[g];for(let m=0;m<n.length;m++){var a=n[m];var s=JSON.parse(JSON.stringify(e));if(a===null){var l=s[g][m].data;for(let n=0;n<l.length;n++){var c=JSON.parse(JSON.stringify(t));var f=e[g][m].name;for(let t=0;t<o.columns.length;t++){for(let e=0;e<o.columns[t].parts.length;e++){var h=o.columns[t].parts[e];var d=o.columns[t].parts[e][1];if(h[0]===f&&c[t][e]===null){c[t][e]=l[n][d]}}}var p=false;var v="";for(const t of c){for(const e of t){if(e===null){p=true;break}v+=e}if(p)break;v+=";"}v+="\n";if(!p){r.push(v);i.push(f)}if(n===l.length-1){}u(c,s,r)}return r}}}};var c=[];var f=[];for(let t=0;t<o.columns.length;t++){c.push([]);f.push([]);for(let e=0;e<o.columns[t].parts.length;e++){const r=o.columns[t].parts[e];if(r.length===1){c[t].push(o.data[o.columns[t].parts[e][0]][0]);f[t].push(null)}else{var h=o.columns[t].parts[e][0];c[t].push(null);f[t].push({name:h,data:o.data[h]})}}}var d=u(c,f,[]);for(const t of d){a+=t}r.setProperty("/rowCount",l);r.setProperty("/Final",a)}catch(t){console.error(t)}}});return s});