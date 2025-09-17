import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvSectionCss = ":host{font-family:Poppins, sans-serif;color:#666;font-weight:300}.section{margin-bottom:2rem}.section-title{font-size:1.125rem;font-weight:500;text-transform:uppercase;letter-spacing:0.125em;margin-bottom:1.2rem;margin-top:0;position:relative}.section-title::after{content:\"\";display:block;width:3rem;height:0.1rem;background-color:currentColor;margin-top:0.85rem}.section-content{display:block}";

const CvSection = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.color = "#2c5f6f";
    }
    render() {
        return (h(Host, { key: 'fdbf1c6ee33ff1fd4fee1c1c2eab08dc38404dd1' }, h("section", { key: '561c3ae521061b9ea88aba36f5241d0c36bed252', class: "section" }, this.sectionTitle && (h("h2", { key: '392858a6872bd441817d7a757a1c1250245f3a70', class: "section-title", style: { color: this.color } }, this.sectionTitle)), h("div", { key: '09bb5ff6cae8c91110b34ce4fd8605ca50b64ae0', class: "section-content" }, h("slot", { key: '43ca3f9ac9d23f4ecc2ae3f72c94956bd28abe59' })))));
    }
};
CvSection.style = cvSectionCss;

export { CvSection as C };
//# sourceMappingURL=cv-section-BaoT5WxV.js.map

//# sourceMappingURL=cv-section-BaoT5WxV.js.map