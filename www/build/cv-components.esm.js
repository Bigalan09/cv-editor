import { B as BUILD, c as consoleDevInfo, H, w as win, N as NAMESPACE, p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-B-tutnkO.js';
export { s as setNonce } from './index-B-tutnkO.js';

/*
 Stencil Client Patch Browser v4.37.0 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  if (BUILD.isDev && !BUILD.isTesting) {
    consoleDevInfo("Running in development mode.");
  }
  if (BUILD.cloneNodeFix) {
    patchCloneNodeFix(H.prototype);
  }
  const scriptElm = BUILD.scriptDataOpts ? win.document && Array.from(win.document.querySelectorAll("script")).find(
    (s) => new RegExp(`/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) || s.getAttribute("data-stencil-namespace") === NAMESPACE
  ) : null;
  const importMeta = import.meta.url;
  const opts = BUILD.scriptDataOpts ? (scriptElm || {})["data-opts"] || {} : {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};
var patchCloneNodeFix = (HTMLElementPrototype) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
  HTMLElementPrototype.cloneNode = function(deep) {
    if (this.nodeName === "TEMPLATE") {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["cv-contact-item",[[257,"cv-contact-item",{"icon":[1]}]]],["cv-employment",[[257,"cv-employment",{"position":[1],"company":[1],"period":[1],"achievements":[16],"titleColor":[1,"title-color"],"bulletColor":[1,"bullet-color"]}]]],["cv-header",[[257,"cv-header",{"name":[1],"jobRole":[1,"job-role"],"color":[1]}]]],["cv-main",[[257,"cv-main"]]],["cv-profile-image",[[257,"cv-profile-image",{"src":[1],"alt":[1]}]]],["cv-section",[[257,"cv-section",{"sectionTitle":[1,"section-title"],"color":[1]}]]],["cv-sidebar",[[257,"cv-sidebar",{"backgroundColor":[1,"background-color"]}]]],["cv-skills-list",[[257,"cv-skills-list",{"skills":[16],"bulletColor":[1,"bullet-color"]}]]]], options);
});
//# sourceMappingURL=cv-components.esm.js.map
