export default function (nga, admin) {

  var users = admin.getEntity('users');
  users.listView()
    .title('Users')
    .fields([
      nga.field('name').isDetailLink(true),
      nga.field('provider'),
      nga.field('isAdmin', 'boolean'),
      nga.field('isActive', 'boolean'),
      nga.field('accessAll', 'boolean')
    ])
    .filters([
      nga.field('q')
        .label('Search')
        .pinned(true),
      nga.field('provider', 'choice')
        .choices([
          {value: 'local', label: 'Local account'},
          {value: 'Shibboleth', label: 'Shibboleth'}
        ])
        .validation({required: true}),
      nga.field('isAdmin', 'boolean'),
      nga.field('isActive', 'boolean'),
      nga.field('accessAll', 'boolean')
    ])
    .sortField('name')
    .sortDir('ASC')
    .listActions(['edit']);

  users.creationView()
    .fields([
      nga.field('name').validation({required: true}),
      nga.field('username').validation({required: true}),
      nga.field('email', 'email'),
      nga.field('password', 'password').validation({required: true}),
      nga.field('accessAll', 'boolean')
        .defaultValue(true)
        .validation({required: true}),
      nga.field('isAdmin', 'boolean')
        .defaultValue(false)
        .validation({required: true}),
      nga.field('isActive', 'boolean')
        .defaultValue(true)
        .validation({required: true})
    ]);

  users.editionView()
    .title("Edit {{ ::entry.values.name }}'s details")
    .fields([
      nga.field('name').validation({required: true}),
      nga.field('username').validation({required: true}),
      nga.field('email', 'email'),
      nga.field('password', 'password'),
      nga.field('accessAll', 'boolean')
        .defaultValue(true)
        .validation({required: true}),
      nga.field('isAdmin', 'boolean')
        .defaultValue(false)
        .validation({required: true}),
      nga.field('isActive', 'boolean')
        .defaultValue(true)
        .validation({required: true}),
      nga.field('treebanks', 'reference_many')
        .label('Treebanks')
        .isDetailLink(true)
        .map(treebanks => { return treebanks.map(treebank => treebank.id); })
        .remoteComplete(true, {
          refreshDelay: 100,
          searchQuery: (input) => { return {name: {ilike: input + '%'}}; }
        })
        .targetEntity(admin.getEntity('treebanks')) // Targeted entity
        .targetField(nga.field('name')),
      nga.field('tags', 'reference_many')
        .label('Treebanks with tags')
        .isDetailLink(true)
        .map(tags => { return tags.map(tag => tag.id); })
        .remoteComplete(true, {
          refreshDelay: 100,
          searchQuery: (input) => { return {name: {ilike: input + '%'}}; }
        })
        .targetEntity(admin.getEntity('tags')) // Targeted entity
        .targetField(nga.field('name'))
    ]);

  return users;
}
