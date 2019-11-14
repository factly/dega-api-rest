const data = [
    {
        "name": "True",
        "slug": "true",
        "description": "This is the description fo True rating",
        "media": {
            "$id": ObjectId("5d792f14bf1bce0001eda499"),
            "$ref" : "media"
        },
        "_id": ObjectId("5d791140e10bf00001fad893"),
        "_class": "com.factly.dega.domain.Rating",
        "numeric_value": 5,
        "is_default": true,
        "client_id": "default",
        "created_date": ISODate("2019-09-11T15:22:00.000Z"),
        "last_updated_date": ISODate("2019-09-12T04:38:43.403Z")
    },
    {
        "name": "Partly True",
        "slug": "partly-true",
        "description": "This is the description for Partly True rating",
        "media": {
            "$id": ObjectId("5d794e2fbf1bce0001eda4a7"),
            "$ref" : "media"
        },
        "_id": ObjectId("5d79115fe10bf00001fad896"),
        "_class": "com.factly.dega.domain.Rating",
        "numeric_value": 4,
        "is_default": true,
        "client_id": "default",
        "created_date": ISODate("2019-09-11T15:23:00.000Z"),
        "last_updated_date": ISODate("2019-09-12T04:39:02.438Z")
    },
    {
        "name": "Unverified",
        "slug": "unverified",
        "description": "This is the description for Unverified rating",
        "media": {
            "$id": ObjectId("5d794e3ebf1bce0001eda4ac"),
            "$ref" : "media"
        },
        "_id": ObjectId("5d791178e10bf00001fad899"),
        "_class": "com.factly.dega.domain.Rating",
        "numeric_value": 3,
        "is_default": true,
        "client_id": "default",
        "created_date": ISODate("2019-09-11T15:23:00.000Z"),
        "last_updated_date": ISODate("2019-09-12T04:39:11.432Z")
    },
    {
        "name": "Misleading",
        "slug": "misleading",
        "description": "This is the rating for Misleading rating",
        "media": {
            "$id": ObjectId("5d794e50bf1bce0001eda4b1"),
            "$ref" : "media"
        },
        "_id": ObjectId("5d79118de10bf00001fad89c"),
        "_class": "com.factly.dega.domain.Rating",
        "numeric_value": 2,
        "is_default": true,
        "client_id": "default",
        "created_date": ISODate("2019-09-11T15:23:00.000Z"),
        "last_updated_date": ISODate("2019-09-12T04:39:26.538Z")
    },
    {
        "name": "False",
        "slug": "false",
        "description": "This is the rating for False rating",
        "media": {
            "$id": ObjectId("5d794e95bf1bce0001eda4b6"),
            "$ref" : "media"
        },
        "_id": ObjectId("5d7911a8e10bf00001fad8a0"),
        "_class": "com.factly.dega.domain.Rating",
        "numeric_value": 1,
        "is_default": true,
        "client_id": "default",
        "created_date": ISODate("2019-09-11T15:24:00.000Z"),
        "last_updated_date": ISODate("2019-09-12T04:39:35.362Z")
    }
]

print("---loading ratings data---");
for (var i = 0; i < data.length; i++) {
    db.rating.insert(data[i]);
}