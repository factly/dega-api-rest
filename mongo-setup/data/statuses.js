const data = [
    {
        "_id": ObjectId("5c2691852308247c7669a51a"),
        "name": "Publish",
        "client_id": "factly",
        "is_default": true,
        "slug": "publish",
        "created_date": ISODate("2018-12-28T21:11:33.769Z"),
        "last_updated_date": ISODate("2018-12-28T21:11:33.769Z"),
        "_class": "com.factly.dega.domain.Status"
    }, 
    {
        "_id" : ObjectId("5da58458fa8d86546411ae9e"),
        "name": "Future",
        "client_id": "factly",
        "is_default": true,
        "slug": "future",
        "created_date": ISODate("2018-12-28T21:11:47.525Z"),
        "last_updated_date": ISODate("2018-12-28T21:11:47.525Z"),
        "_class": "com.factly.dega.domain.Status"
    }, {
        "_id": ObjectId("5c2691a12308247c7669a523"),
        "name": "Draft",
        "client_id": "factly",
        "is_default": true,
        "slug": "draft",
        "created_date": ISODate("2018-12-28T21:12:01.851Z"),
        "last_updated_date": ISODate("2018-12-28T21:12:01.851Z"),
        "_class": "com.factly.dega.domain.Status"
    }, 
    {
        "_id": ObjectId("5da58458fa8d86546411ae9f"),
        "name": "Pending",
        "client_id": "factly",
        "is_default": true,
        "slug": "pending",
        "created_date": ISODate("2018-12-28T21:12:15.044Z"),
        "last_updated_date": ISODate("2018-12-28T21:12:15.044Z"),
        "_class": "com.factly.dega.domain.Status"
    }, 
    {
        "_id" : ObjectId("5da58458fa8d86546411aea0"),
        "name": "Private",
        "client_id": "factly",
        "is_default": true,
        "slug": "private",
        "created_date": ISODate("2018-12-28T21:12:29.498Z"),
        "last_updated_date": ISODate("2018-12-28T21:12:29.498Z"),
        "_class": "com.factly.dega.domain.Status"
    }, 
    {
        "_id" : ObjectId("5da58458fa8d86546411aea1"),
        "name": "Trash",
        "client_id": "factly",
        "is_default": true,
        "slug": "trash",
        "created_date": ISODate("2018-12-28T21:12:00.000Z"),
        "last_updated_date": ISODate("2019-03-13T11:05:29.305Z"),
        "_class": "com.factly.dega.domain.Status"
    }, 
    {
        "_id" : ObjectId("5da58458fa8d86546411aea2"),
        "name": "Auto Draft",
        "client_id": "factly",
        "is_default": true,
        "slug": "auto-draft",
        "created_date": ISODate("2018-12-28T21:12:00.000Z"),
        "last_updated_date": ISODate("2018-12-28T21:21:32.821Z"),
        "_class": "com.factly.dega.domain.Status"
    }
]

print("---loading statuses data---");
for (var i = 0; i < data.length; i++) {
    db.status.insert(data[i]);
}