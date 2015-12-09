
module.exports = function (nga, admin) {

  var server = admin.getEntity('servers');
  server.listView()
    .title('Servers')
    .fields([
      nga.field('name', 'string')
        .isDetailLink(true),
      nga.field('host', 'string'),
      nga.field('port', 'number').format('00000'),
      nga.field('username', 'string'),
      nga.field('password', 'password')
    ])
    .sortField('name')
    .sortDir('DESC')
    .listActions(['edit']);
  server.creationView()
    .fields([
      nga.field('name')
        .validation({required: true }),
      nga.field('host')
        .defaultValue('localhost')
        .validation({required: true }),
      nga.field('port', 'number')
        .defaultValue(5432)
        .validation({required: true })
        .format('00000'),
      nga.field('username', 'string'),
      nga.field('password', 'string')
    ]);
  server.editionView()
    .title("Edit {{ ::entry.values.name }}'s details")
    .fields(
      server.creationView().fields(),
      nga.field('', 'template')
        .label('')
        .template('<span class="pull-right"><ma-filtered-list-button entity-name="treebanks" filter="{ serverId: entry.values.id }" size="sm"></ma-filtered-list-button></span>')
    );

  return server;
};
