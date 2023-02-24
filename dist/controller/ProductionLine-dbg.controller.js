sap.ui.define(["./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "./Types", "sap/m/Panel", "sap/m/Select", "sap/ui/core/Item", "sap/m/Title", "sap/m/Button"], function (__BaseController, __formatter, JSONModel, ___Types, Panel, Select, Item, Title, Button) {
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
  class treeGood extends Product {
    constructor(good, path, control, factoryOptions, parent) {
      super(good.Name, good.Dangerous, good.Illegal, good.AvgPrice, good.Level, good.Customers, good.Manufacturer);
      this.path = path;
      this.control = control;
      this.factoryOptions = factoryOptions;
      this.parent = parent;
    }
    getActiveFactory() {
      for (const factory of this.factoryOptions) {
        if (factory.active) {
          return factory;
        }
      }
    }
  }
  class treeFactory extends Factory {
    constructor(factory, path, requiredProducts, control, active, parent) {
      super(factory.Name, factory.ProductionCap, factory.Cost, factory.Products, factory.Materials);
      this.selectid = factory.Name.replace(/\s/g, '');
      this.path = path;
      this.requiredProducts = requiredProducts;
      this.control = control;
      this.active = active;
      this.parent = parent;
    }
    getMaterialLevelCombined(game) {
      var result = 0;
      for (const product of this.Materials) {
        result += game.getProduct(product).Level;
      }
      return result;
    }
  }
  class ProductionLine extends BaseController {
    formatter = formatter;
    onInit() {
      var Model = new JSONModel();
      Model.setData({
        TargetFactory: "",
        products: [],
        mainFactory: {},
        deathZone: [],
        tree: [],
        ownedFactories: [],
        requiredFactories: []
      });
      this.getView().setModel(Model, "View");
      this.getRouter().getRoute("productionLine").attachPatternMatched(this.onPatternMatched, this);
      var inputF = this.byId("targetFactoryInput");
      inputF.setFilterFunction(function (sTerm, oItem) {
        return oItem.getText().match(new RegExp("^" + sTerm, "i"));
      });
    }
    async generateProductionLine(event) {
      var that = this;
      var view = this.getView();
      var game = new Game(this.getModel("GoodModel").getProperty("/Goods"), this.getModel("FactorieModel").getProperty("/Factories"));
      // avoid duplicate ID
      var Panelcount = 0;
      var currentPath = "";
      var viewModel = this.getModel("View");
      // remove previos items 
      var deathArray = viewModel.getProperty("/deathZone");
      for (const control of deathArray) {
        control.destroy();
      }
      deathArray = [];
      // list of total required factories
      var requiredFactories = [];
      var TargerFactoryName = view.byId("targetFactoryInput").getValue();
      var TargetFactory = game.getFactory(TargerFactoryName);
      viewModel.setProperty("/mainFactory", TargetFactory);
      var TargetFactoryGoods = game.getProductsFromFactory(TargetFactory.Name);
      viewModel.setProperty("/products", TargetFactoryGoods);
      var getFactoryMaterialPanels = function (good, currentPath, factory) {
        var materialarray = game.getMaterialsForFactory(factory.Name);

        //console.log(materialarray);
        for (const material of materialarray) {
          var path = currentPath + "/" + material.Name.replace(/\s/g, '');
          factory.requiredProducts.push(new treeGood(material, path, null, [], factory.path));
        }
        for (var material of factory.requiredProducts) {
          material = getFactoryOrSelectWithPanel(material, factory.active);
          factory.control.addContent(material.control);
        }
        return good;
      };
      var getFactoryOrSelectWithPanel = function (good, isParentActive) {
        currentPath = currentPath + "/" + good.Name.replace(/\s/g, '');
        //console.log(currentPath);

        var id = good.Name.replace(/\s/g, '');
        //console.log(`{View>/tree${currentPath}/Name}`);
        good.control = new Panel(id + Panelcount, {
          expanded: false,
          expandable: true,
          headerText: `{View>/tree${currentPath}/Name}`
        });
        viewModel.setProperty("/tree" + currentPath, good);
        deathArray.push(good.control);
        Panelcount++;
        var factories = game.getFactoriesForProduct(good.Name);
        //console.log(factories);
        try {
          for (const factory of factories) {
            var path = currentPath + "/" + factory.Name.replace(/\s/g, '');
            good.factoryOptions.push(new treeFactory(factory, path, [], null, false));
          }
        } catch (error) {
          console.warn("No factory for " + good.Name);
          return good;
        }
        // für requiered factories dürfen nur die aktiven gewertet werden
        if (good.factoryOptions.length == 0) return good;
        if (factories.length == 1) {
          good.factoryOptions[0].active = isParentActive;
          var path = currentPath + "/" + good.factoryOptions[0].Name.replace(/\s/g, '');
          // verhindern von endlos rekursion (Mine braucht Borher, Bohrer braucht Stahl, Stahl braucht Mine)
          if (good.Level == 0) {
            good.factoryOptions[0].control = new Title(id + Panelcount, {
              //text: good.factoryOptions[0].Name
              text: `{View>/tree${path}/Name}`
            });
            good.control.addContent(good.factoryOptions[0].control);
          } else {
            good.factoryOptions[0].control = new Panel(id + Panelcount, {
              expanded: true,
              expandable: true,
              headerText: `{View>/tree${path}/Name}`
            });
            good.control.addContent(good.factoryOptions[0].control);
            good = getFactoryMaterialPanels(good, currentPath, good.factoryOptions[0]);
          }
          Panelcount++;
          deathArray.push(good.factoryOptions[0].control);
          if (good.factoryOptions[0].active) {
            requiredFactories.indexOf(good.factoryOptions[0].Name) === -1 ? requiredFactories.push(good.factoryOptions[0].Name) : null;
          }
          viewModel.setProperty(`/tree${path}`, good.factoryOptions[0]);
        } else {
          // auswahl an möglichen Produzenten
          //viewModel.setProperty(`/tree${currentPath}/factoryOptions`, good.factoryOptions);
          var select = new Select(id + Panelcount, {
            selectedItem: `View>/tree${currentPath}/activeChild`,
            items: {
              path: `View>/tree${currentPath}/factoryOptions`,
              template: new Item({
                text: "{View>Name}",
                key: "{View>selectid}"
              }),
              templateShareable: true
            },
            change: that.selectFactory
          });
          Panelcount++;
          var button = new Button(id + Panelcount, {
            text: `Apply to all {View>/tree${currentPath}/Name} facilities.`,
            press: that.setBaseFactory
          }).addStyleClass("sapUiSmallMarginBegin");
          Panelcount++;
          good.control.addContent(select);
          good.control.addContent(button);
          deathArray.push(select);
          deathArray.push(button);
          // ermittle welche fabrik die "einfachsten" komponenten hat
          var easiestfactory;
          var compare = -1;
          for (const factory of good.factoryOptions) {
            if (compare == -1) {
              easiestfactory = factory.Name;
              compare = factory.getMaterialLevelCombined(game);
            }
            if (factory.getMaterialLevelCombined(game) < compare) {
              easiestfactory = factory.Name;
              compare = factory.getMaterialLevelCombined(game);
            }
          }
          select.setSelectedKey(easiestfactory.replace(/\s/g, ''));
          for (var factory of good.factoryOptions) {
            id = good.Name.replace(/\s/g, '') + factory.Name.replace(/\s/g, '');
            var path = currentPath + "/" + factory.Name.replace(/\s/g, '');
            if (good.Level == 0) {
              factory.control = new Title(id + Panelcount, {
                text: `{View>/tree${path}/Name}`,
                width: "100%",
                visible: `{View>/tree${path}/active}`
              });
              deathArray.push(factory.control);
              Panelcount++;
              good.control.addContent(factory.control);
            } else {
              factory.control = new Panel(id + Panelcount, {
                expanded: true,
                headerText: `{View>/tree${path}/Name}`,
                expandable: true,
                visible: `{View>/tree${path}/active}`
              });
              deathArray.push(factory.control);
              Panelcount++;
              good.control.addContent(factory.control);
              good = getFactoryMaterialPanels(good, currentPath, factory);
            }
            factory.parent = currentPath;
            if (isParentActive) {
              factory.active = factory.Name == easiestfactory;
            } else {
              factory.active = false;
            }
            viewModel.setProperty("/tree" + path, factory);
            if (factory.active) {
              requiredFactories.indexOf(factory.Name) === -1 ? requiredFactories.push(factory.Name) : null;
            }
          }
        }
        currentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
        return good;
      };
      var productionGoods = game.getMaterialsForFactory(TargetFactory.Name);
      var finalTree = [];
      for (const good of productionGoods) {
        finalTree.push(new treeGood(good, "/" + good.Name.replace(/\s/g, ''), null, []));
      }
      for (var treeitem of finalTree) {
        treeitem = getFactoryOrSelectWithPanel(treeitem, true);
        // var panel = getPanelWithSelect(good.Name)
        // var treeitem = new treeGood(good, panel, await buildTree(good, panel))
        // panel.setModel(new JSONModel(treeitem.factoryOptions), "Binding")
        // ProductionTree.push(treeitem)
      }

      for (const vboxItem of finalTree) {
        that.byId("DetailedProdList").addItem(vboxItem.control);
      }
      //console.log(finalTree);
      viewModel.setProperty("/prodTree", finalTree);
      //console.log(viewModel.getProperty("/tree"));

      viewModel.setProperty("/deathZone", deathArray);
      viewModel.setProperty("/requiredFactories", requiredFactories.sort());
    }
    selectFactory(event) {
      var select = event.getSource();
      var item = event.getParameters().selectedItem;
      var viewModel = this.getModel("View");
      //console.log(((event.getSource() as Select).getParent() as Panel).getContent());
      var path = select.getBindingPath("items");
      var factoryOptions = viewModel.getProperty(path);
      for (var i = 0; i < factoryOptions.length; i++) {
        viewModel.setProperty(path + `/${i}/active`, false);
        if (viewModel.getProperty(path + `/${i}/Name`) == item.getText()) {
          viewModel.setProperty(path + `/${i}/active`, true);
        }
      }
      // Liste an Aktiven anpassen
      var requiredFactories = [];
      var getFlat = function (material) {
        try {
          var factory = material.getActiveFactory();
          requiredFactories.indexOf(factory.Name) === -1 ? requiredFactories.push(factory.Name) : null;
          for (const supliment of factory.requiredProducts) {
            getFlat(supliment);
          }
        } catch (error) {
          console.warn("No factory");
          // console.warn(error)
        }
      };

      var supplements = viewModel.getProperty("/mainFactory").Materials;
      for (const supplement of supplements) {
        getFlat(viewModel.getProperty("/tree/" + supplement.replace(/\s/g, '')));
      }
      //console.log(viewModel.getProperty("/prodTree"));
      //console.log(requiredFactories);

      viewModel.setProperty("/requiredFactories", requiredFactories.sort());
    }
    setBaseFactory(event) {
      var viewModel = this.getModel("View");
      // loop base products!
      // get into details
      // till infinity - also halt so viele ebenen dies gibt. 
      // select setzten und richtige factory visible machen
      // vorher rausfinden welche Fabrik geändert wurde!
      // und ich brauch noch die neue factory!
      var button = event.getSource();
      var path = button.getBindingPath("text");
      var Material = viewModel.getProperty(path);
      // erstes control ist immer das select da es den button nur bei Produkten gibt die mehrere hersteller haben
      var newFactory = viewModel.getProperty(path.substring(0, path.lastIndexOf("/")));
      newFactory = newFactory.control.getContent()[0].getSelectedItem().getText();
      var supplements = viewModel.getProperty("/mainFactory").Materials;
      var setFactory = function (supplement) {
        if (supplement.Name == Material) {
          var select = supplement.control.getContent()[0];
          select.setSelectedKey(newFactory.replace(/\s/g, ''));
          var basePath = "/tree" + supplement.path + "/factoryOptions/";
          for (let i = 0; i < supplement.factoryOptions.length; i++) {
            viewModel.setProperty(basePath + i + "/active", false);
          }
          for (let i = 0; i < supplement.factoryOptions.length; i++) {
            if (newFactory == viewModel.getProperty(basePath + i + "/Name")) {
              viewModel.setProperty(basePath + i + "/active", true);
              break;
            }
          }
          //viewModel.setProperty("/tree" + supplement.path + "/" + newFactory.replace(/\s/g, '') + "/active", true)				
          // console.log(viewModel.getProperty("/tree" + supplement.path + "/" + newFactory.replace(/\s/g, '') + "/active"));
          // checken ob der change zu /i/ auch auf die /factoryname im material wirkt
          // getflat funktioniert nicht richtig, wenn alle steel auf von 1 auf 2 gestellt werden wird 
          // steel1 trotzdem gelistet was nicht sein kann denn alle wurden umgestellt
        } else {
          for (const factory of supplement.factoryOptions) {
            for (const material of factory.requiredProducts) {
              setFactory(material);
            }
          }
        }
      };
      for (const supplement of supplements) {
        setFactory(viewModel.getProperty("/tree/" + supplement.replace(/\s/g, '')));
      }
      // Liste an Aktiven anpassen
      var requiredFactories = [];
      var getFlat = function (material) {
        try {
          var factory = material.getActiveFactory();
          requiredFactories.indexOf(factory.Name) === -1 ? requiredFactories.push(factory.Name) : null;
          for (const supliment of factory.requiredProducts) {
            getFlat(supliment);
          }
        } catch (error) {
          console.warn("No factory");
          // console.warn(error)
        }
      };

      for (const supplement of supplements) {
        getFlat(viewModel.getProperty("/tree/" + supplement.replace(/\s/g, '')));
      }
      viewModel.setProperty("/requiredFactories", requiredFactories.sort());
    }
    onDropHave(event) {
      var oDragged = event.getParameter("draggedControl"),
        List = oDragged.getParent(),
        iDragPosition = List.indexOfItem(oDragged);
      var viewModel = this.getModel("View");
      var aItems = viewModel.getProperty("/requiredFactories");
      var resultItems = viewModel.getProperty("/ownedFactories");

      // remove the item
      var oItem = aItems[iDragPosition];
      aItems.splice(iDragPosition, 1);
      resultItems.push(oItem);
      viewModel.setProperty("/ownedFactories", resultItems);
      viewModel.setProperty("/requiredFactories", aItems);
    }
    onPatternMatched(event) {}
  }
  return ProductionLine;
});
//# sourceMappingURL=ProductionLine.controller.js.map