sap.ui.define([], function () {
  class Product {
    constructor(Name, Dangerous, Illegal, AvgPrice, Level, Customers, Manufacturer) {
      this.Name = Name;
      this.Dangerous = Dangerous;
      this.Illegal = Illegal;
      this.AvgPrice = AvgPrice;
      this.Level = Level;
      this.Customers = Customers;
      this.Manufacturer = Manufacturer;
    }
  }
  class Factory {
    constructor(Name, ProductionCap, Cost, Products, Materials) {
      this.Name = Name;
      this.ProductionCap = ProductionCap;
      this.Cost = Cost;
      this.Products = Products;
      this.Materials = Materials;
    }
  }
  class Game {
    constructor(Goods, Factories) {
      this.Goods = Goods;
      this.Factories = Factories;
    }
    getFactory(Name) {
      for (const factory of this.Factories) {
        if (factory.Name == Name) return factory;
      }
    }
    getProduct(Name) {
      for (const product of this.Goods) {
        if (product.Name == Name) return product;
      }
    }
    getProductsFromFactory(Name) {
      var result = [];
      const factory = this.getFactory(Name);
      for (const productName of factory.Products) {
        result.push(this.getProduct(productName));
      }
      return result;
    }
    getMaterialsForFactory(Name) {
      var result = [];
      const factory = this.getFactory(Name);
      for (const productName of factory.Materials) {
        result.push(this.getProduct(productName));
      }
      return result;
    }
    getFactoriesFromProduct(Name) {
      var result = [];
      const product = this.getProduct(Name);
      for (const factoryName of product.Manufacturer) {
        result.push(this.getFactory(factoryName));
      }
      return result;
    }
    getFactoriesForProduct(ProductName) {
      var result = [];
      const product = this.getProduct(ProductName);
      for (const factoryName of product.Manufacturer) {
        result.push(this.getFactory(factoryName));
      }
      return result;
    }
    getCustomersOfProduct(Name) {
      var result = [];
      const product = this.getProduct(Name);
      for (const factoryName of product.Customers) {
        result.push(this.getFactory(factoryName));
      }
      return result;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Product = Product;
  __exports.Factory = Factory;
  __exports.Game = Game;
  return __exports;
});
//# sourceMappingURL=Types.js.map