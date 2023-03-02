sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "./Types", "sap/ui/core/routing/History"], function (Controller, UIComponent, ___Types, History) {
  const Game = ___Types["Game"];

  /**
   * @namespace de.henloh.prodts.controller
   */
  const BaseController = Controller.extend("de.henloh.prodts.controller.BaseController", {
    getOwnerComponent: function _getOwnerComponent() {
      return Controller.prototype.getOwnerComponent.call(this);
    },
    getRouter: function _getRouter() {
      return UIComponent.getRouterFor(this);
    },
    getResourceBundle: function _getResourceBundle() {
      const oModel = this.getOwnerComponent().getModel("i18n");
      return oModel.getResourceBundle();
    },
    getModel: function _getModel(sName) {
      return this.getView().getModel(sName);
    },
    setModel: function _setModel(oModel, sName) {
      this.getView().setModel(oModel, sName);
      return this;
    },
    navTo: function _navTo(sName, oParameters, bReplace) {
      this.getRouter().navTo(sName, oParameters, undefined, bReplace);
    },
    onNavBack: function _onNavBack() {
      const sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("main", {}, undefined, true);
      }
    },
    getData: function _getData() {
      var products = this.getOwnerComponent().getModel("Goods");
      var factories = this.getOwnerComponent().getModel("Factories"); //console.log(products);
      //console.log(
      //	factories.getProperty("/"));

      return new Game(products.getData().Goods, factories.getData().Factories);
    }
  });
  return BaseController;
});
//# sourceMappingURL=BaseController.js.map