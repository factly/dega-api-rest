const data = [
    {
        "_id" : ObjectId("5d717fcddf047986a5830098"),
        "title" : "Test Factcheck title",
        "client_id" : "factly",
        "introduction" : "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "summary" : "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "excerpt" : "Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor.",
        "published_date" : ISODate("2019-09-23T12:25:43.689Z"),
        "last_updated_date" : ISODate("2019-09-23T12:25:43.689Z"),
        "featured" : false,
        "sticky" : false,
        "updates" : "",
        "slug" : "factcheck1-tags-crude-oil-black-money-categories-india-stories-users-rakesh-dubbudu",
        "featured_media" : "",
        "sub_title" : "",
        "created_date" : ISODate("2019-09-21T12:25:43.689Z"),
        "claims" : [ 
            {
                "$ref" : "claim",
                "$id" : ObjectId("5d8f5d53f4f39f0001e419ec")
            }
        ],
        "tags" : [
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f4f5569ed47e00c70045")
            },
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f509569ed47e00c7004a")
            }
        ],
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c8")
        },
        "categories" : [ 
            {
                "$ref" : "category",
                "$id" : ObjectId("5d79818bbf1bce0001eda4e2")
            },
            {
                "$ref" : "category",
                "$id" : ObjectId("5d798196bf1bce0001eda4e6")
            }
        ],
        "degaUsers" : [ 
            {
                "$ref" : "dega_user",
                "$id" : ObjectId("5d79d0bebf1bce0001eda5e1")
            }
        ],
        "status" : {
            "$ref" : "status",
            "$id" : ObjectId("5c2691852308247c7669a51a")
        },
        "_class" : "com.factly.dega.domain.Factcheck"
    },
    {
        "_id": ObjectId("5d718b016f5f0b0fc31d64d4"),
        "_class": "com.factly.dega.domain.Factcheck",
        "client_id": "factly",
        "published_date": ISODate("2019-09-23T11:25:43.689Z"),
        "sub_title": "",
        "created_date": ISODate("2019-09-19T11:25:43.689Z"),
        "last_updated_date": ISODate("2019-09-23T11:25:43.689Z"),
        "title": "Test Factcheck title - 2",
        "introduction": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "summary": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "excerpt": "Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor.",
        "featured": false,
        "sticky": false,
        "updates": "",
        "slug": "factcheck2-tags-black-money-categories-india-crime-users-rakesh-dubbudu",
        "claims": [
            {
                "$ref" : "claim",
                "$id" : ObjectId("5c3e3762569ed47d9451942b")
            }
        ],
        "tags": [
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f509569ed47e00c7004a")
            }
        ],
        "categories": [
            {
                "$ref" : "category",
                "$id" : ObjectId("5d79818bbf1bce0001eda4e2")
            },
            {
                "$ref" : "category",
                "$id" : ObjectId("5da707da6ae80e607432d6b7")
            }
        ],
        "status": {
            "$ref" : "status",
            "$id" : ObjectId("5c2691852308247c7669a51a")
        },
        "media": {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c8")
        },
        "degaUsers": [
            {
                "$ref" : "dega_user",
                "$id" : ObjectId("5d79d0bebf1bce0001eda5e1")
            }
        ]
    },
    {
        "_id": ObjectId("5d718fb06f5f0b1816b3249c"),
        "_class": "com.factly.dega.domain.Factcheck",
        "client_id": "factly",
        "published_date": ISODate("2019-09-23T10:25:43.689Z"),
        "sub_title": "",
        "created_date": ISODate("2019-09-22T10:25:43.689Z"),
        "last_updated_date": ISODate("2019-09-23T10:25:43.689Z"),
        "title": "Test Factcheck title - 3",
        "introduction": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "summary": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "excerpt": "Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. ",
        "featured": false,
        "sticky": false,
        "updates": "",
        "slug": "factcheck3-tags-bad-loans-categories-india-users-rakesh-dubbudu",
        "claims": [
            {
                "$ref" : "claim",
                "$id" : ObjectId("5ce2682c682a3b2e077845ba")
            }
        ],
        "tags": [
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f513569ed47e00c7004f")
            }
        ],
        "categories": [
            {
                "$ref" : "category",
                "$id" : ObjectId("5d79818bbf1bce0001eda4e2")
            }
        ],
        "status": {
            "$ref" : "status",
            "$id" : ObjectId("5c2691852308247c7669a51a")
        },
        "degaUsers": [
            {
                "$ref" : "dega_user",
                "$id" : ObjectId("5d79d0bebf1bce0001eda5e1")
            }
        ],
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c8")
        }
    },
    {
        "_id": ObjectId("5d718fb06f5f0b1816b32483"),
        "_class": "com.factly.dega.domain.Factcheck",
        "client_id": "factly",
        "published_date": ISODate("2019-09-23T09:25:43.689Z"),
        "sub_title": "",
        "created_date": ISODate("2019-09-17T09:25:43.689Z"),
        "last_updated_date": ISODate("2019-09-23T09:25:43.689Z"),
        "title": "Test Factcheck title - 4",
        "introduction": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "summary": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "excerpt": "Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. ",
        "featured": false,
        "sticky": false,
        "updates": "",
        "slug": "factcheck4-tags-Bad-Loans-categories-elections-business-users-surya-kandukuri-naresh-dubbudu",
        "claims": [ 
            {
                "$ref" : "claim",
                "$id" : ObjectId("5d8f5d53f4f39f0001e419ec")
            }
        ],
        "tags": [
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f513569ed47e00c7004f")
            }
        ],
        "categories": [
            {
                "$ref" : "category",
                "$id" : ObjectId("5da707da6ae80e607432d6b6")
            },
            {
                "$ref" : "category",
                "$id" : ObjectId("5c38f470569ed47e00c7002c")
            }
        ],
        "status" : {
            "$ref" : "status",
            "$id" : ObjectId("5c2691852308247c7669a51a")
        },
        "degaUsers" : [ 
            {
                "$ref" : "dega_user",
                "$id" : ObjectId("5d93ee9277b1b80001d5724c")
            },
            {
                "$ref" : "dega_user",
                "$id" : ObjectId("5da59c877ae10d8fc36d94cb")
            }
        ],
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c8")
        }
    },
    {
        "title": "Test Factcheck title - 5",
        "_id": ObjectId("5d7190516f5f0b1816b3249f"),
        "_class": "com.factly.dega.domain.Factcheck",
        "client_id": "factly",
        "published_date": ISODate("2019-09-23T08:25:43.689Z"),
        "sub_title": "",
        "created_date": ISODate("2019-08-23T08:25:43.689Z"),
        "last_updated_date": ISODate("2019-09-23T08:25:43.689Z"),
        "introduction": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "summary": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "excerpt": "Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor.",
        "featured": false,
        "sticky": false,
        "updates": "",
        "slug": "factcheck5-tags-child-sex-ratio-categories-politics-users-shashi-deshetti",
        "claims": [ 
            {
                "$ref" : "claim",
                "$id" : ObjectId("5d8f5d53f4f39f0001e419ec")
            }
        ],
        "tags": [
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f554569ed47e00c70059")
            }
        ],
        "categories": [
            {
                "$ref" : "category",
                "$id" : ObjectId("5c38f470569ed47e00c7002b")
            }
        ],
        "status" : {
            "$ref" : "status",
            "$id" : ObjectId("5c2691852308247c7669a51a")
        },
        "degaUsers" : [ 
            {
                "$ref" : "dega_user",
                "$id" : ObjectId("5d792589bf1bce0001eda484")
            }
        ],
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c8")
        }
    },
    {
        "title": "Test Factcheck title - 6",
        "_id": ObjectId("5d71c8cb6f5f0b23ba2870c0"),
        "_class": "com.factly.dega.domain.Factcheck",
        "client_id": "factly",
        "published_date": ISODate("2019-09-23T07:25:43.689Z"),
        "sub_title": "",
        "created_date": ISODate("2019-09-21T08:25:43.689Z"),
        "last_updated_date": ISODate("2019-09-23T08:25:43.689Z"),
        "introduction": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "summary": "<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>",
        "excerpt": "Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. ",
        "featured": false,
        "sticky": false,
        "updates": "",
        "slug": "factcheck6-tags-child-sex-ratio-crude-oil-categories-sports-finance-users-shashi-deshetti",
        "claims": [ 
            {
                "$ref" : "claim",
                "$id" : ObjectId("5d8f5d53f4f39f0001e419ec")
            }
        ],
        "tags": [
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f554569ed47e00c70059")
            },
            {
                "$ref" : "tag",
                "$id" : ObjectId("5c38f4f5569ed47e00c70045")
            }
        ],
        "categories": [
            {
                "$ref" : "category",
                "$id" : ObjectId("5da707da6ae80e607432d6b9")
            },
            {
                "$ref" : "category",
                "$id" : ObjectId("5da707da6ae80e607432d6b8")
            }
        ],
        "status" : {
            "$ref" : "status",
            "$id" : ObjectId("5c2691852308247c7669a51a")
        },
        "degaUsers" : [ 
            {
                "$ref" : "dega_user",
                "$id" : ObjectId("5d792589bf1bce0001eda484")
            }
        ],
        "media" : {
            "$ref" : "media",
            "$id" : ObjectId("5d8f5ce993ace2000112a8c8")
        }
    }
]

print("---loading factchecks data---");
for (var i = 0; i < data.length; i++) {
    db.factcheck.insert(data[i]);
}
