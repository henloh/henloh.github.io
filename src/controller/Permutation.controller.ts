import BaseController from "./BaseController";
import formatter from "../model/formatter";
import Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";
import Page from "sap/m/Page";

/**
 * @namespace de.henloh.prodts.controller
 */
export default class Permutation extends BaseController {
	private formatter = formatter;

	public onInit(): void {
		var Model = new JSONModel();
		document.title = "Permutation";
		Model.setData({text: ""});
		this.getView().setModel(Model, "View");
		this.getRouter().getRoute("main").attachPatternMatched(this.onPatternMatched, this);
	}
	public onPatternMatched(event: Event): void {

	}
	public clearData(event: Event): void {
		var model = this.getView().getModel("View") as JSONModel;
		model.setProperty("/Final", " ")
		model.setProperty("/text", " ");
	}
	public downloadCSV(event: Event): void {
		var model = this.getView().getModel("View") as JSONModel;
		var csvContent = model.getProperty("/Final");
		
		var hiddenElement = document.createElement('a');  
		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);  
		hiddenElement.target = '_blank';  
		  
		//provide the name for the CSV file to be downloaded  
		hiddenElement.download = 'generiert.csv';  
		hiddenElement.click();
	}
	public generateCSV(event: Event): void {
		var model = this.getView().getModel("View") as JSONModel;
		var data = model.getProperty("/text");
		try {
			// Head
			var Final = "";
			var Obj = JSON.parse(data);
			for (const column of Obj.columns) {
				Final += column.title + ";";
			}
			Final += "\n";
			// Rows
			var dataKeys: string[] = Object.keys(Obj.data);
			var rowCount: int = 0;
			for (const entry of dataKeys) {
				rowCount == 0 ? rowCount = Obj.data[entry].length : rowCount *= Obj.data[entry].length;
			}

			// only permutate once
			var permutatedData:string[] = [];

			var addPart = function(permutations: any, options: any, result: any) {
				for (let index = 0; index < permutations.length; index++) {
					var permutation = permutations[index];
					//console.log(permutations);
					
					for (let partIndex = 0; partIndex < permutation.length; partIndex++) {
						var resultpart = permutation[partIndex];
						var remainingOptions = JSON.parse(JSON.stringify(options));
						// console.log(resultpart);
						if (resultpart === null) {
							
							// console.log("optionName", optionName);
							var optionData = remainingOptions[index][partIndex].data;
							// console.log("optionData", optionData);
							
							for (let dataOptionsIndex = 0; dataOptionsIndex < optionData.length; dataOptionsIndex++) {
								var permutationOption = JSON.parse(JSON.stringify(permutations));
							
								var optionName = options[index][partIndex].name;

								for (let columnFillerIndex = 0; columnFillerIndex < Obj.columns.length; columnFillerIndex++) { 
									for (let columnFillerPartIndex = 0; columnFillerPartIndex < Obj.columns[columnFillerIndex].parts.length; columnFillerPartIndex++) { 
										var columnPart =  Obj.columns[columnFillerIndex].parts[columnFillerPartIndex];
										var field = Obj.columns[columnFillerIndex].parts[columnFillerPartIndex][1];
										if (columnPart[0] === optionName && permutationOption[columnFillerIndex][columnFillerPartIndex] === null) {
											// last level of data
											
											permutationOption[columnFillerIndex][columnFillerPartIndex] = optionData[dataOptionsIndex][field];

										}
									}
								}
								// check if all filled then add to result.
								var hasVoids = false;
								var row = "";
								for (const checkPermutation of permutationOption) {
									for (const checkPermutationText of checkPermutation) {
										if (checkPermutationText === null) {
											hasVoids = true;
											break;
										}
										row += checkPermutationText;
									}
									if(hasVoids) break;
									row += ";";
								}
								row += "\n";
								if (!hasVoids) {
									result.push( row );
									permutatedData.push(optionName);
								}
								
								// remove done perms and call again
								if (dataOptionsIndex === optionData.length -1) {
									//remainingOptions[index][partIndex] = null;
								}
								//console.log(JSON.stringify(remainingOptions));
								
								addPart(permutationOption, remainingOptions, result)
							}
							return result;
						}

					}
				}
			}
			var basepermutations = [];
			var baseoptions = [];
			for (let index = 0; index < Obj.columns.length; index++) {

				basepermutations.push([]);
				baseoptions.push([]);

				for (let partIndex = 0; partIndex < Obj.columns[index].parts.length; partIndex++) {
					const element = Obj.columns[index].parts[partIndex];
					// element.length = how deep
					// console.log(element);
					
					if (element.length === 1) {
						// no baseoptions -> direct filling
						basepermutations[index].push(Obj.data[Obj.columns[index].parts[partIndex][0]][0]);
						baseoptions[index].push(null);
					} else {
						//console.log("option added", element, dataKeys[Obj.columns[index].parts[partIndex][0]]);
						var fieldname = Obj.columns[index].parts[partIndex][0];
						
						basepermutations[index].push(null);
						
						baseoptions[index].push({
							name: fieldname,
							data: Obj.data[fieldname]
						});
					}
				}
			}
			// console.log(JSON.stringify(baseoptions));
			
			// console.log(basepermutations, baseoptions);
			// basepermutations: [ ["string"], [null],   ["string"] ]
			//      baseoptions: [ [null],     [object], [null] ]
			var rows = addPart(basepermutations, baseoptions, []);
			for (const row of rows) {
				Final += row;
			}

			model.setProperty("/rowCount", rowCount);
			
			model.setProperty("/Final", Final);
		} catch (error) {
			console.error(error);
			
		}
	}
}
