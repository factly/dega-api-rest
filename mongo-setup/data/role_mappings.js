const data = [
    {
        "name": "Factly - Administrator",
        "_id": ObjectId("5d792544bf1bce0001eda478"),
        "_class": "com.factly.dega.domain.RoleMapping",
        "role": {
            "$ref": "role",
            "$id": ObjectId("5d79176abf1bce0001eda459")
            },
        "organization": {
            "$ref": "organization",
            "$id": ObjectId("5d792544bf1bce0001eda477")
        }
    },
    {
        "name": "Factly - Author",
        "_id": ObjectId("5d792544bf1bce0001eda47a"),
        "class": "com.factly.dega.domain.RoleMapping",
        "role": {
            "$ref": "role",
            "$id": ObjectId("5d79177ebf1bce0001eda461")
        },
        "organization": {
            "$ref": "organization",
            "$id": ObjectId("5d792544bf1bce0001eda477")
        }
    },
    {
        "name": "Factly - Editor",
        "_id": ObjectId("5d792544bf1bce0001eda479"),
        "class": "com.factly.dega.domain.RoleMapping",
        "role": {
            "$ref": "role",
            "$id": ObjectId("5d791774bf1bce0001eda45d")
        },
        "organization": {
            "$ref": "organization",
            "$id": ObjectId("5d792544bf1bce0001eda477")
        }
    }
]

print("---loading role mappings data---");
for (var i = 0; i < data.length; i++) {
    db.role_mapping.insert(data[i]);
}
