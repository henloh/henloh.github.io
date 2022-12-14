import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import AppComponent from "../Component";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Router from "sap/ui/core/routing/Router";
import {Game, Product, Factory} from "./Types";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace de.henloh.prodts.controller
 */

export default abstract class BaseController extends Controller {

	/**
	 * Convenience method for accessing the component of the controller's view.
	 * @returns The component of the controller's view
	 */
	public getOwnerComponent(): AppComponent {
		return (super.getOwnerComponent() as AppComponent);
	}

	/**
	 * Convenience method to get the components' router instance.
	 * @returns The router instance
	 */
	public getRouter() : Router {
		return UIComponent.getRouterFor(this);
	}

	/**
	 * Convenience method for getting the i18n resource bundle of the component.
	 * @returns The i18n resource bundle of the component
	 */
	public getResourceBundle(): ResourceBundle | Promise<ResourceBundle> {
		const oModel = this.getOwnerComponent().getModel("i18n") as ResourceModel;
		return oModel.getResourceBundle();
	}

	/**
	 * Convenience method for getting the view model by name in every controller of the application.
	 * @param [sName] The model name
	 * @returns The model instance
	 */
	public getModel(sName?: string) : Model {
		return this.getView().getModel(sName);
	}

	/**
	 * Convenience method for setting the view model in every controller of the application.
	 * @param oModel The model instance
	 * @param [sName] The model name
	 * @returns The current base controller instance
	 */
	public setModel(oModel: Model, sName?: string) : BaseController {
		this.getView().setModel(oModel, sName);
		return this;
	}

	/**
	 * Convenience method for triggering the navigation to a specific target.
	 * @public
	 * @param sName Target name
	 * @param [oParameters] Navigation parameters
	 * @param [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
	 */
	public navTo(sName: string, oParameters?: object, bReplace?: boolean) : void {
		this.getRouter().navTo(sName, oParameters, undefined, bReplace);
	}

