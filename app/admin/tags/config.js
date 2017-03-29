module.exports = function (nga, admin) {

  var tags = admin.getEntity('tags');
  tags.listView()
    .title('Tags')
    .fields([
      nga.field('name').isDetailLink(true),
      nga.field('comment')
    ])
    .listActions(['edit']);

  tags.creationView()
    .fields([
      nga.field('name').validation({required: true }),
      nga.field('comment', 'text'),
      nga.field('documentation', 'text')
    ]);

  tags.editionView()
    .title("Edit {{ ::entry.values.name }}'s details")
    .fields(tags.creationView().fields());

  return tags;
};
