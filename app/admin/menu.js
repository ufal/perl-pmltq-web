module.exports = function (nga, admin) {
  return nga.menu()
    .addChild(nga.menu(admin.getEntity('servers')).icon('<span class="fa fa-server fa-fw"></span>'))
    .addChild(nga.menu(admin.getEntity('treebanks')).icon('<span class="fa fa-tree fa-fw"></span>'))
    .addChild(nga.menu(admin.getEntity('languages')).icon('<span class="fa fa-language fa-fw"></span>'))
    .addChild(nga.menu(admin.getEntity('tags')).icon('<span class="fa fa-tags fa-fw"></span>'))
    .addChild(nga.menu(admin.getEntity('users')).icon('<span class="fa fa-users fa-fw"></span>'));
};
