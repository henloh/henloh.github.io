/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Component","sap/ui/core/UIArea"],function(t,e){"use strict";var n=null;function r(r){n=r;return{getMetadata:function(){return n.getMetadata()},getUIAreas:function(){return e.registry.all()},getComponents:function(){return t.registry.all()},getModels:function(){return n.oModels}}}return r},true);