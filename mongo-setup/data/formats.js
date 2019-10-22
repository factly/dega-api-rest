const data = [
    {
        "_id" : ObjectId("5ce249139753e795dc53c363"),
        "name": "Audio",
        "is_default": true,
        "client_id": "factly",
        "slug": "audio",
        "created_date": ISODate("2018-12-31T19:40:02.385Z"),
        "last_updated_date": ISODate("2018-12-31T19:40:02.385Z"),
        "_class": "com.factly.dega.domain.Format"
    }, 
    {
        "_id": ObjectId("5d791062e5c62900019d784d"),
        "name": "Video",
        "is_default": true,
        "client_id": "factly",
        "slug": "video",
        "created_date": ISODate("2018-12-31T19:40:14.498Z"),
        "last_updated_date": ISODate("2018-12-31T19:40:14.498Z"),
        "_class": "com.factly.dega.domain.Format"
    }, 
    {
        "_id": ObjectId("5d79106de5c62900019d7851"),
        "name": "Chat",
        "is_default": true,
        "client_id": "factly",
        "slug": "chat",
        "created_date": ISODate("2018-12-31T19:40:35.077Z"),
        "last_updated_date": ISODate("2018-12-31T19:40:35.077Z"),
        "_class": "com.factly.dega.domain.Format"
    }, 
    {
        "_id": ObjectId("5c2a71152308247c7669a60f"),
        "name": "Status",
        "is_default": true,
        "client_id": "factly",
        "slug": "status",
        "created_date": ISODate("2018-12-31T19:40:47.419Z"),
        "last_updated_date": ISODate("2018-12-31T19:40:47.419Z"),
        "_class": "com.factly.dega.domain.Format"
    }
]

print("---loading formats data---");
for (var i = 0; i < data.length; i++) {
    db.format.insert(data[i]);
}

