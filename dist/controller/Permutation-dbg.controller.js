sap.ui.define(["./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel"], function (__BaseController, __formatter, JSONModel) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }

  const BaseController = _interopRequireDefault(__BaseController);

  const formatter = _interopRequireDefault(__formatter);

  /**
   * @namespace de.henloh.prodts.controller
   */
  const Permutation = BaseController.extend("de.henloh.prodts.controller.Permutation", {
    constructor: function constructor() {
      BaseController.prototype.constructor.apply(this, arguments);
      this.formatter = formatter;
    },
    onInit: function _onInit() {
      var Model = new JSONModel();
      document.title = "Permutation";
      Model.setData({
        text: ""
      });
      this.getView().setModel(Model, "View");
      this.getRouter().getRoute("main").attachPatternMatched(this.onPatternMatched, this);
    },
    onPatternMatched: function _onPatternMatched(event) {},
    clearData: function _clearData(event) {
      var model = this.getView().getModel("View");
      model.setProperty("/Final", " ");
      model.setProperty("/text", " ");
    },
    downloadCSV: function _downloadCSV(event) {
      var model = this.getView().getModel("View");
      var csvContent = model.getProperty("/Final");
      var hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      hiddenElement.target = '_blank'; //provide the name for the CSV file to be downloaded  

      hiddenElement.download = 'generiert.csv';
      hiddenElement.click();
    },
    generateCSV: function _generateCSV(event) {
      var model = this.getView().getModel("View");
      var data = model.getProperty("/text");

      try {
        // Head
        var Final = "";
        var Obj = JSON.parse(data);

        for (const column of Obj.columns) {
          Final += column.title + ";";
        }

        Final += "\n"; // Rows

        var dataKeys = Object.keys(Obj.data);
        var rowCount = 0;

        for (const entry of dataKeys) {
          rowCount == 0 ? rowCount = Obj.data[entry].length : rowCount *= Obj.data[entry].length;
        } // only permutate once


        var permutatedData = [];

        var addPart = function (permutations, options, result) {
          for (let index = 0; index < permutations.length; index++) {
            var permutation = permutations[index]; //console.log(permutations);

            for (let partIndex = 0; partIndex < permutation.length; partIndex++) {
              var resultpart = permutation[partIndex];
              var remainingOptions = JSON.parse(JSON.stringify(options)); // console.log(resultpart);

              if (resultpart === null) {
                // console.log("optionName", optionName);
                var optionData = remainingOptions[index][partIndex].data; // console.log("optionData", optionData);

                for (let dataOptionsIndex = 0; dataOptionsIndex < optionData.length; dataOptionsIndex++) {
                  var permutationOption = JSON.parse(JSON.stringify(permutations));
                  var optionName = options[index][partIndex].name;

                  for (let columnFillerIndex = 0; columnFillerIndex < Obj.columns.length; columnFillerIndex++) {
                    for (let columnFillerPartIndex = 0; columnFillerPartIndex < Obj.columns[columnFillerIndex].parts.length; columnFillerPartIndex++) {
                      var columnPart = Obj.columns[columnFillerIndex].parts[columnFillerPartIndex];
                      var field = Obj.columns[columnFillerIndex].parts[columnFillerPartIndex][1];

                      if (columnPart[0] === optionName && permutationOption[columnFillerIndex][columnFillerPartIndex] === null) {
                        // last level of data
                        permutationOption[columnFillerIndex][columnFillerPartIndex] = optionData[dataOptionsIndex][field];
                      }
                    }
                  } // check if all filled then add to result.


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

                    if (hasVoids) break;
                    row += ";";
                  }

                  row += "\n";

                  if (!hasVoids) {
                    result.push(row);
                    permutatedData.push(optionName);
                  } // remove done perms and call again


                  if (dataOptionsIndex === optionData.length - 1) {//remainingOptions[index][partIndex] = null;
                  } //console.log(JSON.stringify(remainingOptions));


                  addPart(permutationOption, remainingOptions, result);
                }

                return result;
              }
            }
          }
        };

        var basepermutations = [];
        var baseoptions = [];

        for (let index = 0; index < Obj.columns.length; index++) {
          basepermutations.push([]);
          baseoptions.push([]);

          for (let partIndex = 0; partIndex < Obj.columns[index].parts.length; partIndex++) {
            const element = Obj.columns[index].parts[partIndex]; // element.length = how deep
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
        } // console.log(JSON.stringify(baseoptions));
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
  });
  return Permutation;
});
//# sourceMappingURL=Permutation.controller.js.map