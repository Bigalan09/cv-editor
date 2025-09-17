import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvMainCss = ":host{display:flex;flex-direction:column;grid-column:2;grid-row:1 / 3}.main-header{background-color:rgb(245, 245, 245);padding:1.2rem;margin-top:1.2rem}.main-content{background-color:white;padding:1.2rem;flex:1}";

const CvMain = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: '5ef53d380d4cf1449bbadcd39d815e375bdc3bdd' }, h("div", { key: '01f8f804eaa4082c9fd39f02500fddc06133ea48', class: "main-header" }, h("slot", { key: 'f709c64a93c630365101475cbb57e30013191dd9', name: "header" })), h("div", { key: 'aa4abb428b61d143e8e9384bdee58c0ea657959a', class: "main-content" }, h("slot", { key: 'd833901a4fddb5f98f0d5536233cb6fca9008a03', name: "content" }))));
    }
};
CvMain.style = cvMainCss;

export { CvMain as C };
//# sourceMappingURL=cv-main-C7usG0Nq.js.map

//# sourceMappingURL=cv-main-C7usG0Nq.js.map