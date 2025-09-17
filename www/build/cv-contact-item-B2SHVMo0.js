import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvContactItemCss = ":host{font-family:Poppins, sans-serif}.contact-item{display:flex;align-items:center;margin-bottom:1rem;font-size:0.875rem;color:#666}.contact-icon{width:1.25rem;height:1.25rem;margin-right:0.75rem;flex-shrink:0}.contact-content{flex:1}";

const CvContactItem = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: 'bf8f11eb4f03e2e64d4a7aa72602118575460a8c' }, h("div", { key: 'a84861b06848f74307760ee4a671661a7a3a7cc4', class: "contact-item" }, this.icon && (h("span", { key: '03c2f22f66b08dc1999b618136882f7970ed176a', class: "contact-icon" }, this.icon)), h("span", { key: 'bdf7b3de60d689d9c08dc510ebcef7a92adcde73', class: "contact-content" }, h("slot", { key: 'cd220f863a71796f6dcd0ea114c56cbc7ffa5b80' })))));
    }
};
CvContactItem.style = cvContactItemCss;

export { CvContactItem as C };
//# sourceMappingURL=cv-contact-item-B2SHVMo0.js.map

//# sourceMappingURL=cv-contact-item-B2SHVMo0.js.map