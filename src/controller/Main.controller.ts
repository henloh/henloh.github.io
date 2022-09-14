import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input from "sap/m/Input";
import SuggestionItem from "sap/m/SuggestionItem";
import NumberFormat from "sap/ui/core/format/NumberFormat";

/**
 * @namespace de.henloh.prodts.controller
 */
export default class Main extends BaseController {
	private formatter = formatter;

	public onInit(): void {
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

		var inputG = this.byId("productInput") as Input
		var inputF = this.byId("factoryInput") as Input
		inputG.setFilterFunction(function (sTerm: string, oItem:SuggestionItem) {
			return oItem.getText().match(new RegExp("^"+sTerm, "i"));
		});
		inputF.setFilterFunction(function (sTerm: string, oItem:SuggestionItem) {
			return oItem.getText().match(new RegExp("^"+sTerm, "i"));
		});
	}

	public onPatternMatched(event: Event): void {
		var Model = new JSONModel()
		Model.setData(this.getData())
		this.getView().setModel(Model, "Data")

		var ViewModel = this.getView().getModel("View") as JSONModel;

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
	}
	public submitGood(event: Event): void {
		var Data = this.getData();
		var Model = this.getView().getModel("View") as JSONModel;
		var Product = Data.getProduct(Model.getProperty("/Product"));
		Model.setProperty("/isProduct", true);
		Model.setProperty("/isFactory", false);
		Model.setProperty("/Illegal", Product.Illegal);
		Model.setProperty("/Dangerous", Product.Dangerous);
		Model.setProperty("/AvgPrice", Product.AvgPrice);
		Model.setProperty("/Level", Product.Level);
		Model.setProperty("/BoughtBy", Data.getCustomersOfProduct(Product.Name));
		Model.setProperty("/ProducedBy", Data.getFactoriesFromProduct(Product.Name));

		this.getRouter().navTo("main", {query: {
			good: Model.getProperty("/Product")
			}}, {}, true)
	}
	public submitFactory(event: Event): void {
		var Data = this.getData();
		var Model = this.getView().getModel("View") as JSONModel;
		var Factory = Data.getFactory(Model.getProperty("/Factory"));
		Model.setProperty("/isProduct", false);
		Model.setProperty("/isFactory", true);
		Model.setProperty("/Cost", Factory.Cost);
		Model.setProperty("/ProductionCap", Factory.ProductionCap);
		Model.setProperty("/Materials", Data.getMaterialsForFactory(Factory.Name));
		Model.setProperty("/Products", Data.getProductsFromFactory(Factory.Name));

		this.getRouter().navTo("main", {query: {
			factory: Model.getProperty("/Factory")
			}}, {}, true)
	}
	public onSelectNewFactory(event: Event, Factory: string) {
		var Model = this.getView().getModel("View") as JSONModel;
		Model.setProperty("/Factory", Factory);
		this.submitFactory(event);
	}
	public onSelectNewProduct(event: Event, Product: string) {
		var Model = this.getView().getModel("View") as JSONModel;
		Model.setProperty("/Product", Product);
		this.submitGood(event);
	}
	public FormatCredits(number: float): string{
		var format: NumberFormat = NumberFormat.getIntegerInstance({
			groupingEnabled: true,
			groupingSize: 3,
			groupingSeparator: ","
		});
		return format.format(number);
	}
	public showAllProducts(event: Event): void {
		var Model = this.getView().getModel("View") as JSONModel;
		var that = this;
		Model.setProperty("/isProduct", false);
		Model.setProperty("/isFactory", true);
		Model.setProperty("/Cost", "");
		Model.setProperty("/ProductionCap", "");
		Model.setProperty("/Materials", []);
		var data = that.getData().Goods;
		//console.log(data);
		Model.setProperty("/Products", data);
	}
	public showAllFactories(event: Event): void {
		var Model = this.getView().getModel("View") as JSONModel;
		var that = this;
		Model.setProperty("/isProduct", true);
		Model.setProperty("/isFactory", false);
		Model.setProperty("/Illegal", false);
		Model.setProperty("/Dangerous", false);
		Model.setProperty("/AvgPrice", "");
		Model.setProperty("/Level", "");
		Model.setProperty("/BoughtBy", []);
		var data = that.getData().Factories;
		//console.log(data);
		Model.setProperty("/ProducedBy", data);
	}
}
