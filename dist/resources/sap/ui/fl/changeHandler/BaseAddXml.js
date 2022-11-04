/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/Base","sap/base/util/LoaderExtensions","sap/ui/fl/changeHandler/common/revertAddedControls","sap/ui/fl/Utils"],function(e,t,r,n){"use strict";var a={};a.applyChange=function(r,o,i,u){var s=i.modifier;var g=i.view;var f=u.aggregationName;var c;var h=u.index;var l=[];var d=r.getModuleName();var m;var v;var p=function(){var e=[];v.forEach(function(t,r){var n=function(){return Promise.resolve().then(s.insertAggregation.bind(s,o,f,t,h+r,g,u.skipAdjustIndex)).then(function(){l.push({id:s.getId(t),aggregationName:f})})};e.push(n)});return n.execPromiseQueueSequentially(e,true,true).then(function(){r.setRevertData(l);return v})};return Promise.resolve().then(s.findAggregation.bind(s,o,f)).then(function(e){c=e;if(!c){return Promise.reject(new Error("The given Aggregation is not available in the given control: "+s.getId(o)))}return t.loadResource(d,{dataType:"text"})}).then(function(t){m=t;return e.instantiateFragment(r,i)}).then(function(e){v=e;var t=[];v.forEach(function(e,r){var n=function(){return Promise.resolve().then(s.validateType.bind(s,e,c,o,m,r)).then(function(e){if(!e){a._destroyArrayOfControls(v);return Promise.reject(new Error("The content of the xml fragment does not match the type of the targetAggregation: "+c.type))}})};t.push(n)});return n.execPromiseQueueSequentially(t,true,true).then(p)})};a.revertChange=r;a._throwMissingAttributeError=function(e){throw new Error("Attribute missing from the change specific content '"+e+"'")};a._destroyArrayOfControls=function(e){e.forEach(function(e){if(e.destroy){e.destroy()}})};a.completeChangeContent=function(e,t,r){r=r||{};if(t.fragmentPath){r.fragmentPath=t.fragmentPath}else{a._throwMissingAttributeError("fragmentPath")}e.setContent(r);var n=e.getComponent().replace(/\.Component/g,"").replace(/\./g,"/");n+="/changes/";n+=r.fragmentPath;e.setModuleName(n)};return a},true);