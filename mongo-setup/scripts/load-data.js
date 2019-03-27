
print('Loading categories data.');
loadSeedData(db.category, JSON.parse(cat('mongo-setup/data/categories.json')));

print('Loading claimants data.');
loadSeedData(db.claimant, JSON.parse(cat('mongo-setup/data/claimants.json')));

print('Loading claims data.');
loadSeedData(db.claim, JSON.parse(cat('mongo-setup/data/claims.json')));

print('Loading factchecks data.');
loadSeedData(db.factcheck, JSON.parse(cat('mongo-setup/data/factchecks.json')));

print('Loading formats data.');
loadSeedData(db.format, JSON.parse(cat('mongo-setup/data/formats.json')));

print('Loading organizations data.');
loadSeedData(db.organization, JSON.parse(cat('mongo-setup/data/organizations.json')));

print('Loading posts data.');
loadSeedData(db.post, JSON.parse(cat('mongo-setup/data/posts.json')));

print('Loading ratings data.');
loadSeedData(db.rating, JSON.parse(cat('mongo-setup/data/ratings.json')));

print('Loading roles data.');
loadSeedData(db.role, JSON.parse(cat('mongo-setup/data/roles.json')));

print('Loading statuses data.');
loadSeedData(db.status, JSON.parse(cat('mongo-setup/data/statuses.json')));

print('Loading tags data.');
loadSeedData(db.tag, JSON.parse(cat('mongo-setup/data/tags.json')));

print('Loading users data.');
loadSeedData(db.dega_user, JSON.parse(cat('mongo-setup/data/users.json')));


function loadSeedData(collection, json) {
    for (var i = 0; i < json.length; i++) {
        collection.insert(json[i]);
    }
}
