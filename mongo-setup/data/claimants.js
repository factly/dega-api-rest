const data = [
    {    
        "_id" : ObjectId("5c3e3517569ed47d9451940f"),
        "name": "Government of India",
        "description": "This is the description for Govt of India",
        "client_id": "factly",
        "slug": "government-of-india",
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c6")
        },
        "created_date": ISODate("2019-01-15T19:31:35.627Z"),
        "last_updated_date": ISODate("2019-01-15T19:31:35.627Z"),
        "_class": "com.factly.dega.domain.Claimant"
    },
    {
        "_id": ObjectId("4d3e3517545ed47d9451944f"),
        "name": "Narendra Modi",
        "tag_line": "Prime Minister of India",
        "description": "Narendra Modi is the Prime Minister of India",
        "client_id": "factly",
        "slug": "narendra-modi",
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c8")
        },
        "created_date": ISODate("2019-01-15T19:32:05.664Z"),
        "last_updated_date": ISODate("2019-01-15T19:32:05.664Z"),
        "_class": "com.factly.dega.domain.Claimant"
    },
    {
        "_id": ObjectId("5d8f5c68f4f39f0001e419e9"),
        "name": "Rahul Gandhi",
        "tag_line": "President of Indian National Congress",
        "description": "Rahul Gandhi is the President of Indian National Congress",
        "client_id": "factly",
        "slug": "rahul-gandhi-12345",
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8d8")
        },
        "created_date": ISODate("2019-01-15T19:34:52.423Z"),
        "last_updated_date": ISODate("2019-01-15T19:34:52.423Z"),
        "_class": "com.factly.dega.domain.Claimant"
    }
]

print("---loading claimants data---");
for (var i = 0; i < data.length; i++) {
    db.claimant.insert(data[i]);
}
