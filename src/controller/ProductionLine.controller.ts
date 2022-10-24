import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input from "sap/m/Input";
import SuggestionItem from "sap/m/SuggestionItem";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import { Factory, Game, Product } from "./Types";
import VBox from "sap/m/VBox";
import Control from "sap/ui/core/Control";
import Panel from "sap/m/Panel";
import Fragment from "sap/ui/core/Fragment";
import Select from "sap/m/Select";

/**
 * @namespace de.henloh.prodts.controller
 */
class treeGood extends Product {
	factoryOptions: Factory[];
	constructor(good: Product, factoryOptions: Factory[]) {
		super(good.Name, good.Dangerous, good.Illegal, good.AvgPrice, good.Level, good.Customers, good.Manufacturer);
		
		this.factoryOptions = factoryOptions
	}
}
class treeFactory extends Factory {
	requiredProducts: Product[];
	constructor(factory: Factory, requiredProducts: Product[]) {
		super(factory.Name,factory.ProductionCap,factory.Cost,factory.Products,factory.Materials);
		
		this.requiredProducts = requiredProducts
	}
}
export default class ProductionLine extends BaseController {
	private formatter = formatter;
	
	public onInit(): void {
		var Model = new JSONModel();
		Model.setData({
			TargetFactory: "",
			products: [],
            mainFactory: {}
		});
		this.getView().setModel(Model, "View");
		this.getRouter().getRoute("productionLine").attachPatternMatched(this.onPatternMatched, this);

		var inputF = this.byId("targetFactoryInput") as Input
		inputF.setFilterFunction(function (sTerm: string, oItem:SuggestionItem) {
			return oItem.getText().match(new RegExp("^"+sTerm, "i"));
		});
	}
	public async generateProductionLine(event: Event): Promise<void> {
		var that = this;
		var view = this.getView();
		var Panelcount = 0;
		var viewModel = this.getModel("View") as JSONModel;
        var game = new Game(this.getModel("GoodModel").getProperty("/Goods"), this.getModel("FactorieModel").getProperty("/Factories"));
		var TargerFactoryName = (view.byId("targetFactoryInput") as Input).getValue();
		var TargetFactory = game.getFactory(TargerFactoryName);
		var TargetFactoryGoods = game.getProductsFromFactory(TargetFactory.Name);
		viewModel.setProperty("/products", TargetFactoryGoods);
		// recursion UI elemente
		var getPanel = function(product: string) {
			var id = product.replace(/\s/g, '');
			var mp = new Panel(id + Panelcount, {
				expanded: true,
				headerText: product
			})
			mp.addContent(new Select({
				change: that.selectFactory
			}))
			Panelcount++
			return mp
		}
		// expand products with tree view parameters
		var ProductionTree: treeGood[] = [];
		var buildTree = async function(good: Product, ParentControlID: string) : Promise<treeFactory[]> {
			var factories = game.getFactoriesForProduct(good.Name);
			var result: treeFactory[] = [];
			for (const factory of factories) {
				try {
					if (good.Level == 0) {
						result.push(new treeFactory(factory, []))
					} else {
						var requiredProducts: treeGood[] = [];
						for (const goodName of factory.Materials) {
							var good = game.getProduct(goodName);
							// draw to app
							var vbox;
							// var oFragment = await that.loadFragment({name: "de.henloh.prodts.view.ProductionPanel"});
							var newPanel = getPanel(good.Name)
							if (ParentControlID == null) {
								ParentControlID = "DetailedProdList";
								vbox = that.byId(ParentControlID) as VBox;
								vbox.addItem(newPanel);
							} else {
								console.log(ParentControlID);
								vbox = that.byId(ParentControlID) as Panel;
								console.log(vbox);
								vbox.addContent(newPanel);
							}
							
							requiredProducts.push(new treeGood(good, await buildTree(good, newPanel.getId())));
						}
						result.push(new treeFactory(factory, requiredProducts))
					}
				} catch (error) {
					// no Factory
					console.error(error)
				}
			}
			return result
		}
		var productionGoods = game.getMaterialsForFactory(TargetFactory.Name);

		for (const good of productionGoods) {
			ProductionTree.push(new treeGood(good, await buildTree(good, null)), )
		}
		console.log(ProductionTree);
		viewModel.setProperty("/prodTree", ProductionTree);
	}
	public selectFactory(event: Event): void {

	}
	public checkSanity(event: Event): void {
		console.log(this.getView().byId("__panel0"));
		
		
	}
	public onPatternMatched(event: Event): void {
		 
	}
}
