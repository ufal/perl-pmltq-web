var _ = require('lodash');

module.exports = function($timeout) {
  'ngInject';

  function buildMenuItems(items) {
    var menuItems = [];
    if (!_.isArray(items)) {
      _.forEach(_.sortBy(_.keys(items)), function(label) {
        menuItems.push({
          label: label,
          items: buildMenuItems(items[label])
        });
      });
    } else {
      menuItems = _.sortBy(items);
    }

    return menuItems;
  }

  function buildRelations(relations) {
    var items = [{
      label: 'Standard',
      items: buildMenuItems(relations.standard)
    }];

    if (relations.user && !_.isEmpty(relations.pml)) {
      items.push({
        label: 'PML',
        items: buildMenuItems(relations.pml)
      });
    }

    if (relations.user && !_.isEmpty(relations.user)) {
      items.push({
        label: 'Other',
        items: buildMenuItems(relations.user)
      });
    }

    return items;
  }

  function buildNodeTypes(nodeTypes) {
    var items = [];
    _.forEach(_.sortBy(_.keys(nodeTypes)), function(layer) {
      items.push({
        header: layer
      });
      items.push(buildMenuItems(nodeTypes[layer]));
    });

    return _.flatten(items);
  }

  function buildAttributes(attributes) {
    var items = [];
    _.forEach(_.sortBy(_.keys(attributes)), function(nodeType) {
      items.push({
        label: 'of ' + nodeType,
        items: buildMenuItems(attributes[nodeType])
      });
    });

    return items;
  }

  return {
    restrict: 'E',
    replace: true,
    scope: {
      treebank: '=',
      onCollapse: '&',
      onInsert: '='
    },
    require: '^?queryForm',
    template: require('./queryMenu.jade'),
    link: function($scope, $element, $attrs, queryForm) {
      var menuItems = $scope.menuItems = {};

      $scope.dropdownOpts = {
        action: 'activate',
        onChange: function (value, text, $selected) {
          $timeout(function() {
            $selected.removeClass('active selected');
          });
          if (queryForm) {
            queryForm.insertToEditor(value)
          }
        }
      };

      $scope.$watch('treebank', function (treebank) {
        if (!treebank) {
          return;
        }

        menuItems.relations = buildRelations(treebank.relations);

        menuItems.nodeTypes = buildNodeTypes(treebank.nodeTypes);

        menuItems.attributes = buildAttributes(treebank.attributes);
      });
    }
  };
};
