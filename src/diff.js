
const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
let Index = 0;

function diff(oldTree, newTree) {
    let patches = {};
    walk(oldTree, newTree, Index, patches);
    return patches;
}


function walk(oldNode, newNode, index, patches) {//index必需传  index被私有化到walk作用域内
    let currentPatch = [];
    if(!newNode) {//如果删除了元素
        currentPatch.push({type: REMOVE, index})
    }else if(isString(oldNode) && isString(newNode)) {//如果两个都是文本
        if(oldNode !== newNode) {//如果文本不相同
            currentPatch.push({type: TEXT, text: newNode})
        }
    }else if(oldNode.type === newNode.type) {//如果新老元素类型相同
        //比较属性是否有变化
        let attrs = diffAttr(oldNode.props, newNode.props);
        if(Object.keys(attrs).length > 0) {
            currentPatch.push({type: ATTRS, attrs})
        }
        //如果存在子节点  需要继续深度比较
        diffChildren(oldNode.children, newNode.children, index, patches);
    } else {//节点被替换了
        currentPatch.push({type: REPLACE, newNode})
    }
    if(currentPatch.length > 0) {//当前元素存在补丁（元素变化）
        //将元素和补丁包对应起来   放到大补丁包中
        patches[index] = currentPatch;
    }
}

function diffChildren(oldChildren, newChildren, index, patches) {
    oldChildren.forEach((child, idx) => {
        walk(child, newChildren[idx], ++Index, patches)
    })
}

function isString(node) {
    return Object.prototype.toString.call(node) === '[object String]';
}

function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    //判断新老节点属性变化
    for(let key in oldAttrs) {
        if(oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key];
        }
    }
    for(let key in newAttrs) {//新节点新增属性
        if(oldAttrs[key].hasOwnProperty(key)) {
            patch[key] = newAttrs[key];
        }
    }
    return patch;
}

export default diff;


/*
* 规则：
* 1.当节点类型相同属性不同 {type:'ATTRS',attrs:{class:'list-group'}}
* 2.新的dom节点不存在{type:'REMOVE',newNode: newNode}
* 3.节点类型不相同  直接采用替换模式{type:'REPLACE', newNode:newNode}
* 4.文本发生变化{type: 'TEXT, text: 1}
* */


/*
* 存在的问题
* 1.新增节点情况并没有考虑
* 2.平级节点调换位置会导致两个节点全都重绘
* */