sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","./model/models","sap/ui/core/ComponentSupport","sap/ui/core/date/Gregorian","sap/ui/model/type/Date"],function(e,t,n,s,i,o){function a(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const c=t["support"];const p=a(n);const u=e.extend("de.henloh.prodts.Component",{metadata:{manifest:"json",interfaces:["sap.ui.core.IAsyncContentCreation"]},init:function t(){e.prototype.init.call(this);this.setModel(p.createDeviceModel(),"device");this.getRouter().initialize()},getContentDensityClass:function e(){if(this.contentDensityClass===undefined){if(document.body.classList.contains("sapUiSizeCozy")||document.body.classList.contains("sapUiSizeCompact")){this.contentDensityClass=""}else if(!c.touch){this.contentDensityClass="sapUiSizeCompact"}else{this.contentDensityClass="sapUiSizeCozy"}}return this.contentDensityClass}});return u});