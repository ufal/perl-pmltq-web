require('../../treebank/directives/languageIcon.less');

module.exports = function (nga, admin) {

  var languages = admin.getEntity('languages');
  var languageGroupField = nga.field('languageGroupId', 'reference')
    .label('Language Group')
    .targetEntity(admin.getEntity('language-groups'))
    .targetField(nga.field('name'))
    .validation({required: true});
  languages.listView()
    .title('Languages')
    .fields([
      nga.field('', 'template')
        .label('')
        .template('<i class="lang" ng-class="::entry.values.code"></i>'),
      nga.field('name', 'string')
        .isDetailLink(true),
      nga.field('code', 'string'),
      languageGroupField
    ])
    .sortField('position')
    .sortDir('ASC')
    .filters([
      nga.field('q')
        .label('Search')
        .pinned(true),
      languageGroupField
    ])
    .listActions(['edit']);
  languages.creationView()
    .fields([
      languageGroupField,
      nga.field('name')
        .validation({required: true}),
      nga.field('code')
        .validation({required: true}),
      nga.field('', 'template')
        .label('Image')
        .template('<i class="lang" ng-class="entry.values.code"></i>')
    ]);
  languages.editionView()
    .title("Edit {{ ::entry.values.name }}'s details")
    .fields(languages.creationView().fields());

  return languages;
};
