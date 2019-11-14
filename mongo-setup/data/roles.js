const data =[
    {
        "name": "Subscriber",
        "slug": "subscriber",
        "_id":  ObjectId("5d791792bf1bce0001eda469"),
        "_class": "com.factly.dega.domain.Role",
        "is_default": true,
        "client_id": "default",
        "keycloak_id": "a2fc805b-ef02-41c5-a45a-c9e9081857d4",
        "keycloak_name": "ROLE_SUBSCRIBER",
        "created_date": ISODate("2019-09-11T15:49:38.555Z"),
        "last_updated_date": ISODate("2019-09-11T15:49:38.555Z")
    },
    {
        "name": "Contributor",
        "slug": "contributor",
        "_id":  ObjectId("5d791789bf1bce0001eda465"),
        "_class": "com.factly.dega.domain.Role",
        "is_default": true,
        "client_id": "default",
        "keycloak_id": "7f630e9f-326f-4d62-a8e6-eecb9e540739",
        "keycloak_name": "ROLE_CONTRIBUTOR",
        "created_date": ISODate("2019-09-11T15:49:29.116Z"),
        "last_updated_date": ISODate("2019-09-11T15:49:29.116Z")
    },
    {
        "name": "Author",
        "slug": "author",
        "_id":  ObjectId("5d79177ebf1bce0001eda461"),
        "_class": "com.factly.dega.domain.Role",
        "is_default": true,
        "client_id": "default",
        "keycloak_id": "05c8b040-efa2-43ce-8848-ed9ee6df1428",
        "keycloak_name": "ROLE_AUTHOR",
        "created_date": ISODate("2019-09-11T15:49:18.682Z"),
        "last_updated_date": ISODate("2019-09-11T15:49:18.682Z")
    },
    {
        "name": "Editor",
        "slug": "editor",
        "_id":  ObjectId("5d791774bf1bce0001eda45d"),
        "_class": "com.factly.dega.domain.Role",
        "is_default": true,
        "client_id": "default",
        "keycloak_id": "0cc318fb-d290-4438-a240-3dba1757c914",
        "keycloak_name": "ROLE_EDITOR",
        "created_date": ISODate("2019-09-11T15:49:08.547Z"),
        "last_updated_date": ISODate("2019-09-11T15:49:08.547Z")
    },
    {
        "name": "Administrator",
        "slug": "administrator",
        "_id":  ObjectId("5d79176abf1bce0001eda459"),
        "_class": "com.factly.dega.domain.Role",
        "is_default": true,
        "client_id": "default",
        "keycloak_id": "575baf3c-c82b-4176-b6a3-bb3dc1f365e2",
        "keycloak_name": "ROLE_ADMINISTRATOR",
        "created_date": ISODate("2019-09-11T15:48:58.312Z"),
        "last_updated_date": ISODate("2019-09-11T15:48:58.312Z")
    },
    {
        "name": "Super Admin",
        "slug": "super-admin",
        "_id":  ObjectId("5d791760bf1bce0001eda455"),
        "_class": "com.factly.dega.domain.Role",
        "is_default": true,
        "client_id": "default",
        "keycloak_id": "f5563992-526b-4acf-840a-10dedc1936f3",
        "keycloak_name": "ROLE_SUPER_ADMIN",
        "created_date": ISODate("2019-09-11T15:48:48.242Z"),
        "last_updated_date": ISODate("2019-09-11T15:48:48.242Z")
    }
]

print("---loading roles data---");
for (var i = 0; i < data.length; i++) {
    db.role.insert(data[i]);
}
