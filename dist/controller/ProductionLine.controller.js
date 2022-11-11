sap.ui.define(["./BaseController","../model/formatter","sap/ui/model/json/JSONModel","./Types","sap/m/Panel","sap/m/Select","sap/ui/core/Item","sap/m/Title","sap/m/Button"],function(e,t,r,o,a,s,n,c,i){function l(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const p=l(e);const d=l(t);const f=o["Factory"];const u=o["Game"];const y=o["Product"];class g extends y{constructor(e,t,r,o,a){super(e.Name,e.Dangerous,e.Illegal,e.AvgPrice,e.Level,e.Customers,e.Manufacturer);this.path=t;this.control=r;this.factoryOptions=o;this.parent=a}getActiveFactory(){for(const e of this.factoryOptions){if(e.active){return e}}}}class v extends f{constructor(e,t,r,o,a,s){super(e.Name,e.ProductionCap,e.Cost,e.Products,e.Materials);this.selectid=e.Name.replace(/\s/g,"");this.path=t;this.requiredProducts=r;this.control=o;this.active=a;this.parent=s}getMaterialLevelCombined(e){var t=0;for(const r of this.Materials){t+=e.getProduct(r).Level}return t}}class m extends p{formatter=d;onInit(){var e=new r;e.setData({TargetFactory:"",products:[],mainFactory:{},deathZone:[],tree:[],ownedFactories:[],requiredFactories:[]});this.getView().setModel(e,"View");this.getRouter().getRoute("productionLine").attachPatternMatched(this.onPatternMatched,this);var t=this.byId("targetFactoryInput");t.setFilterFunction(function(e,t){return t.getText().match(new RegExp("^"+e,"i"))})}async generateProductionLine(e){var t=this;var r=this.getView();var o=new u(this.getModel("GoodModel").getProperty("/Goods"),this.getModel("FactorieModel").getProperty("/Factories"));var l=0;var p="";var d=this.getModel("View");var f=d.getProperty("/deathZone");for(const e of f){e.destroy()}f=[];var y=[];var m=r.byId("targetFactoryInput").getValue();var h=o.getFactory(m);d.setProperty("/mainFactory",h);var P=o.getProductsFromFactory(h.Name);d.setProperty("/products",P);var N=function(e,t,r){var a=o.getMaterialsForFactory(r.Name);for(const e of a){var s=t+"/"+e.Name.replace(/\s/g,"");r.requiredProducts.push(new g(e,s,null,[],r.path))}for(var n of r.requiredProducts){n=w(n,r.active);r.control.addContent(n.control)}return e};var w=function(e,r){p=p+"/"+e.Name.replace(/\s/g,"");var u=e.Name.replace(/\s/g,"");e.control=new a(u+l,{expanded:false,expandable:true,headerText:`{View>/tree${p}/Name}`});d.setProperty("/tree"+p,e);f.push(e.control);l++;var g=o.getFactoriesForProduct(e.Name);try{for(const t of g){var m=p+"/"+t.Name.replace(/\s/g,"");e.factoryOptions.push(new v(t,m,[],null,false))}}catch(t){console.warn("No factory for "+e.Name);return e}if(e.factoryOptions.length==0)return e;if(g.length==1){e.factoryOptions[0].active=r;var m=p+"/"+e.factoryOptions[0].Name.replace(/\s/g,"");if(e.Level==0){e.factoryOptions[0].control=new c(u+l,{text:`{View>/tree${m}/Name}`});e.control.addContent(e.factoryOptions[0].control)}else{e.factoryOptions[0].control=new a(u+l,{expanded:true,expandable:true,headerText:`{View>/tree${m}/Name}`});e.control.addContent(e.factoryOptions[0].control);e=N(e,p,e.factoryOptions[0])}l++;f.push(e.factoryOptions[0].control);if(e.factoryOptions[0].active){y.indexOf(e.factoryOptions[0].Name)===-1?y.push(e.factoryOptions[0].Name):null}d.setProperty(`/tree${m}`,e.factoryOptions[0])}else{var h=new s(u+l,{selectedItem:`View>/tree${p}/activeChild`,items:{path:`View>/tree${p}/factoryOptions`,template:new n({text:"{View>Name}",key:"{View>selectid}"}),templateShareable:true},change:t.selectFactory});l++;var P=new i(u+l,{text:`Apply to all {View>/tree${p}/Name} facilities.`,press:t.setBaseFactory}).addStyleClass("sapUiSmallMarginBegin");l++;e.control.addContent(h);e.control.addContent(P);f.push(h);f.push(P);var w;var F=-1;for(const t of e.factoryOptions){if(F==-1){w=t.Name;F=t.getMaterialLevelCombined(o)}if(t.getMaterialLevelCombined(o)<F){w=t.Name;F=t.getMaterialLevelCombined(o)}}h.setSelectedKey(w.replace(/\s/g,""));for(var O of e.factoryOptions){u=e.Name.replace(/\s/g,"")+O.Name.replace(/\s/g,"");var m=p+"/"+O.Name.replace(/\s/g,"");if(e.Level==0){O.control=new c(u+l,{text:`{View>/tree${m}/Name}`,width:"100%",visible:`{View>/tree${m}/active}`});f.push(O.control);l++;e.control.addContent(O.control)}else{O.control=new a(u+l,{expanded:true,headerText:`{View>/tree${m}/Name}`,expandable:true,visible:`{View>/tree${m}/active}`});f.push(O.control);l++;e.control.addContent(O.control);e=N(e,p,O)}O.parent=p;if(r){O.active=O.Name==w}else{O.active=false}d.setProperty("/tree"+m,O);if(O.active){y.indexOf(O.Name)===-1?y.push(O.Name):null}}}p=p.substring(0,p.lastIndexOf("/"));return e};var F=o.getMaterialsForFactory(h.Name);var O=[];for(const e of F){O.push(new g(e,"/"+e.Name.replace(/\s/g,""),null,[]))}for(var x of O){x=w(x,true)}for(const e of O){t.byId("DetailedProdList").addItem(e.control)}d.setProperty("/prodTree",O);d.setProperty("/deathZone",f);d.setProperty("/requiredFactories",y.sort())}selectFactory(e){var t=e.getSource();var r=e.getParameters().selectedItem;var o=this.getModel("View");var a=t.getBindingPath("items");var s=o.getProperty(a);for(var n=0;n<s.length;n++){o.setProperty(a+`/${n}/active`,false);if(o.getProperty(a+`/${n}/Name`)==r.getText()){o.setProperty(a+`/${n}/active`,true)}}var c=[];var i=function(e){try{var t=e.getActiveFactory();c.indexOf(t.Name)===-1?c.push(t.Name):null;for(const e of t.requiredProducts){i(e)}}catch(e){console.warn("No factory")}};var l=o.getProperty("/mainFactory").Materials;for(const e of l){i(o.getProperty("/tree/"+e.replace(/\s/g,"")))}o.setProperty("/requiredFactories",c.sort())}setBaseFactory(e){var t=this.getModel("View");var r=e.getSource();var o=r.getBindingPath("text");var a=t.getProperty(o);var s=t.getProperty(o.substring(0,o.lastIndexOf("/")));s=s.control.getContent()[0].getSelectedItem().getText();var n=t.getProperty("/mainFactory").Materials;var c=function(e){if(e.Name==a){var r=e.control.getContent()[0];r.setSelectedKey(s.replace(/\s/g,""));var o="/tree"+e.path+"/factoryOptions/";for(let r=0;r<e.factoryOptions.length;r++){t.setProperty(o+r+"/active",false)}for(let r=0;r<e.factoryOptions.length;r++){if(s==t.getProperty(o+r+"/Name")){t.setProperty(o+r+"/active",true);break}}}else{for(const t of e.factoryOptions){for(const e of t.requiredProducts){c(e)}}}};for(const e of n){c(t.getProperty("/tree/"+e.replace(/\s/g,"")))}var i=[];var l=function(e){try{var t=e.getActiveFactory();i.indexOf(t.Name)===-1?i.push(t.Name):null;for(const e of t.requiredProducts){l(e)}}catch(e){console.warn("No factory")}};for(const e of n){l(t.getProperty("/tree/"+e.replace(/\s/g,"")))}t.setProperty("/requiredFactories",i.sort())}onDropHave(e){var t=e.getParameter("draggedControl"),r=t.getParent(),o=r.indexOfItem(t);var a=this.getModel("View");var s=a.getProperty("/requiredFactories");var n=a.getProperty("/ownedFactories");var c=s[o];s.splice(o,1);n.push(c);a.setProperty("/ownedFactories",n);a.setProperty("/requiredFactories",s)}onPatternMatched(e){}}return m});