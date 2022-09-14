/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/testrecorder/codeSnippets/OPA5ControlSnippetGenerator","sap/ui/testrecorder/codeSnippets/RawControlSnippetGenerator","sap/ui/testrecorder/codeSnippets/UIVeri5ControlSnippetGenerator","sap/ui/testrecorder/codeSnippets/WDI5ControlSnippetGenerator","sap/ui/testrecorder/DialectRegistry","sap/ui/testrecorder/Dialects"],function(e,t,r,n,i,o,p){"use strict";var s=null;var c=e.extend("sap.ui.testrecorder.codeSnippets.ControlSnippetProvider",{constructor:function(){if(!s){e.apply(this,arguments)}else{return s}}});c.prototype.getSnippet=function(e){var t=c.getGenerator(o.getActiveDialect());return t.getSnippet(e).then(function(e){return e})};c.getGenerator=function(e){switch(e){case p.OPA5:return t;case p.RAW:return r;case p.UIVERI5:return n;case p.WDI5:return i;default:return r}};s=new c;return s});