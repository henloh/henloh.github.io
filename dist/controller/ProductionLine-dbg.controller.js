sap.ui.define(["sap/m/MessageBox", "./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "./Types", "sap/m/Panel", "sap/m/Select", "sap/ui/core/Item", "sap/m/Title", "sap/m/Button", "sap/ui/core/Fragment", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/util/File"], function (MessageBox, __BaseController, __formatter, JSONModel, ___Types, Panel, Select, Item, Title, Button, Fragment, Filter, FilterOperator, File) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const formatter = _interopRequireDefault(__formatter);
  const Factory = ___Types["Factory"];
  const Game = ___Types["Game"];
  const Product = ___Types["Product"];
  /**
   * @namespace de.henloh.prodts.controller
   */
  /*
  .########..########...#######..########..##.....##..######..########
  .##.....##.##.....##.##.....##.##.....##.##.....##.##....##....##...
  .##.....##.##.....##.##.....##.##.....##.##.....##.##..........##...
  .########..########..##.....##.##.....##.##.....##.##..........##...
  .##........##...##...##.....##.##.....##.##.....##.##..........##...
  .##........##....##..##.....##.##.....##.##.....##.##....##....##...
  .##........##.....##..#######..########...#######...######.....##...
  */
  class treeGood extends Product {
    constructor(good, game, parent) {
      super(good.Name, good.Dangerous, good.Illegal, good.AvgPrice, good.Level, good.Customers, good.Manufacturer);
      this.parent = parent;
      this.game = game;
      this.factoryOptions = [];
      this.subs = {};
    }
    getId() {
      // Parent ist entweder game oder factory
      //@ts-ignore
      if (this.parent.getId) {
        //@ts-ignore
        return this.parent.getId() + "/" + this.Name.replace(/\s/g, '');
      } else {
        return this.Name.replace(/\s/g, '');
      }
    }
    getActiveFactory() {
      var facs = [];
      for (const factory of this.factoryOptions) {
        if (factory.active) {
          facs = facs.concat(factory.getActiveSubs());
          facs.indexOf(factory.Name) === -1 ? facs.push(factory.Name) : null;
          return facs;
        }
      }
    }
    getExportFactory() {
      var result = {};
      for (const factory of this.factoryOptions) {
        if (factory.active) {
          result.Name = factory.Name;
          result.requiredProducts = [];
          for (const product of factory.requiredProducts) {
            result.requiredProducts.push({
              Name: product.Name,
              Factory: product.getExportFactory()
            });
          }
        }
      }
      return result;
    }
    getSubGoods() {
      var result = [];
      for (const factory of this.factoryOptions) {
        result = result.concat(factory.getAllGoods());
      }
      return result;
    }
    setActiveFactory(Name) {
      if (!(this.factoryOptions.length > 0)) return;
      for (const factory of this.factoryOptions) {
        factory.active = false;
        if (factory.Name == Name) {
          factory.active = true;
          if (this.factoryOptions.length > 1) {
            // first content is select
            var select = this.control.getContent()[0];
            select.setSelectedKey(factory.Name.replace(/\s/g, ''));
          }
        }
      }
    }
    // initial build select one
    setFactoryActive() {
      if (this.factoryOptions.length == 1) {
        this.factoryOptions[0].active = true;
        return this.factoryOptions[0];
      } else if (this.factoryOptions.length > 1) {
        var lowest = this.factoryOptions[0];
        for (const factory of this.factoryOptions) {
          var compare = lowest.getMaterialLevelCombined();
          if (factory.getMaterialLevelCombined() < compare) {
            lowest = factory;
          }
        }
        lowest.active = true;
        return lowest;
      }
    }
    setActiveFactoryRecursiv(Material, newFactoryName) {
      if (this.Name == Material) {
        this.setActiveFactory(newFactoryName);
        return;
      }
      if (this.factoryOptions.length > 0) {
        for (const factory of this.factoryOptions) {
          //console.log(factory.id);
          factory.checkMaterialList(Material, newFactoryName);
        }
      }
    }
    buildControl(panellevel) {
      this.id = this.getId();
      this.control = new Panel(this.Name.replace(/\s/g, '') + this.game.getPanelId(), {
        expanded: false,
        expandable: true,
        headerText: `{View>/game/subs/${this.id}/Name}`
      });
      this.control.addStyleClass("avlevel" + panellevel);
      this.game.deathZone.push(this.control);
      panellevel++;
      var factories = this.game.getFactoriesForProduct(this.Name);
      try {
        for (const factory of factories) {
          var newFactory = new treeFactory(factory, this.game, this);
          this.factoryOptions.push(newFactory);
        }
      } catch (error) {
        console.warn("No factory for " + this.Name);
        this.control.setExpandable(false);
        this.control.addStyleClass("dontShowContent");
      }
      if (this.factoryOptions.length == 1) {
        this.factoryOptions[0].buildControl(this.Level, panellevel);
        this.control.addContent(this.factoryOptions[0].control);
        // used for binding /LaserHead/LaserHeadFactory/Glass/GlassManufacturer/Ore/Name
        //@ts-ignore
        this[this.factoryOptions[0].Name.replace(/\s/g, '')] = this.factoryOptions[0];
        this.setFactoryActive();
      } else if (this.factoryOptions.length > 1) {
        var newSelect = new Select(this.Name.replace(/\s/g, '') + this.game.getPanelId(), {
          selectedItem: `View>/game/subs/${this.id}/activeChild`,
          items: {
            path: `View>/game/subs/${this.id}/factoryOptions`,
            template: new Item({
              text: "{View>Name}",
              key: "{View>selectid}"
            }),
            templateShareable: true
          },
          change: this.game.that.selectFactory
        });
        this.game.deathZone.push(newSelect);
        var lowest = this.setFactoryActive();
        newSelect.setSelectedKey(lowest.Name.replace(/\s/g, ''));
        var newButton = new Button(this.Name.replace(/\s/g, '') + this.game.getPanelId(), {
          text: `Apply to all {View>/game/subs/${this.id}/Name} facilities.`,
          press: this.game.that.setBaseFactory
        }).addStyleClass("sapUiSmallMarginBegin");
        this.game.deathZone.push(newButton);
        this.control.addContent(newSelect);
        this.control.addContent(newButton);
        for (var factory of this.factoryOptions) {
          factory.buildControl(this.Level, panellevel);
          // used for binding /LaserHead/LaserHeadFactory/Glass/GlassManufacturer/Ore/Name
          //@ts-ignore
          this[factory.Name.replace(/\s/g, '')] = factory;
          this.control.addContent(factory.control);
        }
      }
    }
  }
  /*
  .########....###.....######..########..#######..########..##....##
  .##.........##.##...##....##....##....##.....##.##.....##..##..##.
  .##........##...##..##..........##....##.....##.##.....##...####..
  .######...##.....##.##..........##....##.....##.########.....##...
  .##.......#########.##..........##....##.....##.##...##......##...
  .##.......##.....##.##....##....##....##.....##.##....##.....##...
  .##.......##.....##..######.....##.....#######..##.....##....##...
  */
  class treeFactory extends Factory {
    constructor(factory, game, parent) {
      super(factory.Name, factory.ProductionCap, factory.Cost, factory.Products, factory.Materials);
      this.parent = parent;
      this.game = game;
      this.selectid = factory.Name.replace(/\s/g, '');
      this.requiredProducts = [];
      this.active = false;
      this.subs = {};
    }
    getId() {
      return this.parent.getId() + "/" + this.Name.replace(/\s/g, '');
    }
    getMaterialLevelCombined() {
      var result = 0;
      for (const product of this.Materials) {
        result += this.game.getProduct(product).Level;
      }
      return result;
    }
    getAllGoods() {
      var allGoods = [];
      for (const good of this.requiredProducts) {
        allGoods.push(good);
        allGoods = allGoods.concat(good.getSubGoods());
      }
      return allGoods;
    }
    getActiveSubs() {
      var facs = [];
      for (const requiredProduct of this.requiredProducts) {
        facs = facs.concat(requiredProduct.getActiveFactory());
      }
      return facs;
    }
    checkMaterialList(Material, newFactoryName) {
      if (this.Products.indexOf(Material) >= 0) this.active = this.Name == newFactoryName;
      for (const requiredProduct of this.requiredProducts) {
        if (requiredProduct.Name == Material) {
          requiredProduct.setActiveFactory(newFactoryName);
        }
        requiredProduct.setActiveFactoryRecursiv(Material, newFactoryName);
      }
    }
    buildControl(goodLvl, panellevel) {
      this.id = this.getId();
      if (goodLvl == 0) {
        this.control = new Title(this.Name.replace(/\s/g, '') + this.game.getPanelId(), {
          width: "100%",
          // bool from binding
          //@ts-ignore
          visible: `{View>/game/subs/${this.id}/active}`,
          text: `{View>/game/subs/${this.id}/Name}`
        });
      } else {
        this.control = new Panel(this.Name.replace(/\s/g, '') + this.game.getPanelId(), {
          expanded: true,
          expandable: true,
          // bool from binding
          //@ts-ignore
          visible: `{View>/game/subs/${this.id}/active}`,
          headerText: `{View>/game/subs/${this.id}/Name}`
        });
        var mats = this.game.getMaterialsForFactory(this.Name);
        for (const mat of mats) {
          var newMat = new treeGood(mat, this.game, this);
          this.requiredProducts.push(newMat);
        }
        for (var reqMaterial of this.requiredProducts) {
          reqMaterial.buildControl(panellevel);
          this.control.addContent(reqMaterial.control);
          // used for binding /LaserHead/LaserHeadFactory/Glass/GlassManufacturer/Ore/Name
          //@ts-ignore
          this[reqMaterial.Name.replace(/\s/g, '')] = reqMaterial;
        }
      }
      this.game.deathZone.push(this.control);
    }
  }
  /*
  ..######......###....##.....##.########
  .##....##....##.##...###...###.##......
  .##.........##...##..####.####.##......
  .##...####.##.....##.##.###.##.######..
  .##....##..#########.##.....##.##......
  .##....##..##.....##.##.....##.##......
  ..######...##.....##.##.....##.########
  */
  class factoryGame extends Game {
    constructor(goods, factories) {
      super(goods, factories);
      this.deathZone = [];
      this.availableGoods = [];
      this.reqFactories = [];
      this.prodTree = [];
      this.products = [];
      this.panelCount = 0;
      this.subs = {};
    }
    setTargetFactory(factoryName) {
      this.targetFactory = this.getFactory(factoryName);
      this.products = this.getMaterialsForFactory(this.targetFactory.Name);
      for (const good of this.products) {
        var newGood = new treeGood(good, this, this);
        this.prodTree.push(newGood);
      }

      // to get a Binding /tree/id/attribut 
      // the array need to be changed ot objects 
      for (var treeitem of this.prodTree) {
        treeitem.buildControl(0);
        this.subs[treeitem.id] = treeitem;
      }
      return this.subs;
    }
    clearDeathZone() {
      for (const control of this.deathZone) {
        control.destroy();
      }
    }
    getActiveFactories() {
      var facs = [];
      for (var baseitem of this.prodTree) {
        facs = facs.concat(baseitem.getActiveFactory());
      }
      // only Uniques
      facs = [...new Set(facs)];
      for (let index = facs.length - 1; index > -1; index--) {
        const element = facs[index];
        if (element == undefined) facs.splice(index, 1);
      }
      return facs;
    }
    getExportTree() {
      var exportTree = {};
      for (var baseitem of this.prodTree) {
        //@ts-ignore
        exportTree[baseitem.Name] = {
          Name: baseitem.Name,
          Factory: baseitem.getExportFactory()
        };
      }
      return exportTree;
    }
    setBaseFactory(Material, newFactoryName) {
      for (var name in this.subs) {
        this.subs[name].setActiveFactoryRecursiv(Material, newFactoryName);
      }
    }
    setAvailableGood(Name) {
      this.availableGoods.push(Name);
      var allGoods = [];
      for (const good of this.prodTree) {
        allGoods.push(good);
        allGoods = allGoods.concat(good.getSubGoods());
      }
      //console.log(allGoods);
      for (const good of allGoods) {
        if (good.Name == Name) {
          good.control.addStyleClass("dontShowContent");
          good.control.setExpandable(false);
          for (const factory of good.factoryOptions) {
            factory.active = false;
          }
        }
      }
    }
    getPanelId() {
      this.panelCount++;
      return this.panelCount;
    }
  }
  /*
  ..######...#######..##....##.########.########...#######..##.......##.......########.########.
  .##....##.##.....##.###...##....##....##.....##.##.....##.##.......##.......##.......##.....##
  .##.......##.....##.####..##....##....##.....##.##.....##.##.......##.......##.......##.....##
  .##.......##.....##.##.##.##....##....########..##.....##.##.......##.......######...########.
  .##.......##.....##.##..####....##....##...##...##.....##.##.......##.......##.......##...##..
  .##....##.##.....##.##...###....##....##....##..##.....##.##.......##.......##.......##....##.
  ..######...#######..##....##....##....##.....##..#######..########.########.########.##.....##
  */
  class ProductionLine extends BaseController {
    formatter = formatter;
    onInit() {
      var Model = new JSONModel();
      Model.setData({
        TargetFactory: "",
        products: []
        //mainFactory: {},
        //deathZone: [],
        //tree: [],
        //ownedFactories: [],
        //requiredFactories: []
      });

      this.getView().setModel(Model, "View");
      this.getRouter().getRoute("productionLine").attachPatternMatched(this.onPatternMatched, this);
      var inputF = this.byId("targetFactoryInput");
      //@ts-ignore
      inputF.setFilterFunction(function (sTerm, oItem) {
        return oItem.getText().match(new RegExp("^" + sTerm, "i"));
      });
    }
    /*
    .########..########...#######..########..........##.......####.##....##.########
    .##.....##.##.....##.##.....##.##.....##.........##........##..###...##.##......
    .##.....##.##.....##.##.....##.##.....##.........##........##..####..##.##......
    .########..########..##.....##.##.....##.#######.##........##..##.##.##.######..
    .##........##...##...##.....##.##.....##.........##........##..##..####.##......
    .##........##....##..##.....##.##.....##.........##........##..##...###.##......
    .##........##.....##..#######..########..........########.####.##....##.########
    */
    async generateProductionLine(event) {
      var that = this;
      var view = this.getView();
      var viewModel = this.getModel("View");
      var game;
      try {
        game = viewModel.getProperty("/game");
        if (game) {
          game.clearDeathZone();
        }
        // Clear
        game = new factoryGame(this.getModel("GoodModel").getProperty("/Goods"), this.getModel("FactorieModel").getProperty("/Factories"));
      } catch (error) {
        console.error(error);
      }
      game.that = that;
      var TargetFactoryName = view.byId("targetFactoryInput").getValue();
      viewModel.setProperty("/products", game.getProductsFromFactory(TargetFactoryName));
      game.setTargetFactory(TargetFactoryName);
      for (var name in game.subs) {
        that.byId("DetailedProdList").addItem(game.subs[name].control);
      }
      //console.log(xtree);

      viewModel.setProperty("/game", game);
      viewModel.setProperty("/requiredFactories", game.getActiveFactories().sort());
    }
    /*
    ..######..##.....##....###....##....##..######...########
    .##....##.##.....##...##.##...###...##.##....##..##......
    .##.......##.....##..##...##..####..##.##........##......
    .##.......#########.##.....##.##.##.##.##...####.######..
    .##.......##.....##.#########.##..####.##....##..##......
    .##....##.##.....##.##.....##.##...###.##....##..##......
    ..######..##.....##.##.....##.##....##..######...########
    */
    selectFactory(event) {
      var select = event.getSource();
      // getParameters() returns a undefined Object
      //@ts-ignore
      var item = event.getParameters().selectedItem;
      var viewModel = this.getModel("View");
      var path = select.getBindingPath("items"); // > game/subs/[Material]/.../factoryOptions
      var factoryOptions = viewModel.getProperty(path);
      for (var i = 0; i < factoryOptions.length; i++) {
        viewModel.setProperty(path + `/${i}/active`, false);
        if (viewModel.getProperty(path + `/${i}/Name`) == item.getText()) {
          viewModel.setProperty(path + `/${i}/active`, true);
        }
      }
      var game = viewModel.getProperty("/game");
      viewModel.setProperty("/requiredFactories", game.getActiveFactories().sort());
    }
    /*
    ..######..##.....##....###....##....##..######...########............###....##.......##......
    .##....##.##.....##...##.##...###...##.##....##..##.................##.##...##.......##......
    .##.......##.....##..##...##..####..##.##........##................##...##..##.......##......
    .##.......#########.##.....##.##.##.##.##...####.######...#######.##.....##.##.......##......
    .##.......##.....##.#########.##..####.##....##..##...............#########.##.......##......
    .##....##.##.....##.##.....##.##...###.##....##..##...............##.....##.##.......##......
    ..######..##.....##.##.....##.##....##..######...########.........##.....##.########.########
    */
    setBaseFactory(event) {
      var viewModel = this.getModel("View");
      var game = viewModel.getProperty("/game");
      var button = event.getSource();
      var path = button.getBindingPath("text");
      var Material = viewModel.getProperty(path);
      var newFactory = viewModel.getProperty(path.substring(0, path.lastIndexOf("/")));
      // first control is the select
      newFactory = newFactory.control.getContent()[0].getSelectedItem().getText();
      // console.log(Material, newFactory);
      game.setBaseFactory(Material, newFactory);
      viewModel.setProperty("/game", game);
      viewModel.setProperty("/requiredFactories", game.getActiveFactories().sort());
    }
    /*
    .########..####....###....##........#######...######..
    .##.....##..##....##.##...##.......##.....##.##....##.
    .##.....##..##...##...##..##.......##.....##.##.......
    .##.....##..##..##.....##.##.......##.....##.##...####
    .##.....##..##..#########.##.......##.....##.##....##.
    .##.....##..##..##.....##.##.......##.....##.##....##.
    .########..####.##.....##.########..#######...######..
    */
    addAvailableGood(event) {
      var oView = this.getView();
      var that = this;
      try {
        that.selectDialog.open("");
      } catch (error) {
        Fragment.load({
          id: "speccalDialog",
          name: "de.henloh.prodts.view.Dialog",
          controller: this
        }).then(function (dialog) {
          dialog.setModel(oView.getModel("GoodModel"));
          dialog.open("");
          that.selectDialog = dialog;
        }.bind(this));
      }
    }
    onDialogClose(event) {
      var aContexts = event.getParameter("selectedContexts");
      var viewModel = this.getModel("View");
      var game = viewModel.getProperty("/game");
      if (aContexts && aContexts.length) {
        aContexts.map(function (oContext) {
          try {
            game.setAvailableGood(oContext.getObject().Name);
          } catch (error) {
            console.warn(error);
          }
        });
        viewModel.setProperty("/availableGoods", game.availableGoods);
        viewModel.setProperty("/game", game);
      }
      // Binding is not definied. Filtering is possible here
      //@ts-ignore 
      event.getSource().getBinding("items").filter([]);
      viewModel.setProperty("/requiredFactories", game.getActiveFactories().sort());
    }
    onSearch(event) {
      var sValue = event.getParameter("value");
      var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
      var oBinding = event.getParameter("itemsBinding");
      oBinding.filter([oFilter]);
    }
    /*
    .####.##.....##.########.......####.......########.##.....##.########...#######..########..########
    ..##..###...###.##.....##.....##..##......##........##...##..##.....##.##.....##.##.....##....##...
    ..##..####.####.##.....##......####.......##.........##.##...##.....##.##.....##.##.....##....##...
    ..##..##.###.##.########......####........######......###....########..##.....##.########.....##...
    ..##..##.....##.##...........##..##.##....##.........##.##...##........##.....##.##...##......##...
    ..##..##.....##.##...........##...##......##........##...##..##........##.....##.##....##.....##...
    .####.##.....##.##............####..##....########.##.....##.##.........#######..##.....##....##...
    */
    handleDownloadPress() {
      // Convert the JSON data to a string
      var viewModel = this.getModel("View");
      var game = viewModel.getProperty("/game");
      var data = {
        targetFactory: viewModel.getProperty("/TargetFactory"),
        availableGoods: viewModel.getProperty("/availableGoods"),
        requiredFactories: viewModel.getProperty("/requiredFactories"),
        products: viewModel.getProperty("/products"),
        basicTree: game.getExportTree()
      };
      var jsonString = JSON.stringify(data);

      // Use the FileSaver.js library to trigger a download
      File.save(jsonString, "data", "json", "application/json", "utf-8");
    }
    openUploadDialog(event) {
      //var oView = this.getView();
      var that = this;
      try {
        that.importDialog.open();
      } catch (error) {
        Fragment.load({
          id: "speccalDialog2",
          name: "de.henloh.prodts.view.Import",
          controller: this
        }).then(function (dialog) {
          //(dialog as Dialog).setModel(oView.getModel("GoodModel"));
          dialog.open();
          that.importDialog = dialog;
        }.bind(this));
      }
    }
    closeDialog(event) {
      this.importDialog.close();
    }
    handleUploadPress(event) {
      // Get the selected file from the input element
      var file = event.getParameters().item.getFileObject();
      var that = this;
      var reader = new FileReader();
      var viewModel = this.getModel("View");

      // Read the file as text
      reader.readAsText(file);

      // When the file has been read, convert it to a JavaScript object
      reader.onload = function () {
        var data = JSON.parse(reader.result);
        //console.log(data);
        try {
          viewModel.setProperty("/TargetFactory", data.targetFactory);
          viewModel.setProperty("/availableGoods", data.availableGoods);
          viewModel.setProperty("/requiredFactories", data.requiredFactories);
          viewModel.setProperty("/products", data.products);
          var basicTree = data.basicTree;
          var game;
          game = viewModel.getProperty("/game");
          if (game) {
            game.clearDeathZone();
          }
          // Clear
          game = new factoryGame(that.getModel("GoodModel").getProperty("/Goods"), that.getModel("FactorieModel").getProperty("/Factories"));
          game.that = that;
          game.setTargetFactory(data.targetFactory);
          for (var name in game.subs) {
            that.byId("DetailedProdList").addItem(game.subs[name].control);
          }
          viewModel.setProperty("/game", game);
        } catch (error) {
          MessageBox.show("Uploaded data does not contain a production-tree.");
        }
        // Do something with the JavaScript object
      };
    }

    onPatternMatched(event) {}
  }
  return ProductionLine;
});
//# sourceMappingURL=ProductionLine.controller.js.map