	/**
	 * Convenience event handler for navigating back.
	 * It there is a history entry we go one step back in the browser history
	 * If not, it will replace the current entry of the browser history with the main route.
	 */
	public onNavBack(): void {
		const sPreviousHash = History.getInstance().getPreviousHash();
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getRouter().navTo("main", {}, undefined, true);
		}
	}

	public getData(): Game {

		var products = this.getOwnerComponent().getModel("Goods") as JSONModel;
		var factories = this.getOwnerComponent().getModel("Factories") as JSONModel;
		//console.log(products);
		//console.log(
		//	factories.getProperty("/"));
		
		return new Game(
			products.getData().Goods,
			factories.getData().Factories
		);
		/*return new Game(
			[
				new Product("Acid",
					false,
					false,
					 402,
					 3,
					 [
						"Explosive Charge Factory",
						"Paint Manufacturer"
					 ],
					 [
						"Chemical Factory",
						"Rubber Factory"
					 ]),
				new Product("Acron Drug",
					false,
					true,
					6000,
					0,
					[],
					[]),
				new Product("Adhesive",
					false,
					false,
					402,
					3,
					["Chemical Factory"],
					[
						"Ammunition Factory 1",
						"Explosive Charge Factory",
						"High Pressure Tube Factory"
					]),
				new Product("Aluminium",
					false,
					false,
					 200,
					 0,
					 ["Aluminium Mine"],
					 [
						"Ammunition Factory 1",
						"Gun Factory",
						"High Pressure Tube Factory",
						"Laser Head Factory",
						"Servo Factory",
						"Steel Tube Factory",
						"Shipyard",
						"Tools Factory"
					 ]),
				new Product("Ammunition",
					false,
					false,
					3786,
					5,
					["Ammunition Factory 2"],
					[
						"Equipment Dock",
						"Gun Factory",
						"Military Outpost"
					]),
				new Product("Ammunition S",
					false,
					false,
					 422,
					 4,
					 ["Ammunition Factory 1"],
					 [
						"Equipment Dock",
						"Military Outpost"
					]),
				new Product("Ammunition M",
					false,
					false,
					 422,
					 4,
					 ["Ammunition Factory 1"],
					 [
						"Equipment Dock",
						"Military Outpost"
					]),
				new Product("Ammunition L",
					false,
					false,
					 422,
					 4,
					 ["Ammunition Factory 1"],
					 [
						"Equipment Dock",
						"Military Outpost"
					]),
				new Product("Antigrav Generator",
					false,
					false,
					 71632,
					 8,
					 ["Antigrav Generator Factory"],
					 [
						"Research Station"
					 ]),
				new Product("Antigrav Unit",
					false,
					false,
					 25391,
					 7,
					 ["Antigrav Unit Factory"],
					 [
						"Antigrav Generator Factory", 
						"Body Armor Factory", 
						"Vehicle Factory", 
						"Shipyard",
						"Repair Dock",
						"Equipment Dock",
						"Teleporter Factory"
					]),
					
				new Product("Beer",
					false,
					false,
					216,
					4,
					["Brewery"],
					["Casino", "Habitat"]),
				new Product("Body Armor",
					false,
					false,
					 95906,
					 9,
					 ["Body Armor Factory"],
					 ["Military Outpost"]),
				new Product("Book",
					false,
					false,
					 319,
					 3,
					 ["Book Factory"],
					 ["Habitat"]),
				new Product("Bio Gas",
					false,
					false,
					213,
					2,
					["Cattle Ranch 1", "Fish Farm", "Sheep Ranch 2"],
					[
						"Chemical Factory", 
						"Fungus Farm", 
						"Plasma Cell Factory"
					]),
					
				new Product("Carbon",
					false,
					false,
					423,
					2,
					["Carbon Extractor 1",
					 "Carbon Extractor 2",
					 "Carbon Extractor 3",
					 "Carbon Extractor 4",
					 "Planetary Trading Post"],
					[
						"Body Armor Factory",
						"Chemical Factory",
						"High Capacity Lens Factory",
						"High Pressure Tube Factory",
						"Steel Factory 2",
					]),
				new Product("Cattle",
					false,
					false,
					 254,
					 2,
					 ["Cattle Ranch 1", "Cattle Ranch 2"],
					 [
						"Biotope", 
						"Dairy Farm", 
						"Meat Factory"
					]),
				new Product("Chemicals",
					false,
					false,
					 402,
					 3,
					 ["Chemical Factory"],
					 [
						"Ammunition Factory 2",
						"Explosive Charge Factory",
						"Fertilizer Factory 1",
						"Medical Supplies Factory",
						"Paint Manufacturer",
						"Warhead Factory"
					]),
				new Product("Coolant",
					false,
					false,
					 402,
					 3,
					 ["Chemical Factory"],
					 [
						"Body Armor Factory",
						"Mining Robot Factory",
						"Turbine Factory",
						"War Robot Factory"
					 ]),
				new Product("Clothes",
					false,
					false,
					 102,
					 4,
					 ["Clothes Factory"],
					 []),
				new Product("Coal",
					false,
					false,
					 200,
					 0,
					 ["Coal Mine"],
					 ["Biotope", "Steel Factory 1", "Steel Factory 2"]),
				new Product("Cocoa",
					false,
					false,
					 87,
					 5,
					 ["Cocoa Farm"],
					 ["Habitat"]),
				new Product("Coffee",
					false,
					false,
					 187,
					 5,
					 ["Coffee Farm"],
					 ["Habitat"]),
				new Product("Computation Mainframe",
					false,
					false,
					 37940,
					 7,
					 ["Computation Mainframe Factory"],
					 ["Shipyard"]),
				new Product("Conductor",
					false,
					false,
					 168,
					 4,
					 ["Conductor Factory"],
					 [
						"Accelerator Factory",
						"Electro Magnet Factory",
						"Energy Generator Factory",
						"Energy Inverter Factory",
						"Laser Head Factory",
						"Servo Factory",
						"Targeting System Factory",
						"Teleporter Factory",
						"Warhead Factory"
					]),
				new Product("Copper",
					false,
					false,
					 350,
					 0,
					 ["Copper Mine", "Planetary Trading Post"],
					 [
						"Computer Component Factory",
						"Electro Magnet Factory",
						"Processor Factory",
						"Targeting Card Factory",
						"Tesla Coil Factory"
					]),
				new Product("Corn",
					false,
					false,
					 28,
					 1,
					 ["Corn Farm"],
					 [
						"Biotope",
						"Carbon Extractor 3",
						"Cattle Ranch 2",
						"Food Bar Factory",
						"Food Factory",
						"Sheep Ranch 2"
					 ]),
				new Product("Crystal",
					false,
					false,
					 190,
					 0,
					 ["Crystal Farm"],
					 ["Glass Manufacturer", "Nanobot Factory"]),
				new Product("Chlorine",
					false,
					false,
					 150,
					 0,
					 ["Gas Collector 1", "Gas Collector 2", "Gas Collector 4"],
					 ["Medical Supplies Factory"]),
					
				new Product("Diamond",
					false,
					false,
					750,
					0,
					["Trading Post"],
					[
						"Drill Factory", 
						"High Capacity Lens Factory", 
						"Jewelry Manufacturer 1"
					]),
				new Product("Display",
					false,
					false,
					 7858,
					 6,
					 ["Computer Component Factory", "Display Factory"],
					 [
						"Computation Mainframe Factory",
						"Mining Robot Factory",
						"Satellite Factory",
						"Shipyard",
						"Equipment Dock",
						"Repair Dock",
						"Vehicle Factory",
						"War Robot Factory"
					 ]),
				new Product("Dairy",
					false,
					false,
					 19,
					 3,
					 ["Dairy Farm"],
					 ["Protein Factory"]),
				new Product("Drill",
					false,
					false,
					 20443,
					 7,
					 ["Drill Factory"],
					 [
						"Mining Robot Factory",
					    "Planetary Trading Post",
					    "Research Station",
					    "Equipment Dock"
					]),
				new Product("Drone",
					false,
					false,
					 7754,
					 5,
					 ["Drone Factory"],
					 ["Equipment Dock", "Planetary Trading Post"]),
					
				new Product("Electron Accelerator",
					false,
					false,
					 125431,
					 8,
					 ["Accelerator Factory"],
					 ["Research Station", "Travel Hub"]),
				new Product("Electro Magnet",
					false,
					false,
					483,
					5,
					["Electro Magnet Factory"],
					[
						"Antigrav Generator Factory",
						"Electromagnetic Charge Factory",
						"Force Generator Factory",
						"Gauss Rail Factory"
					]),
				new Product("Electromagnetic Charge",
					false,
					false,
					13985,
					6,
					["Electromagnetic Charge Factory"],
					["Military Outpost"]),
				new Product("Energy Container",
					false,
					false,
					1087,
					5,
					["Energy Container Factory"],
					["Electromagnetic Charge Factory", "Satellite Factory", "Shipyard"]),
				new Product("Energy Generator",
					false,
					false,
					15957,
					6,
					["Energy Generator Factory"],
					["Antigrav Generator Factory",
					 "Force Generator Factory",
					 "Planetary Trading Post",
					 "Vehicle Factory"]),
				new Product("Energy Inverter",
					false,
					false,
					1277,
					6,
					["Energy Inverter Factory"],
					[]),
				new Product("Energy Tube",
					false,
					false,
					2895,
					5,
					["Energy Tube Factory"],
					[
						"Accelerator Factory",
						"Electromagnetic Charge Factory",
						"Energy Inverter Factory",
						"Fusion Core Factory",
						"Gauss Rail Factory",
						"Laser Compressor Factory",
						"Laser Modulator Factory",
						"Repair Dock",
						"Shipyard"
					]),
				new Product("Energy Cell",
					false,
					false,
					50,
					0,
					["Solar Power Plant"],
					[
						"Ammunition Factory 1",
						"Antigrav Unit Factory",
						"Book Factory",
						"Chemical Factory",
						"Cocoa Farm",
						"Coffee Farm",
						"Conductor Factory",
						"Corn Farm",
						"Distillery",
						"Energy Container Factory",
						"Energy Generator Factory",
						"Energy Tube Factory",
						"Explosive Charge Factory",
						"Fertilizer Factory 1",
						"Fertilizer Factory 2",
						"Food Bar Factory",
						"Fruit Farm",
						"Fuel Factory",
						"Gauss Rail Factory",
						"Laser Head Factory",
						"Laser Modulator Factory",
						"Luxury Food Factory",
						"Microchip Factory",
						"Oil Refinery",
						"Planetary Trading Post",
						"Plant Farm",
						"Plasma Cell Factory",
						"Plastic Manufacturer",
						"Potato Farm",
						"Power Unit Factory",
						"Rice Farm",
						"Rubber Factory",
						"Semi Conductor Manufacturer",
						"Sheep Ranch 1",
						"Sheep Ranch 2",
						"Solar Cell Factory",
						"Spices Farm",
						"Targeting System Factory",
						"Tea Farm",
						"Tools Factory",
						"Transformator Factory",
						"Travel Hub",
						"Vegetable Farm",
						"Wheat Farm",
						"Wood Farm"
					]),
				new Product("Explosive Charge",
					true,
					false,
					1423,
					4,
					["Explosive Charge Factory"],
					["Military Outpost", "Planetary Trading Post"]),

				new Product("Fabric",
					false,
					false,
					91,
					3,
					["Fabric Factory"],
					["Clothes Factory", "Sheep Ranch 1", "Sheep Ranch 2", "Medical Supplies Factory"]),
				new Product("Fertilizer",
					false,
					false,
					319,
					1,
					["Fertilizer Factory 1", "Fertilizer Factory 2"],
					["Cocoa Farm", "Coffee Farm", "Spices Farm"]),
				new Product("Fish",
					false,
					false,
					152,
					2,
					["Fish Farm"],
					["Biotope"]),
				new Product("Food Bar",
					false,
					false,
					223,
					2,
					["Food Bar Factory"],
					["Biotope", "Military Outpost"]),
				new Product("Food",
					false,
					false,
					300,
					4,
					["Food Factory"],
					["Biotope", "Casino", "Habitat"]),
				new Product("Force Generator",
					false,
					false,
					49576,
					7,
					["Force Generator Factory"],
					[
						"Research Station",
						"Repair Dock",
						"Travel Hub"
					]),
				new Product("Fruit",
					false,
					false,
					56,
					1,
					["Fruit Farm"],
					[
						"Habitat", 
						"Luxury Food Factory",
						"Wine Factory"
					]),
				new Product("Fusion Core",
					false,
					false,
					5114,
					6,
					["Fusion Core Factory"],
					[
						"Equipment Dock", 
						"Fusion Generator Factory", 
						"Shipyard", 
						"Repair Dock",
						"Tesla Coil Factory", 
						"Travel Hub"
					]),
				new Product("Fusion Generator",
					false,
					false,
					39553,
					7,
					["Fusion Generator Factory"],
					["Accelerator Factory", 
					 "Research Station", 
					 "Travel Hub"]),
				new Product("Fuel",
					false,
					false,
					1232,
					2,
					["Fuel Factory"],
					[
						"Drone Factory", 
						"Equipment Dock", 
						"Planetary Trading Post", 
						"Repair Dock", 
						"Rocket Factory"
					]),
				new Product("Fungus",
					false,
					false,
					46,
					3,
					["Fungus Farm"],
					[
						"Biotope", "Brewery", "Wine Factory"
					]),
				new Product("Fluorine",
					true,
					false,
					250,
					0,
					["Gas Collector 2", "Gas Collector 4"],
					["Explosive Charge Factory", "Fuel Factory"]),

				new Product("Gem",
					false,
					false,
					400,
					0,
					["Planetary Trading Post"],
					["Jewelry Manufacturer 2"]),
				new Product("Glass",
					false,
					false,
					182,
					1,
					["Glass Manufacturer"],
					[
						"Biotope", 
						"Display Factory", 
						"High Capacity Lens Factory", 
						"Laser Head Factory"
					]),
				new Product("Gun",
					true,
					false,
					1232,
					6,
					["Gun Factory"],
					["Military Outpost", "War Robot Factory"]),
				new Product("Gold",
					false,
					false,
					600,
					0,
					["Noble Metal Mine 1", "Noble Metal Mine 3", "Planetary Trading Post"],
					[
						"Computer Component Factory", 
						"Conductor Factory", 
						"Fusion Core Factory", 
						"Jewelry Manufacturer 1", 
						"Processor Factory", 
						"Semi Conductor Manufacturer", 
						"Solar Cell Factory", 
						"Wire Manufacturer"
					]),
				new Product("Gauss Rail",
					false,
					false,
					7735,
					6,
					["Gauss Rail Factory"],
					["Accelerator Factory"]),

				new Product("Helium",
					false,
					false,
					50,
					0,
					["Gas Collector 1", "Gas Collector 4"],
					["Plasma Cell Factory"]),
				new Product("Hydrogen",
					false,
					false,
					150,
					0,
					["Gas Collector 1", "Gas Collector 3", "Gas Collector 4"],
					["Chemical Factory", "Fusion Core Factory"]),
				new Product("High Capacity Lens",
					false,
					false,
					4689,
					3,
					["High Capacity Lens Factory"],
					["Research Station"]),
				new Product("High Pressure Tube",
					false,
					false,
					1650,
					5,
					["High Pressure Tube Factory"],
					["Accelerator Factory", "Gauss Rail Factory"]),

				new Product("Industrial Tesla Coil",
					true,
					false,
					10314,
					7,
					["Tesla Coil Factory"],
					["Shipyard"]),

				new Product("Jewelry",
					false,
					false,
					1260,
					1,
					["Jewelry Manufacturer 1", "Jewelry Manufacturer 2"],
					[]),

				new Product("Leather",
					false,
					false,
					37,
					3,
					["Dairy Farm", "Meat Factory"],
					["Habitat"]),
				new Product("Liquor",
					false,
					false,
					1867,
					2,
					["Distillery"],
					["Casino", "Habitat"]),
				new Product("Laser Compressor",
					false,
					false,
					6577,
					6,
					["Laser Compressor Factory"],
					["Equipment Dock"]),
				new Product("Laser Head",
					false,
					false,
					4690,
					5,
					["Laser Head Factory"],
					["Drill Factory", "Equipment Dock"]),
				new Product("Laser Modulator",
					false,
					false,
					16742,
					6,
					["Laser Modulator Factory"],
					[]),
				new Product("Lead",
					false,
					false,
					200,
					0,
					["Lead Mine", "Planetary Trading Post"],
					["Ammunition Factory 1"]),
				new Product("Luxury Food",
					false,
					false,
					6452,
					6,
					["Luxury Food Factory"],
					["Casino"]),

				new Product("Medical Supplies",
					false,
					false,
					3006,
					4,
					["Medical Supplies Factory"],
					["Casino", 
					 "Military Outpost", 
					 "Repair Dock", 
					 "Shipyard"]),
				new Product("Metal Plate",
					false,
					false,
					792,
					4,
					["Metal Plate Factory"],
					["Body Armor Factory", 
					 "Drone Factory", 
					 "Repair Dock", 
					 "Shipyard", 
					 "Teleporter Factory", 
					 "Vehicle Factory", 
					 "Warhead Factory"]),
				new Product("Military Tesla Coil",
					true,
					false,
					10314,
					7,
					["Tesla Coil Factory"],
					["Military Outpost"]),
				new Product("Meat",
					false,
					false,
					37,
					3,
					["Meat Factory"],
					["Food Factory", "Habitat", "Protein Factory"]),
				new Product("Microchip",
					false,
					false,
					896,
					5,
					["Microchip Factory"],
					[
						"Computation Mainframe Factory", 
						"Computer Component Factory", 
						"Display Factory", 
						"Energy Generator Factory", 
						"Processor Factory", 
						"Rocket Factory", 
						"Targeting Card Factory"
					]),
				new Product("Mineral",
					false,
					false,
					500,
					0,
					["Mineral Extractor", "Planetary Trading Post"],
					["Fertilizer Factory 2", "Fungus Farm"]),
				new Product("Mining Robot",
					false,
					false,
					145977,
					9,
					["Mining Robot Factory"],
					["Planetary Trading Post"]),
				new Product("Morn Drug",
					false,
					true,
					5000,
					0,
					[],
					[]),

				new Product("Neutron Accelerator",
					false,
					false,
					125431,
					8,
					["Accelerator Factory"],
					["Research Station", "Travel Hub"]),
				new Product("Nitrogen",
					false,
					false,
					40,
					0,
					["Gas Collector 2", "Gas Collector 3"],
					["Chemical Factory", "Fuel Factory"]),
				new Product("Neon",
					false,
					false,
					200,
					0,
					["Gas Collector 1", "Gas Collector 2"],
					["Energy Tube Factory", "Plasma Cell Factory"]),
				new Product("Nanobot",
					false,
					false,
					1338,
					5,
					["Nanobot Factory"],
					["Body Armor Factory", 
					 "Force Generator Factory", 
					 "Mining Robot Factory", 
					 "Repair Dock", 
					 "War Robot Factory"]),

				new Product("Oxygen",
					false,
					false,
					80,
					0,
					["Cocoa Farm", 
					 "Coffee Farm", 
					 "Corn Farm", 
					 "Fruit Farm", 
					 "Gas Collector 3", 
					 "Plant Farm", 
					 "Potato Farm", 
					 "Rice Farm", 
					 "Spices Farm", 
					 "Tea Farm", 
					 "Vegetable Farm", 
					 "Wheat Farm", 
					 "Wood Farm"],
					["Cattle Ranch 1",
					 "Cattle Ranch 2", 
					 "Chemical Factory", 
					 "Fish Farm", 
					 "Repair Dock", 
					 "Sheep Ranch 1",
					 "Sheep Ranch 2"
					]),
				new Product("Oil",
					false,
					false,
					490,
					1,
					["Oil Refinery"],
					["Fuel Factory", 
					 "Paint Manufacturer", 
					 "Plastic Manufacturer", 
					 "Rubber Factory"]),
				new Product("Ore",
					false,
					false,
					70,
					0,
					["Ore Mine", "Planetary Trading Post"],
					["Glass Manufacturer", "Steel Factory 2"]),

				new Product("Paint",
					false,
					false,
					481,
					1,
					["Paint Manufacturer"],
					["Ammunition Factory 2"]),
				new Product("Proton Accelerator",
					false,
					false,
					125431,
					8,
					["Accelerator Factory"],
					["Research Station", "Travel Hub"]),
				new Product("Processor",
					false,
					false,
					7858,
					6,
					["Computer Component Factory", "Processor Factory"],
					["Antigrav Unit Factory",
					 "Computation Mainframe Factory",
					 "Drill Factory",
					 "Mining Robot Factory",
					 "Satellite Factory",
					 "Repair Dock",
					 "Targeting Card Factory",
					 "Targeting System Factory",
					 "War Robot Factory"]),
				new Product("Plankton",
					false,
					false,
					50,
					0,
					["Fish Farm", "Plankton Collector"],
					["Fertilizer Factory 2"]),
				new Product("Platinum",
					false,
					false,
					750,
					0,
					["Noble Metal Mine 2", "Noble Metal Mine 3"],
					["Computer Component Factory",
					 "Conductor Factory",
					 "Energy Tube Factory",
					 "Jewelry Manufacturer 2",
					 "Processor Factory",
					 "Solar Cell Factory",
					 "Tools Factory"]),
				new Product("Paper",
					false,
					false,
					46,
					2,
					["Paper Factory"],
					["Book Factory"]),
				new Product("Plant",
					false,
					false,
					14,
					1,
					["Plant Farm"],
					["Biotope"]),
				new Product("Plasma Cell",
					false,
					false,
					174,
					4,
					["Plasma Cell Factory"],
					["Accelerator Factory", 
					 "Display Factory", 
					 "Drone Factory", 
					 "Fusion Core Factory", 
					 "Fusion Generator Factory", 
					 "Laser Compressor Factory", 
					 "Power Unit Factory", 
					 "Teleporter Factory", 
					 "Travel Hub"]),
				new Product("Plastic",
					false,
					false,
					137,
					2,
					["Plastic Manufacturer"],
					["Energy Tube Factory", 
					 "Explosive Charge Factory", 
					 "Force Generator Factory", 
					 "Gun Factory", 
					 "High Capacity Lens Factory", 
					 "Servo Factory", 
					 "Shipyard",
					 "Equipment Dock",
					 "Repair Dock",
					 "Tesla Coil Factory", 
					 "Transformator Factory", 
					 "Wire Manufacturer"]),
				new Product("Potato",
					false,
					false,
					24,
					1,
					["Potato Farm"],
					["Carbon Extractor 1"]),
				new Product("Power Unit",
					false,
					false,
					1211,
					5,
					["Power Unit Factory"],
					["Antigrav Unit Factory",
					 "Computation Mainframe Factory",
					 "Fusion Generator Factory",
					 "Mining Robot Factory",
					 "Teleporter Factory",
					 "Shipyard",
					 "Repair Dock",
					 "Equipment Dock",
					 "Turbine Factory",
					 "Vehicle Factory",
					 "War Robot Factory"]),
				new Product("Protein",
					false,
					false,
					34,
					4,
					["Protein Factory"],
					[]),

				new Product("Raw Oil",
					false,
					false,
					150,
					0,
					["Oil Rig", "Planetary Trading Post"],
					["Oil Refinery"]),
				new Product("Rice",
					false,
					false,
					15,
					1,
					["Rice Farm"],
					["Biotope",
					 "Carbon Extractor 4",
					 "Food Bar Factory"]),
				new Product("Rift Research Data",
					false,
					false,
					5000,
					0,
					[],
					["Rift Research Station"]),
				new Product("Rocket",
					true,
					false,
					11250,
					6,
					["Rocket Factory"],
					["Equipment Dock"]),
				new Product("Rubber",
					false,
					false,
					686,
					2,
					["Rubber Factory"],
					["Vehicle Factory"]),

				new Product("Satellite",
					false,
					false,
					65714,
					7,
					["Satellite Factory"],
					["Equipment Dock", "Research Station"]),
				new Product("Scrap Metal",
					false,
					false,
					25,
					0,
					["Drill Factory",
					 "Drone Factory",
					 "Laser Compressor Factory",
					 "Mining Robot Factory",
					 "Satellite Factory",
					 "Scrap Metal Trader",
					 "Teleporter Factory",
					 "Vehicle Factory",
					 "War Robot Factory",
					 "Warhead Factory"],
					["Steel Factory 1"]),
				new Product("Semi Conductor",
					false,
					false,
					129,
					4,
					["Semi Conductor Manufacturer"],
					["Computer Component Factory",
					 "Display Factory",
					 "Microchip Factory",
					 "Nanobot Factory",
					 "Processor Factory"]),
				new Product("Servo",
					false,
					false,
					1387,
					5,
					["Servo Factory"],
					["Antigrav Generator Factory",
					 "Laser Modulator Factory",
					 "Turbine Factory"]),
				new Product("Sheep",
					false,
					false,
					130,
					2,
					["Sheep Ranch 1", "Sheep Ranch 2"],
					["Biotope", "Fabric Factory"]),
				new Product("Silicon",
					false,
					false,
					500,
					0,
					["Silicon Mine", "Planetary Trading Post"],
					["Semi Conductor Manufacturer",
					 "Solar Cell Factory",
					 "Transformator Factory"]),
				new Product("Solar Cell",
					false,
					false,
					469,
					1,
					["Solar Cell Factory"],
					[
						"Solar Panel Factory", 
						"Repair Dock", 
						"Shipyard"
					]),
				new Product("Solar Panel",
					false,
					false,
					6858,
					5,
					["Solar Panel Factory"],
					["Planetary Trading Post", "Repair Dock", "Satellite Factory"]),
				new Product("Spices",
					false,
					false,
					268,
					5,
					["Spices Farm"],
					["Habitat", "Luxury Food Factory"]),
				new Product("Steel",
					false,
					false,
					277,
					1,
					["Steel Factory 1", "Steel Factory 2"],
					["Ammunition Factory 1",
					 "Ammunition Factory 2",
					 "Conductor Factory",
					 "Drill Factory",
					 "Electro Magnet Factory",
					 "Energy Tube Factory",
					 "Explosive Charge Factory",
					 "Force Generator Factory",
					 "Fusion Generator Factory",
					 "Gun Factory",
					 "High Pressure Tube Factory",
					 "Metal Plate Factory",
					 "Plasma Cell Factory",
					 "Repair Dock",
					 "Rocket Factory",
					 "Semi Conductor Manufacturer",
					 "Servo Factory",
					 "Steel Tube Factory",
					 "Tesla Coil Factory",
					 "Tools Factory",
					 "Shipyard",
					 "Transformator Factory",
					 "Turbine Factory",
					 "Wire Manufacturer"]),
				new Product("Steel Tube",
					false,
					false,
					704,
					4,
					["Steel Tube Factory"],
					["Energy Tube Factory", "High Pressure Tube Factory", "Satellite Factory"]),
				new Product("Slave",
					false,
					true,
					15000,
					0,
					[],
					[]),
				new Product("Solvent",
					false,
					false,
					402,
					3,
					["Chemical Factory"],
					["Fertilizer Factory 1", "Paint Manufacturer"]),
				new Product("Silver",
					false,
					false,
					300,
					0,
					["Noble Metal Mine 1", "Noble Metal Mine 2"],
					["Metal Plate Factory",
					 "Tools Factory",
					 "Transformator Factory"]),

				new Product("Toxic Waste",
					true,
					false,
					15,
					-1,
					["Ammunition Factory 2",
					 "Fertilizer Factory 1",
					 "Fuel Factory",
					 "Fungus Farm",
					 "Laser Head Factory",
					 "Paint Manufacturer",
					 "Rubber Factory"],
					[]),
				new Product("Targeting Card",
					false,
					false,
					11873,
					6,
					["Computer Component Factory", "Targeting Card Factory"],
					["Targeting System Factory"]),
				new Product("Targeting System",
					false,
					false,
					29674,
					8,
					["Targeting System Factory"],
					["Military Outpost"]),
				new Product("Tea",
					false,
					false,
					37,
					1,
					["Tea Farm"],
					["Habitat"]),
				new Product("Teleporter",
					false,
					false,
					39365,
					8,
					["Teleporter Factory"],
					["Body Armor Factory",
					 "Mining Robot Factory",
					 "War Robot Factory",
					 "Research Station"]),
				new Product("Tools",
					false,
					false,
					214,
					4,
					["Tools Factory"],
					["Equipment Dock", "Planetary Trading Post"]),
				new Product("Transformator",
					false,
					false,
					209,
					4,
					["Transformator Factory"],
					["Electro Magnet Factory",
					 "Electromagnetic Charge Factory",
					 "Energy Container Factory",
					 "Energy Inverter Factory",
					 "Fusion Core Factory",
					 "Gauss Rail Factory",
					 "Laser Compressor Factory",
					 "Laser Modulator Factory",
					 "Power Unit Factory",
					 "Solar Panel Factory",
					 "Teleporter Factory"]),
				new Product("Turbine",
					false,
					false,
					16729,
					6,
					["Turbine Factory"],
					["Accelerator Factory",
					 "Research Station",
					 "Shipyard",
					 "Travel Hub"]),

				new Product("Vegetable",
					false,
					false,
					32,
					1,
					["Vegetable Farm"],
					["Biotope", "Food Factory", "Habitat"]),
				new Product("Vehicle",
					false,
					false,
					77087,
					8,
					["Vehicle Factory"],
					["Military Outpost"]),

				new Product("War Robot",
					true,
					false,
					92186,
					9,
					["War Robot Factory"],
					["Military Outpost"]),
				new Product("Warhead",
					true,
					false,
					5630,
					5,
					["Warhead Factory"],
					["Equipment Dock", "Rocket Factory"]),
				new Product("Water",
					false,
					false,
					20,
					0,
					["Ice Mine", "Water Collector"],
					["Biotope",
					 "Brewery",
					 "Casino",
					 "Cattle Ranch 1",
					 "Cattle Ranch 2",
					 "Chemical Factory",
					 "Cocoa Farm",
					 "Coffee Farm",
					 "Corn Farm",
					 "Distillery",
					 "Fish Farm",
					 "Fruit Farm",
					 "Fungus Farm",
					 "Habitat",
					 "Medical Supplies Factory",
					 "Paint Manufacturer",
					 "Paper Factory",
					 "Plant Farm",
					 "Potato Farm",
					 "Rice Farm",
					 "Sheep Ranch 1",
					 "Sheep Ranch 2",
					 "Spices Farm",
					 "Tea Farm",
					 "Vegetable Farm",
					 "Wheat Farm",
					 "Wood Farm"]),
				new Product("Wheat",
					false,
					false,
					23,
					1,
					["Wheat Farm"],
					["Biotope",
					 "Brewery",
					 "Carbon Extractor 2",
					 "Cattle Ranch",
					 "Distillery",
					 "Fish Farm",
					 "Food Bar Factory",
					 "Food Factory",
					 "Luxury Food Factory",
					 "Sheep Ranch 1"]),
				new Product("Wine",
					false,
					false,
					182,
					4,
					["Wine Factory"],
					["Casino", "Luxury Food Factory", "Habitat"]),
				new Product("Wire",
					false,
					false,
					95,
					4,
					["Wire Manufacturer"],
					["Antigrav Generator Factory",
					 "Computation Mainframe Factory",
					 "Computer Component Factory",
					 "Laser Compressor Factory",
					 "Microchip Factory",
					 "Repair Dock",
					 "Shipyard",
					 "Equipment Dock",
					 "Targeting System Factory"]),
				new Product("Wood",
					false,
					false,
					350,
					1,
					["Wood Farm"],
					["Biotope", "Habitat", "Paper Factory"]),

				new Product("Zinc",
					false,
					false,
					250,
					0,
					["Zinc Mine"],
					["Conductor Factory",
					 "Medical Supplies Factory",
					 "Solar Cell Factory"])
			],
			[
			new Factory("Accelerator Factory",
				20069,
				438550500,
				[ 
					"Neutron Accelerator",
					"Proton Accelerator",
					"Electron Accelerator",
				], 
				[
					"Turbine", "Plasma Cell", "Fusion Generator", "Energy Tube", "High Pressure Tube", "Conductor", "Gauss Rail"
				]),
			new Factory("Aluminium Mine",
				134,
				9500000,
				[ 
					"Aluminium",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Ammunition Factory 1",
				3376,
				16815000,
				[ 
					"Ammunition S",
					"Ammunition M",
					"Ammunition L",
				], 
				[
					"Lead", "Aluminium", "Steel", "Adhesive", "Energy Cell"
				]),
			new Factory("Ammunition Factory 2",
				6310,
				25054500,
				[ 
					"Ammunition",
					"Toxic Waste"
				], 
				[
					"Steel", "Chemicals", "Paint"
				]),
			new Factory("Antigrav Generator Factory",
				38204,
				77529000,
				[ 
					"Antigrav Generator",
				], 
				[
					"Electro Magnet", "Servo", "Wire", "Antigrav Unit", "Energy Generator"
				]),
			new Factory("Antigrav Unit Factory",
				11850,
				31120500,
				[ 
					"Antigrav Unit",
				], 
				[
					"Power Unit", "Processor", "Energy Cell"
				]),
			new Factory("Body Armor Factory",
				57544,
				112337000,
				[ 
					"Body Armor",
				], 
				[
					"Metal Plate", "Coolant", "Teleporter", "Antigrav Unit", "Carbon", "Nanobot"
				]),
			new Factory("Book Factory",
				256,
				3571000,
				[ 
					"Book",
				], 
				[
					"Paper", "Energy Cell"
				]),
			new Factory("Brewery",
				1728,
				15105000,
				[ 
					"Beer",
				], 
				[
					"Water", "Wheat", "Fungus"
				]),
			new Factory("Carbon Extractor 1",
				282,
				4610500,
				[ 
					"Carbon",
				], 
				[
					"Potato"
				]),
			new Factory("Carbon Extractor 2",
				282,
				4750500,
				[ 
					"Carbon",
				], 
				[
					"Wheat"
				]),
			new Factory("Carbon Extractor 3",
				282,
				4806500,
				[ 
					"Carbon",
				], 
				[
					"Corn"
				]),
			new Factory("Carbon Extractor 4",
				282,
				4915000,
				[ 
					"Carbon",
				], 
				[
					"Rice"
				]),
			new Factory("Cattle Ranch 1",
				300,
				4554500,
				[ 
					"Cattle",
					"Bio Gas",
				], 
				[
					"Wheat", "Oxygen", "Water"
				]),
			new Factory("Cattle Ranch 2",
				328,
				5783000,
				[ 
					"Cattle",
					"Bio Gas",
				], 
				[
					"Corn", "Oxygen", "Water"
				]),
			new Factory("Chemical Factory",
				724,
				6112000,
				[ 
					"Chemicals",
					"Adhesive",
					"Coolant",
					"Solvent",
					"Acid",
				], 
				[
					"Water", 
					"Nitrogen", 
					"Hydrogen", 
					"Oxygen", 
					"Bio Gas", 
					"Carbon", 
					"Energy Cell"
				]),
			new Factory("Clothes Factory",
				2720,
				3045000,
				[ 
					"Clothes"
				], 
				[
					"Fabric"
				]),
			new Factory("Coal Mine",
				0,
				5300000,
				[ 
					"Coal",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Cocoa Farm",
				586,
				6636000,
				[ 
					"Cocoa",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water", "Fertilizer"
				]),
			new Factory("Coffee Farm",
				629,
				6906000,
				[ 
					"Coffee",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water", "Fertilizer"
				]),
			new Factory("Computation Mainframe Factory",
				17706,
				45061500,
				[ 
					"Computation Mainframe",
				], 
				[
					"Processor", "Power Unit", "Microchip", "Display", "Wire"
				]),
			new Factory("Computer Component Factory",
				11036,
				44580000,
				[ 
					"Display",
					"Targeting Card",
					"Processor",
				], 
				[
					"Wire", "Microchip", "Semi Conductor", "Copper", "Platinum", "Gold"
				]),
			new Factory("Conductor Factory",
				896,
				6699000,
				[ 
					"Conductor",
				], 
				[
					"Zinc", "Platinum", "Gold", "Steel", "Energy Cell"
				]),
			new Factory("Copper Mine",
				117,
				8625000,
				[ 
					"Copper",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Corn Farm",
				134,
				3480000,
				[ 
					"Corn",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Crystal Farm",
				127,
				9150000,
				[ 
					"Crystal",
				], 
				[]),
			new Factory("Dairy Farm",
				758,
				6875000,
				[ 
					"Dairy",
					"Leather",
				], 
				["Cattle"]),
			new Factory("Display Factory",
				3144,
				110361000,
				[ 
					"Display",
				], 
				[
					"Glass", "Microchip", "Semi Conductor", "Plasma Cell"
				]),
			new Factory("Distillery",
				1245,
				11897500,
				[ 
					"Liquor",
				], 
				[
					"Energy Cell", "Wheat", "Water"
				]),
			new Factory("Drill Factory",
				9542,
				39693000,
				[ 
					"Drill",
					"Scrap Metal",
				], 
				[
					"Laser Head", "Processor", "Steel", "Diamond"
				]),
			new Factory("Drone Factory",
				2587,
				15555000,
				[ 
					"Drone",
					"Scrap Metal",
				], 
				[
					"Fuel", "Plasma Cell", "Metal Plate"
				]),
			new Factory("Electro Magnet Factory",
				644,
				5101500,
				[ 
					"Electro Magnet",
				], 
				[
					"Steel", "Copper", "Conductor", "Transformator"
				]),
			new Factory("Electromagnetic Charge Factory",
				11188,
				35049000,
				[ 
					"Electromagnetic Charge",
				], 
				[
					"Energy Container", "Electro Magnet", "Energy Tube", "Transformator"
				]),
			new Factory("Energy Container Factory",
				1087,
				4215000,
				[ 
					"Energy Container",
				], 
				[
					"Energy Cell", "Transformator"
				]),
			new Factory("Energy Generator Factory",
				6383,
				18057000,
				[ 
					"Energy Generator",
				], 
				[
					"Energy Cell", "Microchip", "Conductor"
				]),
			new Factory("Energy Inverter Factory",
				2044,
				9151500,
				[ 
					"Energy Inverter",
				], 
				[
					"Energy Tube", "Conductor", "Transformator"
				]),
			new Factory("Energy Tube Factory",
				965,
				6325500,
				[ 
					"Energy Tube",
				], 
				[
					"Plastic", "Steel", "Platinum", "Neon", "Steel", "Energy Cell"
				]),
			new Factory("Explosive Charge Factory",
				1518,
				9637500,
				[ 
					"Explosive Charge",
				], 
				[
					"Fluorine", "Steel", "Energy Cell", "Plastic", "Chemicals", "Acid, Adhesive"
				]),
			new Factory("Fabric Factory",
				546,
				5230000,
				[ 
					"Fabric",
				], 
				[
					"Sheep"
				]),
			new Factory("Fertilizer Factory 1",
				234,
				5135500,
				[ 
					"Fertilizer",
					"Toxic Waste",,
				], 
				[
					"Chemicals", "Mineral", "Energy Cell", "Solvent"
				]),
			new Factory("Fertilizer Factory 2",
				192,
				5198500,
				[ 
					"Fertilizer",
					"Toxic Waste",,
				], 
				[
					"Plankton", "Mineral", "Energy Cell"
				]),
			new Factory("Fish Farm",
				194,
				4089000,
				[ 
					"Fish",
					"Bio Gas",
					"Plankton",
				], 
				[
					"Water", "Wheat", "Oxygen"
				]),
			new Factory("Food Bar Factory",
				298,
				4600000,
				[ 
					"Food Bar",
				], 
				[
					"Energy Cell", "Wheat", "Corn", "Rice"
				]),
			new Factory("Food Factory",
				800,
				8130000,
				[ 
					"Food",
				], 
				[
					"Wheat", "Meat", "Corn", "Vegetable"
				]),
			new Factory("Force Generator Factory",
				23136,
				55681500,
				[ 
					"Force Generator",
				], 
				[
					"Electro Magnet", "Steel", "Plastic", "Nanobot", "Energy Generator"
				]),
			new Factory("Fruit Farm",
				171,
				4040000,
				[ 
					"Fruit",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Fuel Factory",
				165,
				3732000,
				[ 
					"Fuel",
					"Toxic Waste"
				], 
				[
					"Energy Cell", "Oil", "Nitrogen", "Fluorine"
				]),
			new Factory("Fungus Farm",
				230,
				3679500,
				[ 
					"Fungus",
					"Toxic Waste",,
				], 
				[
					"Bio Gas", "Water", "Mineral"
				]),
			new Factory("Fusion Core Factory",
				4092,
				15465000,
				[ 
					"Fusion Core",
				], 
				[
					"Hydrogen", "Gold", "Plasma", "Transformator", "Energy Tube"
				]),
			new Factory("Fusion Generator Factory",
				18459,
				48612000,
				[ 
					"Fusion Generator",
				], 
				[
					"Fusion Core", "Steel", "Plasma Cell", "Power Unit"
				]),
			new Factory("Gas Collector 1",
				110,
				5700000,
				[ 
					"Helium",
					"Hydrogen",
					"Neon",
					"Chlorine",
				], 
				[]),
			new Factory("Gas Collector 2",
				138,
				5880000,
				[ 
					"Nitrogen",
					"Neon",
					"Chlorine",
					"Fluorine",
				], 
				[]),
			new Factory("Gas Collector 3",
				144,
				4215000,
				[ 
					"Oxygen",
					"Hydrogen",
					"Nitrogen",
				], 
				[]),
			new Factory("Gas Collector 4",
				120,
				57000000,
				[ 
					"Helium",
					"Hydrogen",
					"Chlorine",
					"Fluorine",
				], 
				[]),
			new Factory("Gauss Rail Factory",
				6188,
				22111500,
				[ 
					"Gauss Rail",
				], 
				[
					"Energy Cell", "Electro Magnet", "Energy Tube", "High Pressure Tube", "Transformator"
				]),
			new Factory("Glass Manufacturer",
				98,
				3956000,
				[ 
					"Glass",
				], 
				[
					"Ore", "Crystal"
				]),
			new Factory("Gun Factory",
				2464,
				10078500,
				[ 
					"Gun",
				], 
				[
					"Steel", "Ammunition", "Aluminium", "Plastic"
				]),
			new Factory("High Capacity Lens Factory",
				938,
				7193500,
				[ 
					"High Capacity Lens",
				], 
				[ 
					"Glass", "Carbon", "Plastic", "Diamond"
				]),
			new Factory("High Pressure Tube Factory",
				1650,
				8089000,
				[ 
					"High Pressure Tube",
				], 
				[
					"Steel", "Aluminium", "Carbon", "Adhesive", "Steel Tube"
				]),
			new Factory("Ice Mine",
				0,
				7750000,
				[ 
					"Water",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Jewelry Manufacturer 1",
				336,
				7540000,
				[ 
					"Jewelry",
				], 
				[
					"Gold", "Diamond"
				]),
			new Factory("Jewelry Manufacturer 2",
				336,
				7890000,
				[ 
					"Jewelry",
				], 
				[
					"Platinum", "Gem"
				]),
			new Factory("Laser Compressor Factory",
				2633,
				10794000,
				[ 
					"Laser Compressor",
					"Scrap Metal",
				], 
				[
					"Plasma Cell", "Transformator", "Energy Tube", "Wire"
				]),
			new Factory("Laser Head Factory",
				1564,
				9102000,
				[ 
					"Laser Head",
					"Toxic Waste"
				], 
				[
					"Glass", "Conductor", "Aluminium", "Energy Cell"
				]),
			new Factory("Laser Modulator Factory",
				6697,
				21391500,
				[ 
					"Laser Modulator",
				], 
				[
					"Servo", "Energy Tube", "Transformator", "Energy Cell"
				]),
			new Factory("Lead Mine",
				134,
				9500000,
				[ 
					"Lead",
				], 
				[]),
			new Factory("Luxury Food Factory",
				2581,
				16594500,
				[ 
					"Luxury Food",
				], 
				[
					"Energy Cell", "Wheat", "Fruit", "Spices", "Wine"
				]),
			new Factory("Meat Factory",
				703,
				5912500,
				[ 
					"Meat",
					"Leather",
				], 
				[
					"Cattle"
				]),
			new Factory("Medical Supplies Factory",
				3207,
				16680000,
				[ 
					"Medical Supplies",
				], 
				[
					"Water", "Chemicals", "Fabric", "Zinc", "Chlorine"
				]),
			new Factory("Metal Plate Factory",
				423,
				4404000,
				[ 
					"Metal Plate",
				], 
				[
					"Steel", "Silver"
				]),
			new Factory("Microchip Factory",
				896,
				3553500,
				[ 
					"Microchip",
				], 
				[
					"Wire", "Semi Conductor", "Energy Cell"
				]),
			new Factory("Mineral Extractor",
				134,
				9500000,
				[ 
					"Mineral",
				], 
				[]),
			new Factory("Mining Robot Factory",
				87588,
				206980500,
				[ 
					"Mining Robot",
					"Scrap Metal",
				], 
				[
					"Power Unit", "Processor", "Display", "Nanobot", "Drill", "Coolant", "Teleporter"
				]),
			new Factory("Nanobot Factory",
				2230,
				11280500,
				[ 
					"Nanobot",
				], 
				[
					"Crystal", "Semi Conductor"
				]),
			new Factory("Noble Metal Mine 3",
				0,
				7225000,
				[ 
					"Gold",
					"Platinum",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Noble Metal Mine 2",
				0,
				6175000,
				[ 
					"Silver",
					"Platinum",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Noble Metal Mine 1",
				0,
				5650000,
				[ 
					"Silver",
					"Gold",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Oil Refinery",
				164,
				4950000,
				[ 
					"Oil",
				], 
				[
					"Energy Cell", "Raw Oil"
				]),
			new Factory("Oil Rig",
				0,
				5125000,
				[ 
					"Raw Oil",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Ore Mine",
				140,
				9850000,
				[ 
					"Ore",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Paint Manufacturer",
				642,
				5880000,
				[ 
					"Paint",
					"Toxic Waste"
				], 
				[
					"Oil", "Water", "Chemicals", "Solvent", "Acid"
				]),
			new Factory("Paper Factory",
				246,
				4390000,
				[ 
					"Paper",
				], 
				[
					"Wood", "Water"
				]),
			new Factory("Plankton Collector	",
				117,
				8625000,
				[ 
					"Plankton",
				], 
				[]),
			new Factory("Plant Farm",
				88,
				2290000,
				[ 
					"Plant",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Plasma Cell Factory",
				464,
				4930500,
				[ 
					"Plasma Cell",
				], 
				[
					"Energy Cell", "Steel", "Bio Gas", "Neon", "Helium"
				]),
			new Factory("Plastic Manufacturer",
				274,
				4022500,
				[ 
					"Plastic",
				], 
				[
					"Oil", "Energy Cell"
				]),
			new Factory("Potato Farm",
				99,
				2290000,
				[ 
					"Potato",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Power Unit Factory",
				404,
				4350000,
				[ 
					"Power Unit",
				], 
				[
					"Transformator", "Energy Cell", "Plasma Cell"
				]),
			new Factory("Processor Factory",
				9430,
				249838500,
				[ 
					"Processor",
				], 
				[
					"Microchip", "Semi Conductor", "Copper", "Platinum", "Gold"
				]),
			new Factory("Protein Factory",
				907,
				3049500,
				[ 
					"Protein",
				], 
				[
					"Meat", "Dairy"
				]),
			new Factory("Rice Farm",
				98,
				2990000,
				[ 
					"Rice",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Rocket Factory",
				4500,
				18561000,
				[ 
					"Rocket",
				], 
				[
					"Warhead", "Fuel", "Steel", "Microchip"
				]),
			new Factory("Rubber Factory",
				355,
				4383000,
				[ 
					"Rubber",
					"Toxic Waste",,
					"Acid",
				], 
				[
					"Energy Cell", "Oil"
				]),
			new Factory("Satellite Factory",
				30669,
				79653000,
				[ 
					"Satellite",
					"Scrap Metal",
				], 
				[
					"Solar Panel", "Processor", "Display", "Energy Container", "Steel Tube"
				]),
			new Factory("Scrap Metal Trader",
				100,
				7750000,
				[ 
					"Scrap Metal",
				], 
				[]),
			new Factory("Semi Conductor Manufacturer",
				516,
				5074500,
				[ 
					"Semi Conductor",
				], 
				[
					"Steel", "Silicon", "Gold", "Energy Cell"
				]),
			new Factory("Servo Factory",
				925,
				5659500,
				[ 
					"Servo",
				], 
				[
					"Steel", "Aluminium", "Conductor", "Plastic"
				]),
			new Factory("Sheep Ranch 1",
				325,
				4631500,
				[ 
					"Sheep",
					"Fabric"
				], 
				[
					"Energy Cell", "Oxygen", "Wheat", "Water"
				]),
			new Factory("Sheep Ranch 2",
				325,
				4715500,
				[ 
					"Sheep",
					"Bio Gas",
					"Fabric"
				], 
				[
					"Energy Cell", "Oxygen", "Corn", "Water"
				]),
			new Factory("Silicon Mine",
				134,
				9500000,
				[ 
					"Silicon",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Solar Cell Factory",
				313,
				7015000,
				[ 
					"Solar Cell",
				], 
				[
					"Zinc", "Silicon", "Platinum", "Gold", "Energy Cell"
				]),
			new Factory("Solar Panel Factory",
				2286,
				11575000,
				[ 
					"Solar Panel",
				], 
				[
					"Solar Cell", "Transformator"
				]),
			new Factory("Solar Power Plant",
				84,
				6875000,
				[ 
					"Energy Cell",
				], 
				[]),
			new Factory("Spices Farm",
				1078,
				10256500,
				[ 
					"Spices",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water", "Fertilizer"
				]),
			new Factory("Steel Factory 1",
				148,
				4467000,
				[ 
					"Steel",
				], 
				[
					"Scrap Metal", "Coal"
				]),
			new Factory("Steel Factory 2",
				111,
				4715500,
				[ 
					"Steel",
				], 
				[
					"Ore", "Coal", "Carbon"
				]),
			new Factory("Steel Tube Factory",
				564,
				4872000,
				[ 
					"Steel Tube",
				], 
				[
					"Steel", "Aluminium"
				]),
			new Factory("Targeting Card Factory",
				9499,
				29289500,
				[ 
					"Targeting Card",
				], 
				[
					"Microchip", "Copper", "Processor"
				]),
			new Factory("Targeting System Factory",
				15827,
				36057000,
				[ 
					"Targeting System",
				], 
				[
					"Targeting Card", "Processor", "Energy Cell", "Conductor", "Wire"
				]),
			new Factory("Tea Farm",
				207,
				4512500,
				[ 
					"Tea",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Teleporter Factory",
				20997,
				47667000,
				[ 
					"Teleporter",
					"Scrap Metal",
				], 
				[
					"Metal Plate", "Power Unit", "Antigrav Unit", "Plasma Cell", "Conductor", "Transformator"
				]),
			new Factory("Tesla Coil Factory",
				9627,
				26458500,
				[ 
					"Military Tesla Coil",
					"Industrial Tesla Coil",
				], 
				[
					"Steel", "Copper", "Fusion Core", "Plastic"
				]),
			new Factory("Tools Factory",
				571,
				5299500,
				[ 
					"Tools",
				], 
				[
					"Steel", "Platinum", "Silver", "Aluminium", "Energy Cell"
				]),
			new Factory("Transformator Factory",
				558,
				5047500,
				[ 
					"Transformator",
				], 
				[
					"Steel", "Plastic", "Silicon", "Silver", "Energy Cell"
				]),
			new Factory("Turbine Factory",
				6692,
				19060500,
				[ 
					"Turbine",
				], 
				[
					"Servo", "Steel", "Coolant", "Power Unit"
				]),
			new Factory("Vegetable Farm",
				96,
				2920000,
				[ 
					"Vegetable",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Vehicle Factory",
				41115,
				89611500,
				[ 
					"Vehicle",
					"Scrap Metal",
				], 
				[
					"Rubber", "Power Unit", "Energy Generator", "Metal Plate", "Antigrav Unit", "Display"
				]),
			new Factory("War Robot Factory",
				55314,
				108210000,
				[ 
					"War Robot",
					"Scrap Metal",
				], 
				[
					"Power", "Processor", "Display", "Nanobot", "Gun", "Teleporter", "Coolant"
				]),
			new Factory("Warhead Factory",
				1879,
				11532000,
				[ 
					"Warhead",
					"Scrap Metal",
				], 
				[
					"Conductor", "Chemicals", "Metal Plate"
				]),
			new Factory("Water Collector",
				100,
				7750000,
				[ 
					"Water",
				], 
				[]),
			new Factory("Wheat Farm",
				95,
				2864000,
				[ 
					"Wheat",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Wine Factory",
				1214,
				1137000,
				[ 
					"Wine",
				], 
				[
					"Fruit", "Fungus"
				]),
			new Factory("Wire Manufacturer",
				380,
				4638000,
				[ 
					"Wire",
				], 
				[
					"Plastic", "Steel", "Gold"
				]),
			new Factory("Wood Farm",
				156,
				4075000,
				[ 
					"Wood",
					"Oxygen",
				], 
				[
					"Energy Cell", "Water"
				]),
			new Factory("Zinc Mine",
				167,
				11250000,
				[ 
					"Zinc",
				], 
				[
					"Acid", "Antigrav Unit", "Drill", "Fusion Generator", "Medical Supplies", "Mining Robot", "Solvent"
				]),
			new Factory("Biotope",
				0,
				0,
				[
					"Cattle",
					"Coal",
					"Corn",
					"Fish",
					"Food",
					"Food Bar",
					"Fungus",
					"Glass",
					"Plant",
					"Rice",
					"Sheep",
					"Vegetable",
					"Water",
					"Wheat",
					"Wood"
				],
				[]),
			new Factory("Casino",
				0,
				0,
				[],
				[
					"Beer",
					"Wine",
					"Liquor",
					"Food",
					"Luxury Food",
					"Water",
					"Medical Supplies"
				]),
			new Factory("Equipment Dock",
				0,
				0,
				[],
				[
					"Ammunition",
					"Ammunition L",
					"Ammunition M",
					"Ammunition S",
					"Antigrav Generator",
					"Drone",
					"Fusion Core",
					"Laser Compressor",
					"Laser Head",
					"Rocket",
					"Satellite",
					"Tools",
					"Warhead"
				]),
			new Factory("Habitat",
				0,
				0,
				[],
				[
					"Beer",
					"Book",
					"Cocoa",
					"Coffee",
					"Food",
					"Fruit",
					"Liquor",
					"Meat",
					"Spices",
					"Tea",
					"Vegetable",
					"Water",
					"Wine",
					"Wood"
				]),
			new Factory("Military Outpost",
				0,
				0,
				[],
				[
					"Ammunition",
					"Ammunition L",
					"Ammunition M",
					"Ammunition S",
					"Body Armor",
					"Electromagnetic Charge",
					"Explosive Charge",
					"Food Bar",
					"Gun",
					"Medical Supplies",
					"Military Tesla Coil",
					"Targeting System",
					"Vehicle",
					"War Robot"
				]),
			new Factory("Repair Dock",
				0,
				0,
				[],
				[					
					"Force Generator",
					"Fuel",
					"Medical Supplies",
					"Metal Plate",
					"Nanobot",
					"Oxygen",
					"Solar Cell",
					"Solar Panel",
					"Steel",
					"Wire"
				]),
			new Factory("Research Station",
				0,
				0,
				[],
				[
					"Antigrav Generator",
					"Drill",
					"Electron Accelerator",
					"Fusion Generator",
					"High Capacity Lens",
					"Force Generator",
					"Neutron Accelerator",
					"Proton Accelerator",
					"Satellite",
					"Teleporter",
					"Turbine"
				]),
			new Factory("Rift Research Station",
				0,
				0,
				[],
				[
					"Antigrav Generator",
					"Drill",
					"Electron Accelerator",
					"Fusion Generator",
					"High Capacity Lens",
					"Force Generator",
					"Neutron Accelerator",
					"Proton Accelerator",
					"Rift Research Data",
					"Satellite",
					"Teleporter",
					"Turbine"
				]),
			new Factory("Resource Depot",
				0,
				0,
				[],
				[]),
			new Factory("Scrapyard",
				0,
				0,
				[],
				[]),
			new Factory("Shipyard",
				0,
				0,
				[],
				[
					"Aluminium",
					"Antigrav Generator",
					"Computation Mainframe",
					"Display",
					"Energy Container",
					"Energy Tube",
					"Fusion Core",
					"Industrial Tesla Coil",
					"Medical Supplies",
					"Metal Plate",
					"Turbine",
				]),
			new Factory("Planetary Trading Post",
				0,
				0,
				[
					"Copper"
				],
				[]),
			new Factory("Travel Hub",
				0,
				0,
				[],
				[
					"Turbine"
				])
		])*/
	}

}
