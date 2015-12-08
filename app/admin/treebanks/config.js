
module.exports = function (nga, admin) {

  var treebank = admin.getEntity('treebanks');
  var serverField = nga.field('serverId', 'reference')
    .label('Server')
    .targetEntity(admin.getEntity('servers'))
    .targetField(nga.field('name'))
    .validation({required: true});
  treebank.listView()
    .title('Treebanks')
    .fields([
      nga.field('title', 'string').isDetailLink(true),
      serverField,
      nga.field('homepage', 'template')
        .template(`<a ng-href="{{::entry.values[field.name()]}}">{{::entry.values[field.name()] | hostname}}</a>`),
      nga.field('isPublic', 'boolean')
        .label('Public'),
      nga.field('isFree', 'boolean')
        .label('Free'),
      nga.field('isFeatured', 'boolean')
        .label('Featured')
    ])
    .filters([
      serverField,
      nga.field('isPublic', 'boolean')
        .label('Public'),
      nga.field('isFree', 'boolean')
        .label('Free'),
      nga.field('isFeatured', 'boolean')
        .label('Featured')
    ])
    .sortField('title')
    .sortDir('ASC')
    .listActions(['edit']);
  treebank.creationView()
    .fields([
      serverField,
      nga.field('database')
        .validation({required: true}),
      nga.field('name')
        .validation({required: true}),
      nga.field('title')
        .validation({required: true}),
      nga.field('homepage'),
      nga.field('isPublic', 'boolean')
        .validation({required: true})
        .label('Public'),
      nga.field('isFree', 'boolean')
        .validation({required: true})
        .label('Free'),
      nga.field('isFeatured', 'boolean')
        .validation({required: true})
        .label('Featured'),
      nga.field('description', 'wysiwyg'),
      nga.field('dataSources', 'json'),
      nga.field('manuals', 'json'),
      nga.field('tags', 'reference_many')
        .label('Tags')
        .isDetailLink(true)
        .map(tags => { return tags.map(tag => tag.id); })
        .remoteComplete(true, {
          refreshDelay: 100,
          searchQuery: (input) => { return {name: {ilike: input + '%'}}; }
        })
        .targetEntity(admin.getEntity('tags')) // Targeted entity
        .targetField(nga.field('name')),
      nga.field('languages', 'reference_many')
        .label('Languages')
        .isDetailLink(true)
        .map(languages => { return languages.map(lang => lang.id); })
        .remoteComplete(true, {
          refreshDelay: 100,
          searchQuery: (input) => { return {name: {ilike: input + '%'}}; }
        })
        .targetEntity(admin.getEntity('languages')) // Targeted entity
        .targetField(nga.field('name'))
    ]);
  treebank.editionView()
    .title('Edit {{ ::entry.values.title }}')
    .fields(treebank.creationView().fields());

  return treebank;
};
