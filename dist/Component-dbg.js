sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "./model/models", "sap/ui/model/json/JSONModel", "sap/ui/core/ComponentSupport", "sap/ui/core/date/Gregorian", "sap/ui/model/type/Date"], function (UIComponent, sap_ui_Device, __models, JSONModel, sap_ui_core_ComponentSupport, sap_ui_core_date_Gregorian, sap_ui_model_type_Date) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const support = sap_ui_Device["support"];
  const models = _interopRequireDefault(__models);
  /**
   * @namespace de.henloh.prodts
   */
  const Component = UIComponent.extend("de.henloh.prodts.Component", {
    metadata: {
      manifest: "json",
      interfaces: ["sap.ui.core.IAsyncContentCreation"]
    },
    init: function _init() {
      // call the base component's init function
      UIComponent.prototype.init.call(this);
      var GoodModel = new JSONModel("./data/Products.json");
      var FactorieModel = new JSONModel("./data/Factories.json");
      GoodModel.setDefaultBindingMode("TwoWay");
      FactorieModel.setDefaultBindingMode("TwoWay");
      this.setModel(GoodModel, "GoodModel");
      this.setModel(FactorieModel, "FactorieModel");
      this.setModel(models.createDeviceModel(), "device");

      // create the views based on the url/hash
      this.getRouter().initialize();
    },
    getContentDensityClass: function _getContentDensityClass() {
      if (this.contentDensityClass === undefined) {
        // check whether FLP has already set the content density class; do nothing in this case
        if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
          this.contentDensityClass = "";
        } else if (!support.touch) {
          // apply "compact" mode if touch is not supported
          this.contentDensityClass = "sapUiSizeCompact";
        } else {
          // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
          this.contentDensityClass = "sapUiSizeCozy";
        }
      }
      return this.contentDensityClass;
    }
  });
  return Component;
});
//# sourceMappingURL=Component-dbg.js.map
