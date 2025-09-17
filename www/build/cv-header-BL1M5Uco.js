import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvHeaderCss = ":host{font-family:Poppins, sans-serif;color:#666;font-weight:300}header{display:block}.job-role{font-size:1.2em;font-weight:300;letter-spacing:0.1875em;text-transform:uppercase;margin-bottom:0.9375rem;margin-top:0}.name{font-size:2em;font-weight:500;text-transform:uppercase;letter-spacing:0.125em;margin-bottom:1.25rem;margin-top:0;position:relative}.name::after{content:\"\";display:block;width:3rem;height:0.11rem;background-color:currentColor;margin:1.875rem 0 1.875rem 0}.content{line-height:1.6;text-align:justify}";

const CvHeader = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.color = '#2c5f6f';
    }
    render() {
        return (h(Host, { key: 'a30fc4c01f09015a868fe6372a5e7a8ea5040fd3' }, h("header", { key: '57c2fab4fb859707257c137a65594f001bd38259' }, this.jobRole && (h("p", { key: '3bdb7c67e50b365b6f0c51cce635f88d5d31b61d', class: "job-role", style: { color: this.color } }, this.jobRole)), this.name && (h("h1", { key: 'cf59b4365e2da75805015373912553ed6b9c5d14', class: "name", style: { color: this.color } }, this.name)), h("div", { key: '82a39e57a293d11ba0f308c1c31f1fa4f77080b6', class: "content" }, h("slot", { key: '5572f77774490b10554457359b5fe9765d321631' })))));
    }
};
CvHeader.style = cvHeaderCss;

export { CvHeader as C };
//# sourceMappingURL=cv-header-BL1M5Uco.js.map

//# sourceMappingURL=cv-header-BL1M5Uco.js.map