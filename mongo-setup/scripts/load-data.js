print('Loading ratings data.');
loadSeedData(db.rating, JSON.parse(cat('mongo-setup/data/ratings.json')));

print('Loading roles data.');
loadSeedData(db.role, JSON.parse(cat('mongo-setup/data/roles.json')));

print('Loading statuses data.');
loadSeedData(db.status, JSON.parse(cat('mongo-setup/data/statuses.json')));

print('Loading users data.');
loadSeedData(db.dega_user, JSON.parse(cat('mongo-setup/data/users.json')));

print('Loading media data.');
loadSeedData(db.media, JSON.parse(cat('mongo-setup/data/medias.json')));

print('Loading role mappings data.');
loadSeedData(db.role_mapping, JSON.parse(cat('mongo-setup/data/role_mappings.json')));

print('Loading organization data.');
loadSeedData(db.organization, JSON.parse(cat('mongo-setup/data/organizations.json')));


function loadSeedData(collection, json) {
    for (var i = 0; i < json.length; i++) {
        collection.insert(json[i]);
    }
}
