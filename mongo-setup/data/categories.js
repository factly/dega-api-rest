const data = [
    {
        "_id": ObjectId("5c38f470569ed47e00c7002b"),
        "description" : "Category Politics",
        "name": "Politics",
        "slug": "politics",
        "client_id": "factly",
        "created_date": ISODate("2019-01-11T19:54:17.694Z"),
        "last_updated_date": ISODate("2019-01-11T19:54:17.694Z"),
        "_class": "com.factly.dega.domain.Category"
    },
    {
        "_id": ObjectId("5c38f470569ed47e00c7002c"),
        "description" : "Category Business",
        "name": "Business",
        "slug": "business",
        "client_id": "factly",
        "created_date": ISODate("2019-01-11T19:54:24.264Z"),
        "last_updated_date": ISODate("2019-01-11T19:54:24.264Z"),
        "_class": "com.factly.dega.domain.Category"
    },
    {  
        "_id" : ObjectId("5da707da6ae80e607432d6b6"),
        "name": "Elections",
        "description" : "Category Elections",
        "slug": "elections",
        "client_id": "factly",
        "created_date": ISODate("2019-01-11T19:54:41.722Z"),
        "last_updated_date": ISODate("2019-01-11T19:54:41.722Z"),
        "_class": "com.factly.dega.domain.Category"
    },
    {
        "_id" : ObjectId("5da707da6ae80e607432d6b7"),
        "name": "Crime",
        "description" : "Category crime",
        "slug": "crime",
        "client_id": "factly",
        "created_date": ISODate("2019-01-11T19:54:48.842Z"),
        "last_updated_date": ISODate("2019-01-11T19:54:48.842Z"),
        "_class": "com.factly.dega.domain.Category"
    },
    {
        "_id" : ObjectId("5da707da6ae80e607432d6b8"),
        "name": "Finance",
        "description" : "Category Finance",
        "slug": "finance",
        "client_id": "factly",
        "created_date": ISODate("2019-01-11T19:54:54.697Z"),
        "last_updated_date": ISODate("2019-01-11T19:54:54.697Z"),
        "_class": "com.factly.dega.domain.Category"
    },
    {
        "_id" : ObjectId("5da707da6ae80e607432d6b9"),
        "name": "Sports",
        "description" : "Category sports",
        "slug": "sports",
        "client_id": "factly",
        "created_date": ISODate("2019-01-11T19:55:00.426Z"),
        "last_updated_date": ISODate("2019-01-11T19:55:00.426Z"),
        "_class": "com.factly.dega.domain.Category"
    },
    {
        "name": "India",
        "description": "",
        "slug": "india",
        "parent": "",
        "_id": ObjectId("5d79818bbf1bce0001eda4e2"),
        "_class": "com.factly.dega.domain.Category",
        "client_id": "factly",
        "created_date": ISODate("2019-09-11T23:21:47.651Z"),
        "last_updated_date": ISODate("2019-09-11T23:21:47.651Z")
    },
    {
        "name": "Stories",
        "description": "",
        "slug": "stories",
        "parent": "",
        "_id": ObjectId("5d798196bf1bce0001eda4e6"),
        "_class": "com.factly.dega.domain.Category",
        "client_id": "factly",
        "created_date": ISODate("2019-09-11T23:21:58.886Z"),
        "last_updated_date": ISODate("2019-09-11T23:21:58.886Z")
    }
]
print("---loading categories data---");
for (var i = 0; i < data.length; i++) {
    db.category.insert(data[i]);
}
