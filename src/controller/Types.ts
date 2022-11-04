export class Product {
	Name: string;
	Dangerous: boolean;
	Illegal: boolean;
	AvgPrice: number;
	Level: number;
	Customers: string[];
	Manufacturer: string[];

	constructor(Name: string,Dangerous: boolean,Illegal: boolean,AvgPrice: number,Level: number,Customers: string[],Manufacturer: string[]) {
		this.Name = Name
		this.Dangerous = Dangerous
		this.Illegal = Illegal
		this.AvgPrice = AvgPrice
		this.Level = Level
		this.Customers = Customers
		this.Manufacturer = Manufacturer
	}
}
export class Factory {
	Name: string;
	ProductionCap: number;
	Cost: number;
	Products: string[];
	Materials: string[];

	constructor(Name: string,ProductionCap: number,Cost: number,Products: string[],Materials: string[]) {
		this.Name = Name
		this.ProductionCap = ProductionCap
		this.Cost = Cost
		this.Products = Products
		this.Materials = Materials
	}
} 
export class Game {
	Factories: Factory[];
	Goods: Product[];

	constructor(Goods: Product[],Factories: Factory[]) {
		this.Goods = Goods;
		this.Factories = Factories;
	}
	public getFactory(Name: string): Factory {
		for (const factory of this.Factories) {
			if (factory.Name == Name) return factory;
		}
	}
	public getProduct(Name: string): Product {
		for (const product of this.Goods) {
			if (product.Name == Name) return product;
		}
	}
	public getProductsFromFactory(Name: string): Product[] {
		var result: Product[] = [];
		const factory = this.getFactory(Name);
		for (const productName of factory.Products) {
			result.push(this.getProduct(productName));
		}
		return result;
	}
	public getMaterialsForFactory(Name: string): Product[] {
		var result: Product[] = [];
		const factory = this.getFactory(Name);
		for (const productName of factory.Materials) {
			result.push(this.getProduct(productName));
		}
		return result;
	}
	public getFactoriesFromProduct(Name: string): Factory[] {
		var result: Factory[] = [];
		const product = this.getProduct(Name);
		for (const factoryName of product.Manufacturer) {
			result.push(this.getFactory(factoryName));
		}
		return result;
	}
	public getFactoriesForProduct(ProductName: string): Factory[] {
		var result: Factory[] = [];
		const product = this.getProduct(ProductName);
		for (const factoryName of product.Manufacturer) {
			result.push(this.getFactory(factoryName));
		}
		return result;
	}
	public getCustomersOfProduct(Name: string): Factory[] {
		var result: Factory[] = [];
		const product = this.getProduct(Name);
		for (const factoryName of product.Customers) {
			result.push(this.getFactory(factoryName));
		}
		return result;
	}
}