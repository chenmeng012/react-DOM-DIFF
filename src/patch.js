import { Element, render } from "./element";

let AllPatches;
let Index = 0;
function patch(node, patches) {
    AllPatches = patches;
    walk(node);
}

function walk(node) {
    let currentPatch = AllPatches[Index++];
    let childNodes = node.childNodes;
    childNodes.forEach(child => walk(child));
    if(currentPatch && currentPatch.length > 0) {
        doPatch(node, currentPatch);
    }
}

function doPatch(node, patches) {
    patches.forEach(patch => {
        switch (patch.type){
            case 'ATTRS':
                for(let key in patch.attrs) {
                    let value = patch.attrs[key];
                    if (value) {
                        setAttr(node, key, value);
                    }else {
                        node.removeAttribute(key);
                    }
                }
                break;
            case 'TEXT':
                node.textContent = patch.text;
                break;
            case 'REPLACE':
                let newNode = (patch.newNode instanceof Element)? render(patch.newNode)  : document.createTextNode(patch.newNode);
                node.parentNode.replaceChild(newNode, node);
                break;
            case 'REMOVE':
                node.parentNode.removeChild(node);
                break;
            default:
                break;
        }
    })
}

//设置属性
function setAttr(node, key, value) {
    switch (key){
        case 'value':
            if(node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
                node.value = value
            } else {
                node.setAttribute(key, value);
            }
            break;
        case 'style':
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
}
export default patch;