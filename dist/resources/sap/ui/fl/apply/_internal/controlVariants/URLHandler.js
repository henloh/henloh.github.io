/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Component","sap/ui/fl/Utils","sap/base/Log","sap/base/util/merge","sap/base/util/ObjectPath","sap/base/util/isEmptyObject","sap/ui/base/ManagedObjectObserver","sap/ui/thirdparty/hasher","sap/base/util/includes","sap/ui/fl/apply/_internal/controlVariants/Utils","sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState"],function(e,a,t,r,n,o,i,s,l,m,p){"use strict";var c={};var d={};function u(e,a){var t=[];return e.reduce(function(e,r){var n=a.getVariantManagementReference(r).variantManagementReference;if(n){if(l(t,n)){e.updateRequired=true;return e}t.push(n)}if(n&&a.oData[n].currentVariant!==r){e.updateRequired=true;if(a.oData[n].currentVariant!==a.oData[n].defaultVariant){e.parameters.push(a.oData[n].currentVariant)}}else{e.parameters.push(r)}return e},{updateRequired:false,parameters:[]})}function f(e,a){var t=n.get(["params",m.VARIANT_TECHNICAL_PARAMETER],e);if(t){var r=u(t,a);if(r.updateRequired){d.update({updateURL:!a._bDesignTimeMode,parameters:r.parameters,updateHashEntry:true,model:a})}}}function v(e,a){try{var r=e.getUShellService("URLParsing");if(r){var n=r.parseShellHash(a);f(n,e)}}catch(e){t.error(e.message)}var o=e.getUShellService("ShellNavigation");return o&&o.NavigationFilterStatus.Continue}function h(e){var a=e.getUShellService("ShellNavigation");if(!c[e.sFlexReference]){c[e.sFlexReference]=v.bind(null,e);if(a){a.registerNavigationFilter(c[e.sFlexReference])}}}function A(e){var a=e.getUShellService("ShellNavigation");if(a){a.unregisterNavigationFilter(c[e.sFlexReference]);delete c[e.sFlexReference]}}function R(e){var a=e.model;var r=a.getUShellService("URLParsing");var n=a.getUShellService("CrossApplicationNavigation");var o=r&&r.parseShellHash(s.getHash());if(o&&o.params){var i=a.oAppComponent&&a.oAppComponent.getComponentData&&a.oAppComponent.getComponentData()&&a.oAppComponent.getComponentData().technicalParameters;if(!i){t.warning("Component instance not provided, so technical parameters in component data and browser history remain unchanged")}if(e.parameters.length===0){delete o.params[m.VARIANT_TECHNICAL_PARAMETER];i&&delete i[m.VARIANT_TECHNICAL_PARAMETER]}else{o.params[m.VARIANT_TECHNICAL_PARAMETER]=e.parameters;i&&(i[m.VARIANT_TECHNICAL_PARAMETER]=e.parameters)}if(e.silent){s.changed.active=false;s.replaceHash(r.constructShellHash(o));s.changed.active=true}else{n.toExternal({target:{semanticObject:o.semanticObject,action:o.action,context:o.contextRaw},params:o.params,appSpecificRoute:o.appSpecificRoute,writeHistory:false})}}}function C(e){var a={index:-1};var t=e.model;var n=t.getUShellService("URLParsing");var o=n&&n.parseShellHash(s.getHash()).params;if(o){a.parameters=[];if(t._bDesignTimeMode){o[m.VARIANT_TECHNICAL_PARAMETER]=d.getStoredHashParams(e)}if(Array.isArray(o[m.VARIANT_TECHNICAL_PARAMETER])){o[m.VARIANT_TECHNICAL_PARAMETER]=o[m.VARIANT_TECHNICAL_PARAMETER].map(decodeURIComponent);o[m.VARIANT_TECHNICAL_PARAMETER].some(function(r,n){var o=p.getVariant({vmReference:e.vmReference,vReference:r,reference:t.oChangePersistence.getComponentName()});if(o){a.index=n;return true}})}}return r(a,o&&o[m.VARIANT_TECHNICAL_PARAMETER]&&{parameters:o[m.VARIANT_TECHNICAL_PARAMETER]})}d.variantTechnicalParameterName="sap-ui-fl-control-variant-id";d.initialize=function(e){var a=e.model;var t=a.getUShellService("URLParsing");var r=t&&t.parseShellHash(s.getHash());var n=r&&r.params&&r.params[m.VARIANT_TECHNICAL_PARAMETER];d.attachHandlers(e);d.update({model:a,parameters:n,updateHashEntry:Array.isArray(n)&&n.length>0});f(r,a)};d.updateVariantInURL=function(e){var a=d.removeURLParameterForVariantManagement(e);if(!a.parameters){return}var t=a.parameters||[];var r=a.index;var n=e.newVReference===e.model.oData[e.vmReference].defaultVariant;if(!n){if(r===-1){t=t.concat([e.newVReference])}else{t=t.slice(0,r).concat([e.newVReference],t.slice(r))}}if(!n||r>-1){d.update({parameters:t,updateURL:!e.model._bDesignTimeMode,updateHashEntry:true,model:e.model})}};d.removeURLParameterForVariantManagement=function(e){var a=C(e);if(a.index>-1){a.parameters.splice(a.index,1)}return a};d.attachHandlers=function(a){function t(){return a.model._oVariantSwitchPromise.then(function(){a.model._oHashData.controlPropertyObservers.forEach(function(e){e.destroy()});A(a.model);a.model.destroy();a.model.oComponentDestroyObserver.unobserve(a.model.oAppComponent,{destroy:true});a.model.oComponentDestroyObserver.destroy()})}h(a.model);if(!a.model.oComponentDestroyObserver&&a.model.oAppComponent instanceof e){a.model.oComponentDestroyObserver=new i(t.bind(null));a.model.oComponentDestroyObserver.observe(a.model.oAppComponent,{destroy:true})}};d.registerControl=function(e){if(e.updateURL){e.model._oHashData.variantControlIds.push(e.vmReference)}};d.update=function(e){if(!e.model._oHashData){e.model._oHashData={hashParams:[],controlPropertyObservers:[],variantControlIds:[]}}if(!e||!Array.isArray(e.parameters)){t.info("Variant URL parameters could not be updated since invalid parameters were received");return}if(e.updateURL){R(e)}if(e.updateHashEntry&&!o(e.model)){e.model._oHashData.hashParams=e.parameters}};d.getStoredHashParams=function(e){return Array.prototype.slice.call(e.model._oHashData.hashParams)};d.handleModelContextChange=function(e){var a="modelContextChange";function t(a,t){var r=t.model.getVariantManagementReferenceForControl(a.getSource());var n=t.model._oHashData.variantControlIds;var o=n.indexOf(r);if(o>-1){n.slice(o).forEach(function(a){if(C({vmReference:a,model:e.model}).index===-1){t.model.switchToDefaultForVariantManagement(a)}})}}var r=new i(function(r){if(r.current===true&&r.old===false){r.object.attachEvent(a,{model:e.model},t)}else if(r.current===false&&r.old===true){r.object.detachEvent(a,t)}});r.observe(e.vmControl,{properties:["resetOnContextChange"]});e.model._oHashData.controlPropertyObservers.push(r);if(e.vmControl.getResetOnContextChange()!==false){e.vmControl.attachEvent(a,{model:e.model},t)}};d.clearAllVariantURLParameters=function(e){d.update({updateURL:true,parameters:[],updateHashEntry:false,model:e.model})};return d});