/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache","./_ConcatHelper","./_GroupLock","./_Helper","./_MinMaxHelper","sap/base/Log","sap/ui/base/SyncPromise"],function(e,t,n,r,i,a,o,l){"use strict";function s(r,a,o,s,u){var c=function(){},d=null,f=this;t.call(this,r,a,s,true);this.oAggregation=o;this.sDownloadUrl=o.hierarchyQualifier?"n/a":t.prototype.getDownloadUrl.call(this,"");this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$created=0;this.oLeavesPromise=undefined;if(s.$count&&o.groupLevels.length){s.$$leaves=true;this.oLeavesPromise=new l(function(e){d=function(t){e(parseInt(t.UI5__leaves))}})}this.oFirstLevel=this.createGroupLevelCache(null,u||!!d);this.oGrandTotalPromise=undefined;if(u){this.oGrandTotalPromise=new l(function(t){n.enhanceCache(f.oFirstLevel,o,[d,function(n){var r;if(o["grandTotal like 1.84"]){e.removeUI5grand__(n)}e.setAnnotations(n,true,true,0,e.getAllProperties(o));if(o.grandTotalAtBottomOnly===false){r=Object.assign({},n,{"@$ui5.node.isExpanded":undefined});i.setPrivateAnnotation(n,"copy",r);i.setPrivateAnnotation(r,"predicate","($isTotal=true)")}i.setPrivateAnnotation(n,"predicate","()");t(n)},c])})}else if(d){n.enhanceCache(f.oFirstLevel,o,[d,c])}}s.prototype=Object.create(t.prototype);s.prototype.addElements=function(e,t,n,r){var a=this.aElements;function o(e,o){var l=a[t+o],s,u=i.getPrivateAnnotation(e,"predicate");if(l){if(l===e){return}s=i.getPrivateAnnotation(l,"parent");if(!s){throw new Error("Unexpected element")}if(s!==n||i.getPrivateAnnotation(l,"index")!==r+o){throw new Error("Wrong placeholder")}}else if(t+o>=a.length){throw new Error("Array index out of bounds: "+(t+o))}if(u in a.$byPredicate&&a.$byPredicate[u]!==e){throw new Error("Duplicate predicate: "+u)}a[t+o]=e;a.$byPredicate[u]=e}if(t<0){throw new Error("Illegal offset: "+t)}if(Array.isArray(e)){e.forEach(o)}else{o(e,0)}};s.prototype.collapse=function(e){var t,n=0,a,o=this.aElements,l=this.fetchValue(r.$cached,e).getResult(),s=l["@$ui5.node.level"],u=o.indexOf(l),c=u+1;function d(e){delete o.$byPredicate[i.getPrivateAnnotation(o[e],"predicate")];n+=1}t=i.getPrivateAnnotation(l,"collapsed");i.updateAll(this.mChangeListeners,e,l,t);a=i.getPrivateAnnotation(l,"descendants");if(a){s=this.oAggregation.expandTo}while(c<o.length){if(o[c]["@$ui5.node.level"]<=s){if(!a){break}a-=1}d(c);c+=1}if(this.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(t).length>1){d(c)}i.setPrivateAnnotation(l,"spliced",o.splice(u+1,n));o.$count-=n;return n};s.prototype.createGroupLevelCache=function(n,r){var a=this.oAggregation,o=n?n["@$ui5.node.level"]+1:1,l,u,c,d,f,g;if(a.hierarchyQualifier){f=Object.assign({},this.mQueryOptions)}else{l=e.getAllProperties(a);d=o>a.groupLevels.length;c=d?a.groupLevels.concat(Object.keys(a.group).sort()):a.groupLevels.slice(0,o);f=e.filterOrderby(this.mQueryOptions,a,o);g=!d&&Object.keys(a.aggregate).some(function(e){return a.aggregate[e].subtotals})}if(n){f.$$filterBeforeAggregate=i.getPrivateAnnotation(n,"filter")+(f.$$filterBeforeAggregate?" and ("+f.$$filterBeforeAggregate+")":"")}if(!r){delete f.$count;f=e.buildApply(a,f,o)}f.$count=true;u=t.create(this.oRequestor,this.sResourcePath,f,true);u.calculateKeyPredicate=a.hierarchyQualifier?s.calculateKeyPredicateRH.bind(null,n):s.calculateKeyPredicate.bind(null,n,c,l,d,g);return u};s.prototype.expand=function(t,n){var a,o,s=this.aElements,u=typeof n==="string"?this.fetchValue(r.$cached,n).getResult():n,c,d=i.getPrivateAnnotation(u,"spliced"),f=this;if(n!==u){i.updateAll(this.mChangeListeners,n,u,e.getOrCreateExpandedObject(this.oAggregation,u))}if(d){i.deletePrivateAnnotation(u,"spliced");c=s.indexOf(u)+1;this.aElements=s.concat(d,s.splice(c));this.aElements.$byPredicate=s.$byPredicate;o=d.length;this.aElements.$count=s.$count+o;d.forEach(function(e){var t=i.getPrivateAnnotation(e,"predicate");if(t){f.aElements.$byPredicate[t]=e;if(i.getPrivateAnnotation(e,"expanding")){i.deletePrivateAnnotation(e,"expanding");o+=f.expand(r.$cached,e).getResult()}}});i.updateAll(f.mChangeListeners,n,u,{"@$ui5.node.groupLevelCount":i.getPrivateAnnotation(u,"groupLevelCount")});return l.resolve(o)}a=i.getPrivateAnnotation(u,"cache");if(!a){a=this.createGroupLevelCache(u);i.setPrivateAnnotation(u,"cache",a)}return a.read(0,this.iReadLength,0,t).then(function(t){var r=f.aElements.indexOf(u)+1,l=u["@$ui5.node.level"],s=i.getPrivateAnnotation(u,"collapsed"),c=f.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(s).length>1,d;if(!u["@$ui5.node.isExpanded"]){i.deletePrivateAnnotation(u,"spliced");return 0}if(!r){i.setPrivateAnnotation(u,"expanding",true);return 0}o=t.value.$count;i.setPrivateAnnotation(u,"groupLevelCount",o);i.updateAll(f.mChangeListeners,n,u,{"@$ui5.node.groupLevelCount":o});if(c){o+=1}if(r===f.aElements.length){f.aElements.length+=o}else{for(d=f.aElements.length-1;d>=r;d-=1){f.aElements[d+o]=f.aElements[d];delete f.aElements[d]}}f.addElements(t.value,r,a,0);for(d=r+t.value.length;d<r+t.value.$count;d+=1){f.aElements[d]=e.createPlaceholder(l+1,d-r,a)}if(c){s=Object.assign({},s);e.setAnnotations(s,undefined,true,l,e.getAllProperties(f.oAggregation));i.setPrivateAnnotation(s,"predicate",i.getPrivateAnnotation(u,"predicate").slice(0,-1)+",$isTotal=true)");f.addElements(s,r+o-1)}f.aElements.$count+=o;return o},function(e){i.updateAll(f.mChangeListeners,n,u,i.getPrivateAnnotation(u,"collapsed"));throw e})};s.prototype.fetchValue=function(e,t,n,r){if(t==="$count"){if(this.oLeavesPromise){return this.oLeavesPromise}if(this.oAggregation.hierarchyQualifier||this.oAggregation.groupLevels.length){o.error("Failed to drill-down into $count, invalid segment: $count",this.toString(),"sap.ui.model.odata.v4.lib._Cache");return l.resolve()}return this.oFirstLevel.fetchValue(e,t,n,r)}this.registerChangeListener(t,r);return this.drillDown(this.aElements,t,e)};s.prototype.getAllElements=function(e){var t;if(e){throw new Error("Unsupported path: "+e)}t=this.aElements.map(function(e){return i.getPrivateAnnotation(e,"parent")?undefined:e});t.$count=this.aElements.$count;return t};s.prototype.getCreatedElements=function(e){return[]};s.prototype.getDownloadQueryOptions=function(t){return e.buildApply(this.oAggregation,e.filterOrderby(t,this.oAggregation),0,true)};s.prototype.getDownloadUrl=function(e,t){return this.sDownloadUrl};s.prototype.read=function(t,n,r,a,o){var s,u=t,c=n,d,f,g=!!this.oGrandTotalPromise,h=g&&this.oAggregation.grandTotalAtBottomOnly!==true,p=[],v,m,A=this;function E(e,t){var n=d,r=d.getQueryOptions(),l=i.getPrivateAnnotation(A.aElements[e],"index"),s=A.aElements[e];if(r.$count){delete r.$count;d.setQueryOptions(r,true)}p.push(d.read(l,t-e,0,a.getUnlockedCopy(),o).then(function(t){var r=false,i;if(s!==A.aElements[e]&&t.value[0]!==A.aElements[e]){r=true;e=A.aElements.indexOf(s);if(e<0){e=A.aElements.indexOf(t.value[0]);if(e<0){i=new Error("Collapse before read has finished");i.canceled=true;throw i}}}A.addElements(t.value,e,n,l);if(r){i=new Error("Collapse or expand before read has finished");i.canceled=true;throw i}}))}if(h&&!t&&n===1){if(r!==0){throw new Error("Unsupported prefetch length: "+r)}a.unlock();return this.oGrandTotalPromise.then(function(e){return{value:[e]}})}else if(this.aElements.$count===undefined){this.iReadLength=n+r;if(h){if(u){u-=1}else{c-=1}}p.push(this.oFirstLevel.read(u,c,r,a,o).then(function(t){var n,r,a=0,o;A.aElements.length=A.aElements.$count=t.value.$count;if(g){A.aElements.$count+=1;A.aElements.length+=1;n=A.oGrandTotalPromise.getResult();switch(A.oAggregation.grandTotalAtBottomOnly){case false:a=1;A.aElements.$count+=1;A.aElements.length+=1;A.addElements(n,0);r=i.getPrivateAnnotation(n,"copy");A.addElements(r,A.aElements.length-1);break;case true:A.addElements(n,A.aElements.length-1);break;default:a=1;A.addElements(n,0)}}A.addElements(t.value,u+a,A.oFirstLevel,u);for(o=0;o<A.aElements.$count;o+=1){if(!A.aElements[o]){A.aElements[o]=e.createPlaceholder(1,o-a,A.oFirstLevel)}}}))}else{for(v=t,m=Math.min(t+n,this.aElements.length);v<m;v+=1){s=i.getPrivateAnnotation(this.aElements[v],"parent");if(s!==d){if(f){E(f,v);d=f=undefined}if(s){f=v;d=s}}}if(f){E(f,v)}a.unlock()}return l.all(p).then(function(){var e=A.aElements.slice(t,t+n);e.$count=A.aElements.$count;return{value:e}})};s.prototype.refreshKeptElements=function(){};s.prototype.toString=function(){return this.sDownloadUrl};s.calculateKeyPredicate=function(t,n,r,a,o,l,s,u){var c;if(!(u in s)){return undefined}if(t){r.forEach(function(e){if(Array.isArray(e)){i.inheritPathValue(e,t,l)}else if(!(e in l)){l[e]=t[e]}})}c=a&&i.getKeyPredicate(l,u,s)||i.getKeyPredicate(l,u,s,n,true);i.setPrivateAnnotation(l,"predicate",c);if(!a){i.setPrivateAnnotation(l,"filter",i.getKeyFilter(l,u,s,n))}e.setAnnotations(l,a?undefined:false,o,t?t["@$ui5.node.level"]+1:1,t?null:r);return c};s.calculateKeyPredicateRH=function(t,n,r,a){var o=1,l,s=i.getKeyPredicate(n,a,r);i.setPrivateAnnotation(n,"predicate",s);switch(n.DrillState){case"expanded":l=true;e.getOrCreateExpandedObject({},n);break;case"collapsed":l=false;i.setPrivateAnnotation(n,"filter",i.getKeyFilter(n,a,r));break;default:}if(t){o=t["@$ui5.node.level"]+1}else if(n.DistanceFromRoot){o=n.DistanceFromRoot+1}e.setAnnotations(n,l,undefined,o);if(n.DescendantCount){i.setPrivateAnnotation(n,"descendants",n.DescendantCount)}delete n.DescendantCount;delete n.DistanceFromRoot;delete n.DrillState;return s};s.create=function(n,r,i,o,l,u,c){var d,f,g;if(o){d=e.hasGrandTotal(o.aggregate);f=o.groupLevels&&!!o.groupLevels.length;g=e.hasMinOrMax(o.aggregate);if(l.$filter&&(d&&!o["grandTotal like 1.84"]||f)){throw new Error("Unsupported system query option: $filter")}if(l.$search&&(d||f||o.hierarchyQualifier)){throw new Error("Unsupported system query option: $search")}if(g){if(d){throw new Error("Unsupported grand totals together with min/max")}if(f){throw new Error("Unsupported group levels together with min/max")}}if(d||f||g||o.hierarchyQualifier){if(!o.hierarchyQualifier){if("$expand"in l){throw new Error("Unsupported system query option: $expand")}if("$select"in l){throw new Error("Unsupported system query option: $select")}}return g?a.createCache(n,r,o,l):new s(n,r,o,l,d)}}if(l.$$filterBeforeAggregate){l.$apply="filter("+l.$$filterBeforeAggregate+")/"+l.$apply;delete l.$$filterBeforeAggregate}return t.create(n,r,l,u,i,c)};return s},false);