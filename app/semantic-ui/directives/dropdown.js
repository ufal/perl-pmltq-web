var _ = require('lodash');
var $ = require('jquery');

function menuItem(label, subMenu) {
  var item = $('<div class="item"></div>');
  if (subMenu) {
    item.append($('<i class="dropdown icon"></i>'))
      .append($('<span class="text"></span>').text(label))
      .append(subMenu);
  } else {
    item.text(label);
  }

  return item;
}

function processTree(tree, accElement) {
  _.forEach(tree, function (item) {
    if (item.items) {
      var subMenu = $('<div class="menu"></div>');
      processTree(item.items, subMenu);
      menuItem(item.label, subMenu).appendTo(accElement);
    } else if (item.header) {
      accElement.append($('<div class="header"></div>').text(item.header));
    } else {
      menuItem(item).appendTo(accElement);
    }
  });
}

module.exports = function () {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      var opts = {},
        label = $attrs.dropdownLabel;
      $scope.$watch($attrs.dropdownTree, function (tree) {
        if (_.isEmpty(tree)) {
          return;
        }

        $element.empty();
        $element.append(label);
        $element.append($('<i class="dropdown icon"></i>'));

        var menu = $('<div class="menu"></div>').appendTo($element);
        processTree(tree, menu);

        $element.dropdown(opts);
      });

      $scope.$watch($attrs.uiDropdown, function (newOpts) {
        opts = newOpts || {};
        $element.dropdown(opts);
      });
    }
  }
};
