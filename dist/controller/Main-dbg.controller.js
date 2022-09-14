sap.ui.define(["./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/ui/core/format/NumberFormat"], function (__BaseController, __formatter, JSONModel, NumberFormat) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }

  const BaseController = _interopRequireDefault(__BaseController);

  const formatter = _interopRequireDefault(__formatter);

  /**
   * @namespace de.henloh.prodts.controller
   */
  const Main = BaseController.extend("de.henloh.prodts.controller.Main", {
    constructor: function constructor() {
      BaseController.prototype.constructor.apply(this, arguments);
      this.formatter = formatter;
    },
    onInit: function _onInit() {
      var Model = new JSONModel();
      Model.setData({
        Factory: "",
        isFactory: false,
        Products: [],
        Materials: [],
        Cost: 0,
        ProductionCap: 0,
        Product: "",
        isProduct: false,
        BoughtBy: [],
        ProducedBy: [],
        Dangerous: false,
        Illegal: false,
        AvgPrice: 0,
        Level: 0
      });
      this.getView().setModel(Model, "View");
      this.getRouter().getRoute("main").attachPatternMatched(this.onPatternMatched, this);
      var inputG = this.byId("productInput");
      var inputF = this.byId("factoryInput");
      inputG.setFilterFunction(function (sTerm, oItem) {
        return oItem.getText().match(new RegExp("^" + sTerm, "i"));
      });
      inputF.setFilterFunction(function (sTerm, oItem) {
        return oItem.getText().match(new RegExp("^" + sTerm, "i"));
      });
    },
    onPatternMatched: function _onPatternMatched(event) {
      var Model = new JSONModel();
      Model.setData(this.getData());
      this.getView().setModel(Model, "Data");
      var ViewModel = this.getView().getModel("View");

      try {
        var query = event.getParameter("arguments")["?query"];

        if (query.factory) {
          ViewModel.setProperty("/Factory", query.factory.replace("%2520", " "));
          this.submitFactory(event);
        }

        if (query.good) {
          ViewModel.setProperty("/Product", query.good.replace("%2520", " "));
          this.submitGood(event);
        }
      } catch (error) {
        console.error(error);
      }
    },
    submitGood: function _submitGood(event) {
      var Data = this.getData();
      var Model = this.getView().getModel("View");
      var Product = Data.getProduct(Model.getProperty("/Product"));
      Model.setProperty("/isProduct", true);
      Model.setProperty("/isFactory", false);
      Model.setProperty("/Illegal", Product.Illegal);
      Model.setProperty("/Dangerous", Product.Dangerous);
      Model.setProperty("/AvgPrice", Product.AvgPrice);
      Model.setProperty("/Level", Product.Level);
      Model.setProperty("/BoughtBy", Data.getCustomersOfProduct(Product.Name));
      Model.setProperty("/ProducedBy", Data.getFactoriesFromProduct(Product.Name));
      this.getRouter().navTo("main", {
        query: {
          good: Model.getProperty("/Product")
        }
      }, {}, true);
    },
    submitFactory: function _submitFactory(event) {
      var Data = this.getData();
      var Model = this.getView().getModel("View");
      var Factory = Data.getFactory(Model.getProperty("/Factory"));
      Model.setProperty("/isProduct", false);
      Model.setProperty("/isFactory", true);
      Model.setProperty("/Cost", Factory.Cost);
      Model.setProperty("/ProductionCap", Factory.ProductionCap);
      Model.setProperty("/Materials", Data.getMaterialsForFactory(Factory.Name));
      Model.setProperty("/Products", Data.getProductsFromFactory(Factory.Name));
      this.getRouter().navTo("main", {
        query: {
          factory: Model.getProperty("/Factory")
        }
      }, {}, true);
    },
    onSelectNewFactory: function _onSelectNewFactory(event, Factory) {
      var Model = this.getView().getModel("View");
      Model.setProperty("/Factory", Factory);
      this.submitFactory(event);
    },
    onSelectNewProduct: function _onSelectNewProduct(event, Product) {
      var Model = this.getView().getModel("View");
      Model.setProperty("/Product", Product);
      this.submitGood(event);
    },
    FormatCredits: function _FormatCredits(number) {
      var format = NumberFormat.getIntegerInstance({
        groupingEnabled: true,
        groupingSize: 3,
        groupingSeparator: ","
      });
      return format.format(number);
    },
    showAllProducts: function _showAllProducts(event) {
      var Model = this.getView().getModel("View");
      var that = this;
      Model.setProperty("/isProduct", false);
      Model.setProperty("/isFactory", true);
      Model.setProperty("/Cost", "");
      Model.setProperty("/ProductionCap", "");
      Model.setProperty("/Materials", []);
      var data = that.getData().Goods; //console.log(data);

      Model.setProperty("/Products", data);
    },
    showAllFactories: function _showAllFactories(event) {
      var Model = this.getView().getModel("View");
      var that = this;
      Model.setProperty("/isProduct", true);
      Model.setProperty("/isFactory", false);
      Model.setProperty("/Illegal", false);
      Model.setProperty("/Dangerous", false);
      Model.setProperty("/AvgPrice", "");
      Model.setProperty("/Level", "");
      Model.setProperty("/BoughtBy", []);
      var data = that.getData().Factories; //console.log(data);

      Model.setProperty("/ProducedBy", data);
    }
  });
  return Main;
});
//# sourceMappingURL=Main.controller.js.map