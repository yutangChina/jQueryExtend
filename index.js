/**
 * 单页面应用框架-路由跳转
 */
/**
 使用：
 var route = [{
            path: "index",
            children: [{
                path: "blog",
                //初始化方法
                init: function () {
                    console.log("blog");
                }
            }, {
                path: "write",
                children: [{
                    path: "article",
                    init: function () {
                        console.log("article");
                    }
                }]
            }]
        }, {
            path: "home",
            init: function () {
                console.log("home");

            }
        }];

var r = new CatRoute(route);
 r.goto("/index/blog", false);
 */

function CatRoute(route) {
    CatRoute.hideAllRoutes(route);
    this.routeData = route;
}

CatRoute.hideAllRoutes = function (path) {
    for (let i = 0; i < path.length; i++) {
        if (path[i].children && path[i].children.length > 0) {
            CatRoute.hideAllRoutes(path[i].children);
        }
        document.querySelector("#" + path[i]["path"]).style.display = "none";
    }
}

CatRoute.showTarget = function (obj, autoInit, args) {
    if (obj.children && obj.children.length > 0) {
        CatRoute.showTarget(obj.children[0], autoInit, args);
        //父层级也应该展示
        document.querySelector("#" + obj["path"]).style.display = "";
    } else {
        let _ele = document.querySelector("#" + obj["path"]);
        _ele.style.display = "block";
        if (autoInit && obj.init) {
            obj.init.call(_ele, args);
        }
    }
}
CatRoute.findRouteObj = function (arr, pathName) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]["path"] == pathName) {
            return arr[i];
        }
    }
    return null;
}
/**
 * 
 * @param {*} path 路径
 * @param {*} autoInit 是否自动init
 * @param {*} args 参数
 */
CatRoute.prototype.goto = function (path, autoInit, args) {
    CatRoute.hideAllRoutes(this.routeData);
    //默认首页
    if (path === "/" || path === "" || path === undefined) {
        CatRoute.showTarget(this.routeData[0], autoInit, args);
        return true;
    }
    let _p = path.split("/");
    let _o = {};
    _o["children"] = this.routeData;
    for (let i = 0; i < _p.length; i++) {
        if (_p[i] === "") continue;
        let _result = CatRoute.findRouteObj(_o["children"], _p[i]);
        if (_result === null) {
            return false;
        };
        document.querySelector("#" + _result["path"]).style.display = "block";
        _o = _result;
    }
    CatRoute.showTarget(_o, autoInit, args);
    return true;
}