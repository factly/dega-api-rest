const data = [
    {
        "_id" : ObjectId("5c38f4f5569ed47e00c70045"),
        "name" : "Crude Oil",
        "slug" : "crude-oil",
        "client_id" : "factly",
        "created_date" : ISODate("2019-01-11T19:56:37.736Z"),
        "last_updated_date" : ISODate("2019-01-11T19:56:37.736Z"),
        "_class" : "com.factly.dega.domain.Tag"
    },
    {
        "_id" : ObjectId("5c38f509569ed47e00c7004a"),
        "name" : "Black Money",
        "slug" : "black-money",
        "client_id" : "factly",
        "created_date" : ISODate("2019-01-11T19:56:57.619Z"),
        "last_updated_date" : ISODate("2019-01-11T19:56:57.619Z"),
        "_class" : "com.factly.dega.domain.Tag"
    },
    {
        "_id" : ObjectId("5c38f513569ed47e00c7004f"),
        "name" : "Bad Loans",
        "slug" : "bad-loans",
        "client_id" : "factly",
        "created_date" : ISODate("2019-01-11T19:57:00.000Z"),
        "last_updated_date" : ISODate("2019-01-11T19:58:05.665Z"),
        "_class" : "com.factly.dega.domain.Tag"
    },
    {
        "_id" : ObjectId("5c38f554569ed47e00c70059"),
        "name" : "Child Sex Ratio",
        "slug" : "child-sex-ratio",
        "client_id" : "factly",
        "created_date" : ISODate("2019-01-11T19:58:12.712Z"),
        "last_updated_date" : ISODate("2019-01-11T19:58:12.712Z"),
        "_class" : "com.factly.dega.domain.Tag"
    }
]

print("---loading tags data---");
for (var i = 0; i < data.length; i++) {
    db.tag.insert(data[i]);
}
