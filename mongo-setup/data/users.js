const data = [
    {
        "_id": ObjectId("5d79d0bebf1bce0001eda5e1"),
        "_class": "com.factly.dega.domain.DegaUser",
        "first_name": "Rakesh",
        "last_name": "Dubbudu",
        "display_name": "Rakesh Dubbudu",
        "created_date": ISODate("2019-09-12T04:59:00.000Z"),
        "description": "Rakesh closely watched the 'Jan Satyagraha' in 2012. The courage and conviction of the man who led it inspired him to make 'engagement and confrontation' his core pricinciple. Rakesh is an Open Data evangelist and experienced transparency (RTI) campaigner in India who won the US State Department Fellowship in 2014. Rakesh graduated from National Institute of Technology (NIT), Warangal. He has immense knowledge and experience understanding government policy and data. He is a fearless leader with an empirical world-view. Rakesh is the Editorial Lead and the idea machine at Factly.",
        "slug": "rakesh-dubbudu",
        "email": "rakesh@factly.in",
        "roleMappings": [
            {
                "$ref": "role_mapping",
                "$id": ObjectId("5d792544bf1bce0001eda478")
            }
        ],
        "media": {
            "$ref": "media",
            "$id": ObjectId("5d93ebc177b1b80001d57232")
        }
    },
    {
        "_id": ObjectId("5d93ee9277b1b80001d5724c"),
        "_class": "com.factly.dega.domain.DegaUser",
        "first_name": "Surya",
        "last_name": "Kandukuri",
        "display_name": "Surya Kandukuri",
        "created_date": ISODate("2019-09-11T16:49:00.000Z"),
        "description": "Surya is an IT professional who completed his Business Analytics course from the Indian School of Business (ISB), Hyderabad. He leads our Open Data projects. He works on mining insights and creating data tools from the data in the public domain, and collaborates with the Government of Telangana to make their public data open source. Sometimes, he feels trapped in the rectangular box of excel sheets and sometimes, dances in it. He is very interested in philosophy, languages, poetry, art, photography and music.",
        "slug": "surya-kandukuri",
        "email": "surya@factly.in",
        "roleMappings": [
            {
                "$ref": "role_mapping",
                "$id": ObjectId("5d792544bf1bce0001eda47a")
            }
        ],
        "media": {
            "$ref": "media",
            "$id": ObjectId("5d93eea393ace2000112a96f")
        }
    },
    {   
        "_id" : ObjectId("5da59c877ae10d8fc36d94cb"),
        "_class": "com.factly.dega.domain.DegaUser",
        "first_name": " Naresh",
        "last_name": " Dubbudu",
        "display_name": " Naresh Dubbudu",
        "created_date": ISODate("2019-10-02T00:22:00.000Z"),
        "description": "Naresh Dubbudu is a gold medalist from the National Institute of Technology (NIT), Warangal, is amongst the toppers of IIM Bangalore and has also attended Stanford Business School as an exchange student. He is an alumnus of the world’s most coveted strategic consulting firm, McKinsey & Company. He has immense experience in consulting in multiple industries like Automobiles, Education Banking, Chemicals, and Oil & Petroleum, among others. Naresh is a successful serial entrepreneur in the EdTech and FinTech spaces and is closely associated with Factly in long-term strategic visioning and outreach planning.",
        "slug": "naresh-dubbudu",
        "email": "naresh@factly.in",
        "roleMappings": [
            {
                "$ref": "role_mapping",
                "$id": ObjectId("5d792544bf1bce0001eda479")
            }
        ],
        "media": {
            "$ref": "media",
            "$id": ObjectId("5d93ee3c77b1b80001d57245")
        }    
    },
    {
        "_id": ObjectId("5d792589bf1bce0001eda484"),
        "_class": "com.factly.dega.domain.DegaUser",
        "first_name": "Shashi Kiran",
        "last_name": "Deshetti",
        "display_name": "Shashi Deshetti",
        "created_date": ISODate("2019-10-02T00:25:00.000Z"),
        "description": "Shashi was always intrigued by the public good that technology can do. This is what prompted him to explore various data/information tool ideas. He graduated with a masters in computer science and has extensive experience in software project management. He is the in-house data scientist and guru, who oversees rolling out product prototypes and developing technology infrastructure. The products in development at Factly are open source and can be found at Factly’s Github page. Shashi is the CTO at Factly.",
        "slug": "shashi-deshetti",
        "email": "shashi@factly.in",
        "roleMappings": [
            {
                "$ref": "role_mapping",
                "$id": ObjectId("5d792544bf1bce0001eda478")
            }
        ],
        "media": {
            "$ref" : "media",
            "$id": ObjectId("5d93ebd993ace2000112a94d")
        }
    }
]

print("---loading users data---");
for (var i = 0; i < data.length; i++) {
    db.dega_user.insert(data[i]);
}
