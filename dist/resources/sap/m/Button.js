/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Core","sap/ui/core/Control","sap/ui/core/ShortcutHintsMixin","sap/ui/core/EnabledPropagator","sap/ui/core/AccessKeysEnablement","sap/ui/core/IconPool","sap/ui/Device","sap/ui/core/ContextMenuSupport","sap/ui/core/library","./ButtonRenderer","sap/ui/events/KeyCodes","sap/ui/core/LabelEnablement","sap/m/BadgeEnabler","sap/ui/core/InvisibleText","sap/base/Log"],function(e,t,i,s,a,n,o,r,u,c,h,l,p,g,d,f){"use strict";var _=c.TextDirection;var b=e.ButtonType;var y=e.ButtonAccessibilityType;var m=e.BadgeState;var v=c.aria.HasPopup;var I=1,T=9999;var B=i.extend("sap.m.Button",{metadata:{interfaces:["sap.ui.core.IFormContent","sap.ui.core.IAccessKeySupport"],library:"sap.m",properties:{text:{type:"string",group:"Misc",defaultValue:""},type:{type:"sap.m.ButtonType",group:"Appearance",defaultValue:b.Default},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},iconFirst:{type:"boolean",group:"Appearance",defaultValue:true},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:_.Inherit},ariaHasPopup:{type:"sap.ui.core.aria.HasPopup",group:"Accessibility",defaultValue:v.None},highlightAccKeysRef:{type:"boolean",defaultValue:false,visibility:"hidden"},accesskey:{type:"string",defaultValue:"",visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{tap:{deprecated:true},press:{}},designtime:"sap/m/designtime/Button.designtime",dnd:{draggable:true,droppable:false}}});a.call(B.prototype);u.apply(B.prototype);g.call(B.prototype);B.prototype.init=function(){this._onmouseenter=this._onmouseenter.bind(this);this._buttonPressed=false;s.addConfig(this,{event:"press",position:"0 0",addAccessibilityLabel:true},this);this.initBadgeEnablement({position:"topRight",selector:{suffix:"inner"}});this._oBadgeData={value:"",state:""};this._badgeMinValue=I;this._badgeMaxValue=T;n.registerControl(this)};B.prototype.badgeValueFormatter=function(e){var t=parseInt(e),i=this.getBadgeCustomData(),s=i.getVisible();if(isNaN(t)){return false}if(t<this._badgeMinValue){s&&i.setVisible(false)}else{!s&&i.setVisible(true);if(t>this._badgeMaxValue&&e.indexOf("+")===-1){e=this._badgeMaxValue<1e3?this._badgeMaxValue+"+":"999+"}}return e};B.prototype.setBadgeMinValue=function(e){var t=this.getBadgeCustomData().getValue();if(e&&!isNaN(e)&&e>=I&&e!=this._badgeMinValue&&e<=this._badgeMaxValue){this._badgeMinValue=e;this.badgeValueFormatter(t);this.invalidate()}else{f.warning("minValue is not valid (it is is less than minimum allowed badge value ["+I+"] or greater than maximum badge value ["+this._badgeMaxValue+"])",this)}return this};B.prototype.setBadgeMaxValue=function(e){if(e&&!isNaN(e)&&e<=T&&e!=this._badgeMaxValue&&e>=this._badgeMinValue){this._badgeMaxValue=e;this.invalidate()}else{f.warning("maxValue is not valid (it is is greater than than maximum allowed badge value ["+T+"] or less than minimum badge value ["+this._badgeMinValue+"])",this)}return this};B.prototype.onBadgeUpdate=function(e,t){if(this._oBadgeData.value!==e||this._oBadgeData.state!==t){if(t===m.Disappear){e=""}this._updateBadgeInvisibleText(e);this._oBadgeData={value:e,state:t}}};B.prototype._updateBadgeInvisibleText=function(e){var i=t.getLibraryResourceBundle("sap.m"),s,a;e=e.toString().trim();a=e.indexOf("+");if(a!==-1){s=i.getText("BUTTON_BADGE_MORE_THAN_ITEMS",e.substr(0,a))}else{switch(e){case"":s="";break;case"1":s=i.getText("BUTTON_BADGE_ONE_ITEM",e);break;default:s=i.getText("BUTTON_BADGE_MANY_ITEMS",e)}}this._getBadgeInvisibleText().setText(s)};B.prototype._getBadgeInvisibleText=function(){if(!this._oBadgeInvisibleText){this._oBadgeInvisibleText=new d(this.getId()+"-badge").toStatic()}return this._oBadgeInvisibleText};B.prototype.exit=function(){if(this._image){this._image.destroy()}if(this._iconBtn){this._iconBtn.destroy()}if(this._oBadgeInvisibleText){this._oBadgeInvisibleText.destroy();this._oBadgeData=null}this._bFocused=null;this.$().off("mouseenter",this._onmouseenter)};B.prototype.setType=function(e){this.setProperty("type",e,false);switch(e){case b.Critical:this._sTypeIconURI="sap-icon://alert";break;case b.Negative:this._sTypeIconURI="sap-icon://error";break;case b.Success:this._sTypeIconURI="sap-icon://sys-enter-2";break;case b.Neutral:this._sTypeIconURI="sap-icon://information";break;case b.Back:case b.Up:this._sTypeIconURI="sap-icon://nav-back";break;default:this._sTypeIconURI=null}return this};B.prototype.onBeforeRendering=function(){this._bRenderActive=this._bActive;this._updateAccessKey();this.$().off("mouseenter",this._onmouseenter)};B.prototype._updateAccessKey=function(){var e=this.getText();if(e){this.setProperty("accesskey",e[0].toLowerCase(),true)}};B.prototype.onAfterRendering=function(){if(this._bRenderActive){this._activeButton();this._bRenderActive=this._bActive}if(this._bFocused){this._toggleLiveChangeAnnouncement("polite")}this.$().on("mouseenter",this._onmouseenter)};B.prototype.ontouchstart=function(e){e.setMarked();if(this._bRenderActive){delete this._bRenderActive}if(e.targetTouches.length===1){this._buttonPressed=true;this._activeButton()}if(this.getEnabled()&&this.getVisible()){if((r.browser.safari||r.browser.firefox)&&(e.originalEvent&&e.originalEvent.type==="mousedown")){this._setButtonFocus()}this._sTouchStartTargetId=e.target.id.replace(this.getId(),"")}else{this._sTouchStartTargetId=""}};B.prototype.ontouchend=function(e){var t;this._buttonPressed=e.originalEvent&&e.originalEvent.buttons&1;this._inactiveButton();if(this._bRenderActive){delete this._bRenderActive;this.ontap(e,true)}t=e.target.id.replace(this.getId(),"");if(this._buttonPressed===0&&(this._sTouchStartTargetId==="-BDI-content"&&(t==="-content"||t==="-inner"||t==="-img")||this._sTouchStartTargetId==="-content"&&(t==="-inner"||t==="-img")||this._sTouchStartTargetId==="-img"&&t!=="-img")){this.ontap(e,true)}this._sTouchStartTargetId=""};B.prototype.ontouchcancel=function(){this._buttonPressed=false;this._sTouchStartTargetId="";this._inactiveButton()};B.prototype.ontap=function(e,t){e.setMarked();delete this._bRenderActive;if(this.bFromTouchEnd){return}if(this.getEnabled()&&this.getVisible()){if(e.originalEvent&&e.originalEvent.type==="touchend"){this.focus()}this.fireTap({});this.firePress({})}this.bFromTouchEnd=t;if(this.bFromTouchEnd){setTimeout(function(){delete this.bFromTouchEnd}.bind(this),0)}};B.prototype.onkeydown=function(e){if((e.which===l.SPACE||e.which===l.ENTER||e.which===l.ESCAPE||e.which===l.SHIFT)&&!e.ctrlKey&&!e.metaKey){if(e.which===l.SPACE||e.which===l.ENTER){e.setMarked();this._activeButton()}if(e.which===l.ENTER){this.firePress({})}if(e.which===l.SPACE){this._bPressedSpace=true}if(this._bPressedSpace){if(e.which===l.SHIFT||e.which===l.ESCAPE){this._bPressedEscapeOrShift=true;this._inactiveButton()}}}else{if(this._bPressedSpace){e.preventDefault()}}};B.prototype.onkeyup=function(e){if(e.which===l.ENTER){e.setMarked();this._inactiveButton()}if(e.which===l.SPACE){if(!this._bPressedEscapeOrShift){e.setMarked();this._inactiveButton();this.firePress({})}else{this._bPressedEscapeOrShift=false}this._bPressedSpace=false}if(e.which===l.ESCAPE){this._bPressedSpace=false}};B.prototype._onmouseenter=function(e){if(this._buttonPressed&&e.originalEvent&&e.originalEvent.buttons&1){this._activeButton()}};B.prototype.onfocusin=function(){this._bFocused=true;this._toggleLiveChangeAnnouncement("polite")};B.prototype.onfocusout=function(){this._buttonPressed=false;this._bFocused=false;this._sTouchStartTargetId="";this._inactiveButton();this._toggleLiveChangeAnnouncement("off")};B.prototype._toggleLiveChangeAnnouncement=function(e){if(this._getText()){this.$("BDI-content").attr("aria-live",e)}else if(this._getAppliedIcon()){this.$("tooltip").attr("aria-live",e)}};B.prototype._activeButton=function(){if(!this._isUnstyled()){this.$("inner").addClass("sapMBtnActive")}this._bActive=this.getEnabled();if(this._bActive){if(this._getAppliedIcon()&&this.getActiveIcon()&&this._image){this._image.setSrc(this.getActiveIcon())}}};B.prototype._inactiveButton=function(){if(!this._isUnstyled()){this.$("inner").removeClass("sapMBtnActive")}this._bActive=false;if(this.getEnabled()){if(this._getAppliedIcon()&&this.getActiveIcon()&&this._image){this._image.setSrc(this._getAppliedIcon())}}};B.prototype._isHoverable=function(){return this.getEnabled()&&r.system.desktop};B.prototype._getImage=function(e,t,i,s){var a=o.isIconURI(t),n;if(this._image&&this._image.isA("sap.m.Image")&&a||this._image&&this._image.isA("sap.ui.core.Icon")&&!a){this._image.destroy();this._image=undefined}n=this.getIconFirst();if(this._image){this._image.setSrc(t);if(this._image.isA("sap.m.Image")){this._image.setActiveSrc(i);this._image.setDensityAware(s)}}else{this._image=o.createControlByURI({id:e,src:t,activeSrc:i,densityAware:s,useIconTooltip:false},sap.m.Image).addStyleClass("sapMBtnCustomIcon").setParent(this,null,true)}this._image.addStyleClass("sapMBtnIcon");this._image.toggleStyleClass("sapMBtnIconLeft",n);this._image.toggleStyleClass("sapMBtnIconRight",!n);return this._image};B.prototype._getInternalIconBtn=function(e,t){var i=this._iconBtn;if(i){i.setSrc(t)}else{i=o.createControlByURI({id:e,src:t,useIconTooltip:false},sap.m.Image).setParent(this,null,true)}i.addStyleClass("sapMBtnIcon");i.addStyleClass("sapMBtnIconLeft");this._iconBtn=i;return this._iconBtn};B.prototype._isUnstyled=function(){var e=false;if(this.getType()===b.Unstyled){e=true}return e};B.prototype.getPopupAnchorDomRef=function(){return this.getDomRef("inner")};B.prototype._getText=function(){return this.getText()};B.prototype._getTooltip=function(){var e,t;e=this.getTooltip_AsString();if(!e&&!this._getText()){t=o.getIconInfo(this._getAppliedIcon());if(t){e=t.text?t.text:t.name}}return e};B.prototype._getAppliedIcon=function(){return this.getIcon()||this._sTypeIconURI};B.prototype.getAccessibilityInfo=function(){var e=this._getText()||this.getTooltip_AsString();if(!e&&this._getAppliedIcon()){var i=o.getIconInfo(this._getAppliedIcon());if(i){e=i.text||i.name}}return{role:"button",type:t.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_BUTTON"),description:e,focusable:this.getEnabled(),enabled:this.getEnabled()}};B.prototype._setButtonFocus=function(){setTimeout(function(){this.focus()}.bind(this),0)};B.prototype._determineSelfReferencePresence=function(){var e=this.getAriaLabelledBy(),t=e.indexOf(this.getId())!==-1,i=p.getReferencingLabels(this).length>0,s=this.getParent(),a=!!(s&&s.enhanceAccessibilityState);return!t&&this._getText()&&(e.length>0||i||a||this._isBadgeButton())};B.prototype._determineAccessibilityType=function(){var e=this.getAriaLabelledBy().length>0,t=this.getAriaDescribedBy().length>0,i=p.getReferencingLabels(this).length>0,s=this.getType()!==b.Default,a=e||i||this._determineSelfReferencePresence(),n=t||s||this._isBadgeButton(),o;if(!a&&!n){o=y.Default}else if(a&&!n){o=y.Labelled}else if(!a&&n){o=y.Described}else if(a&&n){o=y.Combined}return o};B.prototype._isBadgeButton=function(){return this._oBadgeData&&this._oBadgeData.value!==""&&this._oBadgeData.State!==m.Disappear};B.prototype._getTitleAttribute=function(e){return this.getTooltip()};return B});