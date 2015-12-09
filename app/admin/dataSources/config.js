
module.exports = function (nga, admin) {

  var dataSource = admin.getEntity('dataSources');
  dataSource.creationView()
    .fields([
      nga.field('layer')
        .validation({required: true }),
      nga.field('path')
        .validation({required: true })
    ]);
  dataSource.editionView()
    .title("Edit {{ ::entry.values.name }}'s details")
    .fields(dataSource.creationView().fields());

  return dataSource;
};
