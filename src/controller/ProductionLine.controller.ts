import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input from "sap/m/Input";
import SuggestionItem from "sap/m/SuggestionItem";
import { Factory, Game, Product } from "./Types";
import VBox from "sap/m/VBox";
import Control from "sap/ui/core/Control";
import Panel from "sap/m/Panel";
import Select from "sap/m/Select";
import Item from "sap/ui/core/Item";
import Title from "sap/m/Title";
import Button from "sap/m/Button";
import Fragment from "sap/ui/core/Fragment";
import SelectDialog from "sap/m/SelectDialog";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import File from "sap/ui/core/util/File";
import Dialog from "sap/m/Dialog";

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
	factoryOptions: treeFactory[]; 
	id: string;
	control: Control;
	parent: object;
	subs: {[k: string]: treeFactory};
	game: factoryGame;
	constructor(good: Product, game: factoryGame, parent: object) {
		super(good.Name, good.Dangerous, good.Illegal, good.AvgPrice, good.Level, good.Customers, good.Manufacturer);

		this.parent = parent;
		this.game = game;
		this.factoryOptions = [];
		this.subs = {};
	}
	public getId():string {
		// Parent ist entweder game oder factory
		//@ts-ignore
		if(this.parent.getId) {
			//@ts-ignore
			return this.parent.getId() + "/" + this.Name.replace(/\s/g, '');
		} else {
			return this.Name.replace(/\s/g, '');
		}
	}
	public getActiveFactory(): string[] {
		var facs:string[] = []
		for (const factory of this.factoryOptions) {
			if (factory.active) {
				facs = facs.concat(factory.getActiveSubs());
				facs.indexOf(factory.Name) === -1 ? facs.push(factory.Name) : null;
				return facs;
			}
		}
	}
	public getExportFactory(): any { 
		var result:any = {};
		for (const factory of this.factoryOptions) {
			if (factory.active) {
				result.Name = factory.Name;
				result.requiredProducts = []
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
	public getSubGoods(): treeGood[] {
		var result:treeGood[] = [];
		for (const factory of this.factoryOptions) {
			result = result.concat(factory.getAllGoods());
		}
		return result;
	}
	public setActiveFactory(Name: string) {
		if(!(this.factoryOptions.length > 0)) return;
		for (const factory of this.factoryOptions) {
			factory.active = false;
			if (factory.Name == Name) {
				factory.active = true;
				if (this.factoryOptions.length > 1) {
					// first content is select
					var select = (this.control as Panel).getContent()[0] as Select;
					select.setSelectedKey(factory.Name.replace(/\s/g, ''));
				}
			}
		}
	}
	// initial build select one
	private setFactoryActive():treeFactory {
		if(this.factoryOptions.length == 1) {
			this.factoryOptions[0].active = true;
			return this.factoryOptions[0];
		} else if(this.factoryOptions.length > 1) {
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
	public setActiveFactoryRecursiv(Material: string, newFactoryName: string) {
		if(this.Name == Material) {
			this.setActiveFactory(newFactoryName);
			return;
		}
		if(this.factoryOptions.length > 0) {
			for (const factory of this.factoryOptions) {
				console.log(factory.id);
				factory.checkMaterialList(Material, newFactoryName);
			}
		}
	}
	public buildControl(panellevel: number) {
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
			console.warn("No factory for "+ this.Name);
			(this.control as Panel).setExpandable(false);
			(this.control as Panel).addStyleClass("dontShowContent");
		}
		if (this.factoryOptions.length == 1) {
			this.factoryOptions[0].buildControl(this.Level, panellevel);
			(this.control as Panel).addContent(this.factoryOptions[0].control);
			// used for binding /LaserHead/LaserHeadFactory/Glass/GlassManufacturer/Ore/Name
			//@ts-ignore
			this[this.factoryOptions[0].Name.replace(/\s/g, '')] = this.factoryOptions[0];
			this.setFactoryActive();
		} else if(this.factoryOptions.length > 1) {
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

			(this.control as Panel).addContent(newSelect);
			(this.control as Panel).addContent(newButton);
			
			for (var factory of this.factoryOptions) {
				factory.buildControl(this.Level, panellevel);
				// used for binding /LaserHead/LaserHeadFactory/Glass/GlassManufacturer/Ore/Name
				//@ts-ignore
				this[factory.Name.replace(/\s/g, '')] = factory;
				(this.control as Panel).addContent(factory.control);
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
	requiredProducts: treeGood[];
	id: string;
	selectid: string;
	control: Control;
	active: boolean;
	parent: treeGood;
	subs: {[k: string]: treeGood};
	game: factoryGame;
	constructor(factory: Factory, game: factoryGame, parent: treeGood) {
		super(factory.Name,factory.ProductionCap,factory.Cost,factory.Products,factory.Materials);

		this.parent = parent;
		this.game = game;
		this.selectid = factory.Name.replace(/\s/g, '');
		this.requiredProducts = [];
		this.active = false;
		this.subs = {};
	}
	public getId() {
		return this.parent.getId() + "/" + this.Name.replace(/\s/g, '');
	}
	public getMaterialLevelCombined(): int {
		var result: int = 0;
		for (const product of this.Materials) {
			result += this.game.getProduct(product).Level;
		}
		return result
	}
	public getAllGoods(): treeGood[] {
		var allGoods:treeGood[] = [];
		for (const good of this.requiredProducts) {
			allGoods.push(good);
			allGoods = allGoods.concat(good.getSubGoods())
		}
		return allGoods;
	}
	public getActiveSubs(): string[] {
		var facs:string[] = [];
		for (const requiredProduct of this.requiredProducts) {
			facs = facs.concat(requiredProduct.getActiveFactory());
		}
		return facs
	}
	public checkMaterialList(Material: string, newFactoryName: string) {
		if (this.Products.indexOf(Material) >= 0) this.active = (this.Name == newFactoryName);
		for (const requiredProduct of this.requiredProducts) {
			if(requiredProduct.Name == Material) {
				requiredProduct.setActiveFactory(newFactoryName);
			}
			requiredProduct.setActiveFactoryRecursiv(Material, newFactoryName);
		}
	}
	public buildControl(goodLvl: number, panellevel: number) {
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
				this.requiredProducts.push(newMat)
			}
			for (var reqMaterial of this.requiredProducts) {
				reqMaterial.buildControl(panellevel);
				(this.control as Panel).addContent(reqMaterial.control);
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
	private panelCount: number;
	that: ProductionLine;
	availableGoods: string[];
	reqFactories: treeFactory[];
	prodTree: treeGood[];
	products: Product[];
	targetFactory: Factory;
	deathZone: Control[];
	subs: {[k: string]: treeGood};

	constructor(goods: Product[], factories: Factory[]) {
		super(goods, factories);
		this.deathZone = [];
		this.availableGoods = [];
		this.reqFactories = [];
		this.prodTree = [];
		this.products = [];
		this.panelCount = 0;
		this.subs = {};
	}
	public setTargetFactory(factoryName: string): {[k: string]: treeGood} {
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
	public clearDeathZone(): void {
		for (const control of this.deathZone) {
			control.destroy();
		}
	}
	public getActiveFactories(): string[] {
		var facs:string[] = [];
		for (var baseitem of this.prodTree) {
			facs = facs.concat(baseitem.getActiveFactory())
		}
		// only Uniques
		facs = [...new Set(facs)]
		for (let index = facs.length - 1; index > -1; index--) {
			const element = facs[index];
			if (element == undefined) facs.splice(index, 1);
		}
		return facs;
	}
	public getExportTree(): any {
		var exportTree = {};
		for (var baseitem of this.prodTree) {
			//@ts-ignore
			exportTree[baseitem.Name] = {
				Name: baseitem.Name,
				Factory: baseitem.getExportFactory()
			}
		}
		return exportTree;
	}
	public setBaseFactory(Material:string, newFactoryName:string) {
		for (var name in this.subs) {
			this.subs[name].setActiveFactoryRecursiv(Material, newFactoryName);
		}
	}
	public setAvailableGood(Name: string) {
		this.availableGoods.push(Name);
		var allGoods:treeGood[] = [];
		for (const good of this.prodTree) {
			allGoods.push(good);
			allGoods = allGoods.concat(good.getSubGoods());
		}
		//console.log(allGoods);
		for (const good of allGoods) {
			if (good.Name == Name) {
				good.control.addStyleClass("dontShowContent");
				(good.control as Panel).setExpandable(false);
				for (const factory of good.factoryOptions) {
					factory.active = false;
				}
			}
		}

	}
	public getPanelId():number {
		this.panelCount++;
		return this.panelCount
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
export default class ProductionLine extends BaseController {
	private formatter = formatter;
	private selectDialog: SelectDialog;
	private importDialog: Dialog;
	public onInit(): void {
		var Model = new JSONModel();
		Model.setData({
			TargetFactory: "",
			products: [],
			//mainFactory: {},
			//deathZone: [],
			//tree: [],
			//ownedFactories: [],
			//requiredFactories: []
		});
		this.getView().setModel(Model, "View");
		this.getRouter().getRoute("productionLine").attachPatternMatched(this.onPatternMatched, this);

		var inputF = this.byId("targetFactoryInput") as Input;
		inputF.setFilterFunction(function (sTerm: string, oItem:SuggestionItem) {
			return oItem.getText().match(new RegExp("^"+sTerm, "i"));
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
	public async generateProductionLine(event: Event): Promise<void> {
		var that = this;
		var view = this.getView();
		var viewModel = this.getModel("View") as JSONModel;
		var game:factoryGame;
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

		var TargetFactoryName = (view.byId("targetFactoryInput") as Input).getValue();
		viewModel.setProperty("/products", game.getProductsFromFactory(TargetFactoryName));
		game.setTargetFactory(TargetFactoryName);
		for (var name in game.subs) {
			(that.byId("DetailedProdList") as VBox).addItem(game.subs[name].control);
			
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
	public selectFactory(event: Event): void {
		var select = event.getSource() as Select;
		// getParameters() returns a undefined Object
		//@ts-ignore
		var item = event.getParameters().selectedItem as Item;
		var viewModel = this.getModel("View") as JSONModel;
		var path = select.getBindingPath("items"); // > game/subs/[Material]/.../factoryOptions
		var factoryOptions = viewModel.getProperty(path);
		for (var i = 0; i < factoryOptions.length; i++) {
			viewModel.setProperty(path+`/${i}/active`, false);

			if (viewModel.getProperty(path+`/${i}/Name`) == item.getText()) {
				viewModel.setProperty(path+`/${i}/active`, true);
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
	public setBaseFactory(event: Event): void {
		var viewModel = this.getModel("View") as JSONModel;		
		var game = viewModel.getProperty("/game") as factoryGame;
		var button = event.getSource() as Button;
		var path = button.getBindingPath("text");

		var Material = viewModel.getProperty(path);
		var newFactory = viewModel.getProperty(path.substring(0, path.lastIndexOf("/")));
		// first control is the select
		newFactory = ((newFactory.control.getContent()[0] as Select).getSelectedItem() as Item).getText();
		console.log(Material, newFactory);
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
	public addAvailableGood(event: Event) {
		var oView = this.getView();
		var that = this;
		try {
			(that.selectDialog as SelectDialog).open("")
		} catch (error) {
			Fragment.load({
				id: "speccalDialog",
				name: "de.henloh.prodts.view.Dialog",
				controller: this
			}).then(function (dialog: any){
				(dialog as SelectDialog).setModel(oView.getModel("GoodModel"));
				(dialog as SelectDialog).open("");
				that.selectDialog = dialog;
			}.bind(this));
		}
	}
	public onDialogClose(event: Event) {
		var aContexts = event.getParameter("selectedContexts");
		var viewModel = this.getModel("View") as JSONModel;		
		var game = viewModel.getProperty("/game") as factoryGame;
		if (aContexts && aContexts.length) {
			aContexts.map(function (oContext: any) { 
				try {
					game.setAvailableGood(oContext.getObject().Name)
				} catch (error) {
					console.warn(error);
				} 
			})	
			viewModel.setProperty("/availableGoods", game.availableGoods);
			viewModel.setProperty("/game", game);
		}
		// Binding is not definied. Filtering is possible here
		//@ts-ignore 
		(event.getSource() as SelectDialog).getBinding("items").filter([]);
		viewModel.setProperty("/requiredFactories", game.getActiveFactories().sort());
	}
	public onSearch(event: Event) {
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
	public handleDownloadPress(): void {	
		// Convert the JSON data to a string
		var viewModel = this.getModel("View") as JSONModel;
		var game = viewModel.getProperty("/game") as factoryGame;
		var data:any = {
			targetFactory:     viewModel.getProperty("/TargetFactory"),
			availableGoods:    viewModel.getProperty("/availableGoods"),
			requiredFactories: viewModel.getProperty("/requiredFactories"),
			products:          viewModel.getProperty("/products"),
			basicTree: 		   game.getExportTree()
		};
		var jsonString = JSON.stringify(data);
	
		// Use the FileSaver.js library to trigger a download
		File.save(jsonString, "data", "json", "application/json", "utf-8");
	}
	public openUploadDialog(event: Event) {
		//var oView = this.getView();
		var that = this;
		try {
			(that.importDialog as Dialog).open()
		} catch (error) {
			Fragment.load({
				id: "speccalDialog2",
				name: "de.henloh.prodts.view.Import",
				controller: this
			}).then(function (dialog: any){
				//(dialog as Dialog).setModel(oView.getModel("GoodModel"));
				(dialog as Dialog).open();
				that.importDialog = dialog;
			}.bind(this));
		}
	}
	public closeDialog(event: Event): void { 
		this.importDialog.close()
	}
	public handleUploadPress(event: Event): void {
		// Get the selected file from the input element
		var file = event.getParameters().item.getFileObject();
		var that = this;
		var reader = new FileReader();
		var viewModel = this.getModel("View") as JSONModel;

		// Read the file as text
		reader.readAsText(file);

		// When the file has been read, convert it to a JavaScript object
		reader.onload = function() {
			var data = JSON.parse(reader.result as string);
			//console.log(data);
			try {
				viewModel.setProperty("/TargetFactory", data.targetFactory);
				viewModel.setProperty("/availableGoods", data.availableGoods);
				viewModel.setProperty("/requiredFactories", data.requiredFactories);
				viewModel.setProperty("/products", data.products);

				var basicTree: any = data.basicTree;

				var game:factoryGame;
				game = viewModel.getProperty("/game");
				if (game) {
					game.clearDeathZone();
				}
				// Clear
				game = new factoryGame(that.getModel("GoodModel").getProperty("/Goods"), that.getModel("FactorieModel").getProperty("/Factories"));

				game.that = that;
				game.setTargetFactory(data.targetFactory);

				for (var name in game.subs) {
					(that.byId("DetailedProdList") as VBox).addItem(game.subs[name].control);
				}
				
				viewModel.setProperty("/game", game);

			} catch (error) {
				MessageBox.show("Uploaded data does not contain a production-tree.")
			}
			// Do something with the JavaScript object
		}
	}
	public onPatternMatched(event: Event): void {
		 
	}
}
