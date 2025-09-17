import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvSidebarCss = ":host{display:flex;flex-direction:column;grid-column:1;grid-row:1 / 3}.sidebar-header{padding:1.2rem;display:flex;justify-content:center;align-items:center}.sidebar-content{padding:1.2rem;flex:1}";

const CvSidebar = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.backgroundColor = 'rgb(218, 228, 235)';
    }
    render() {
        return (h(Host, { key: '759761857ba9efd00663590a699b2d667616e066', style: { backgroundColor: this.backgroundColor } }, h("div", { key: '800f9b09b79a9986ed59721fa86637571b69e96c', class: "sidebar-header" }, h("slot", { key: 'e68fb045d380946bc94d9861c59a4ace79d88e85', name: "header" })), h("div", { key: 'b3f808c086a5ca737826f568697988d7efd0daef', class: "sidebar-content" }, h("slot", { key: '0b22bb9bfcfcf358439b2703a90d3560cabca63b', name: "content" }))));
    }
};
CvSidebar.style = cvSidebarCss;

export { CvSidebar as C };
//# sourceMappingURL=cv-sidebar-BnD8lWtR.js.map

//# sourceMappingURL=cv-sidebar-BnD8lWtR.js.map