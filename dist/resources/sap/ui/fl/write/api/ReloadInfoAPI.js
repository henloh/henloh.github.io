/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/LayerUtils","sap/ui/fl/Layer","sap/ui/fl/Utils","sap/ui/fl/write/api/Version","sap/ui/fl/write/api/VersionsAPI","sap/ui/fl/write/api/FeaturesAPI","sap/ui/fl/write/api/PersistenceWriteAPI","sap/ui/fl/write/_internal/FlexInfoSession"],function(e,r,a,t,i,n,l,s){"use strict";var o={flp:{set:function(e,r,a){e[r]=[a];return e},get:function(e,r){return e[r]&&e[r][0]},remove:function(e,r){delete e[r];return e}},standalone:{set:function(e,r,t){return a.handleUrlParameters(e,r,t)},get:function(e,r){return a.getParameter(r)},remove:function(e,r,t){return a.handleUrlParameters(e,r,t)}}};function u(e){var r=!!a.getParameter(t.UrlParameter,e.URLParsingService);if(r){return Promise.resolve(false)}return n.isVersioningEnabled(e.layer).then(function(r){return r&&i.isDraftAvailable({control:e.selector,layer:e.layer})})}function f(e){var a=this.hasMaxLayerParameterWithValue({value:e.layer},e.URLParsingService);var t=e.layer===r.USER;if(t||a){return Promise.resolve(false)}return l.hasHigherLayerChanges({selector:e.selector,ignoreMaxLayerParameter:e.ignoreMaxLayerParameter,upToLayer:e.layer,includeCtrlVariants:e.includeCtrlVariants,includeDirtyChanges:true})}function v(e){var r=s.get(e.selector);if(r&&r.initialAllContexts){return false}if(r===null||r.allContextsProvided===undefined){var a={selector:e.selector,layer:e.layer};return l.getResetAndPublishInfo(a).then(function(a){if(r===null||!r.initialAllContexts){a.initialAllContexts=true}s.set(a,e.selector);return!a.allContextsProvided})}r.initialAllContexts=true;s.set(r,e.selector);return!r.allContextsProvided}function c(e){var r=s.get(e);return r&&!r.allContextsProvided}var m={getReloadReasonsForStart:function(e){return Promise.all([f.call(this,e),u(e),v(e)]).then(function(r){e.hasHigherLayerChanges=r[0];e.isDraftAvailable=r[1];e.allContexts=r[2];return e})},hasVersionParameterWithValue:function(e,r){return a.hasParameterAndValue(t.UrlParameter,e.value,r)},removeInfoSessionStorage:function(e){s.remove(e)},hasMaxLayerParameterWithValue:function(r,t){var i=e.FL_MAX_LAYER_PARAM;return a.hasParameterAndValue(i,r.value,t)},handleUrlParameters:function(r,a){var i=false;if(!r.ignoreMaxLayerParameter&&r.hasHigherLayerChanges){r.parameters=o[a].remove(r.parameters,e.FL_MAX_LAYER_PARAM,r.layer);i=true}var n=o[a].get(r.parameters,t.UrlParameter);if(r.versionSwitch&&n!==r.version){r.parameters=o[a].remove(r.parameters,t.UrlParameter,n);r.parameters=o[a].set(r.parameters,t.UrlParameter,r.version);i=true}if(n&&r.removeVersionParameter||n===t.Number.Draft&&r.removeDraft){r.parameters=o[a].remove(r.parameters,t.UrlParameter,n);i=true}return i},handleParametersOnStart:function(r,a){var i=false;if(r.hasHigherLayerChanges){r.parameters=o[a].set(r.parameters,e.FL_MAX_LAYER_PARAM,r.layer);i=true}if(r.isDraftAvailable){r.parameters=o[a].set(r.parameters,t.UrlParameter,t.Number.Draft);i=true}return i},initialDraftGotActivated:function(e){if(e.versioningEnabled){var r=this.hasVersionParameterWithValue({value:t.Number.Draft},e.URLParsingService);return!i.isDraftAvailable({control:e.selector,layer:e.layer})&&r}return false},getReloadMethod:function(e){var r={NOT_NEEDED:"NO_RELOAD",RELOAD_PAGE:"HARD_RELOAD",VIA_HASH:"CROSS_APP_NAVIGATION"};e.reloadMethod=r.NOT_NEEDED;e.isDraftAvailable=e.isDraftAvailable||m.hasVersionParameterWithValue({value:t.Number.Draft},e.URLParsingService);e.hasVersionUrlParameter=!!a.getParameter(t.UrlParameter,e.URLParsingService);if(e.activeVersion&&e.activeVersion!==t.Number.Original&&e.hasVersionUrlParameter){e.activeVersionNotSelected=!m.hasVersionParameterWithValue({value:e.activeVersion},e.URLParsingService)}e.hasHigherLayerChanges=m.hasMaxLayerParameterWithValue({value:e.layer},e.URLParsingService);e.initialDraftGotActivated=m.initialDraftGotActivated(e);if(e.initialDraftGotActivated){e.isDraftAvailable=false}e.allContexts=c(e.selector);if(e.changesNeedReload||e.isDraftAvailable||e.hasHigherLayerChanges||e.initialDraftGotActivated||e.activeVersionNotSelected||e.allContexts){e.reloadMethod=r.RELOAD_PAGE;if(!e.changesNeedReload&&a.getUshellContainer()){e.reloadMethod=r.VIA_HASH}}s.remove(e.selector);return e}};return m});