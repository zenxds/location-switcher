var trim = $.trim;

angular.module("tbtx.directive", []).directive('ngCopy', ['$rootScope',
    function() {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,         设置模板中相对于其他元素上指令的执行顺序
            // terminal: true,
            // scope: {}, // {} = isolate, true = child, false/undefined = no change 为这个指令创建一个新的作用域而不是继承父作用域.
            // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements 需要其他指令服务于这个指令来正确的发挥作用.
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),  以编程的方式修改一个指令的DOM模板的副本特性, 如同使用`ng-repeat`时. 你的编译函数也可以返回链接函数来修改生成元素的实例.
            link: function($scope, element, iAttrs, controller) {
                var clip = new ZeroClipboard(element);
                clip.on('complete', function(client, args) {
                    // this.style.display = 'none'; // "this" is the element that was clicked
                    // alert("Copied text to clipboard: " + args.text);
                    var animateArray = ['swing', 'shake', 'wobble', 'pulse', 'bounceIn'];
                    var m = 0,
                        n = animateArray.length;
                    var seed = Math.floor(Math.random() * (n-m) + m);

                    var name = 'animated ' + animateArray[seed];
                    var $item = $(this);
                    $item.addClass(name);
                    setTimeout(function() {
                        $item.removeClass(name);
                    }, 500);
                });
            }
        };
    }
]);
var app = angular.module('tbtx', ['tbtx.directive']);

function appController($scope) {
    var defaultSpliter = /\s+/;

    var getSpliter = function() {
            return $scope.spliter || defaultSpliter;
        },
        getInput = function() {
            return $scope.input || "";
        },
        getFormater = function() {
            return $scope.formater || "";
        };

    $scope.$watch('input',
        function(to, from) {
            $scope.result = formatData(getInput(), getSpliter(), getFormater(), $scope.filters);
        }
    );
    $scope.$watch('spliter',
        function(to, from) {
            $scope.result = formatData(getInput(), getSpliter(), getFormater(), $scope.filters);
        }
    );
    $scope.$watch('formater',
        function(to, from) {
            $scope.result = formatData(getInput(), getSpliter(), getFormater(), $scope.filters);
        }
    );
    $scope.$watch('filters',
        function(to, from) {
            $scope.result = formatData(getInput(), getSpliter(), getFormater(), to);
        }
    );

    $scope.input = "1 零臃肿抗寒大衣 http://miiee.taobao.com/talent_special_item.htm?uid=900819&sid=135327\n2   恋冬毛衣    http://miiee.taobao.com/talent_special_item.htm?uid=900819&sid=135328";
    $scope.formater = "id title url";
    $scope.filters = "http://miiee.taobao.com";

    $scope.toHtml = function() {
        var template = Handlebars.compile($scope.template);
        var json = JSON.parse($scope.json);
        var html = template(json);
        $scope.html = html;
    };
    $scope.template = $("#template-theme").html();
    var d = [{"id":"1","title":"零臃肿抗寒大衣","url":"http://miiee.taobao.com/talent_special_item.htm?uid=900819&sid=135327"},{"id":"2","title":"恋冬毛衣","url":"http://miiee.taobao.com/talent_special_item.htm?uid=900819&sid=135328"}];
    $scope.json = JSON.stringify(d);

    $scope.$watch("images", function(to, from) {
        var source = to.split("\n"),
            line,
            ret = "";
        for (var i = source.length - 1; i >= 0; i--) {
            line = source[i];
            line = trim(line);
            ret += '<img src="' + line + '" alt="" usemap="">';
        }

        $scope.imageHtml = ret;
    });
}

function formatData(input, spliter, formater, filters) {
    var data = [],
        keys = [],
        ret = [];

    // 生成对象的keys
    formater.split(/\s+/).forEach(function(key) {
        keys.push(trim(key));
    });

    // 过滤空行，个数不正确的行
    input.split("\n").forEach(function(line) {
        line = trim(line);
        if (line) {
            var cols = line.split(spliter);

            if (cols.length == keys.length) {
                data.push(cols);
            }
        }
    });

    data.forEach(function(item, index) {
        var retItem = {};
        item.forEach(function(value, index) {
            retItem[keys[index]] = trim(value);
        });
        ret.push(retItem);
    });

    ret = JSON.stringify(ret);
    filters && filters.split("\n").forEach(function(value, index) {
        value = trim(value);

        ret = ret.replace(new RegExp(value, "g"), "");
    });
    return JSON.parse(ret);

}
