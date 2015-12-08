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
      nga.field('provider', 'choice')
        .choices([
          { value: 'local', label: 'Local account' },
          { value: 'Shibboleth', label: 'Shibboleth' }
        ])
        .validation({required: true }),
      nga.field('isAdmin', 'boolean'),
      nga.field('isActive', 'boolean'),
      nga.field('accessAll', 'boolean')
    ])
    .sortField('name')
    .sortDir('ASC')
    .listActions(['edit']);

  users.creationView()
    .fields([
      nga.field('name').validation({required: true }),
      nga.field('username').validation({required: true }),
      nga.field('email', 'email'),
      nga.field('password', 'password').validation({required: true }),
      nga.field('accessAll', 'boolean')
        .defaultValue(true)
        .validation({required: true }),
      nga.field('isAdmin', 'boolean')
        .defaultValue(false)
        .validation({required: true }),
      nga.field('isActive', 'boolean')
        .defaultValue(true)
        .validation({required: true })
    ]);

  users.editionView()
    .title("Edit {{ ::entry.values.name }}'s details")
    .fields([
      nga.field('name').validation({required: true }),
      nga.field('username').validation({required: true }),
      nga.field('email', 'email'),
      nga.field('password', 'password'),
      nga.field('accessAll', 'boolean')
        .defaultValue(true)
        .validation({required: true }),
      nga.field('isAdmin', 'boolean')
        .defaultValue(false)
        .validation({required: true }),
      nga.field('isActive', 'boolean')
        .defaultValue(true)
        .validation({required: true })
    ]);

  return users;
}
