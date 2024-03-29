const data = [
    {
        "name": "Factly",
        "description": "FACTLY is one of the well known Data Journalism/Public Information portals in India. Each news story on FACTLY is backed by factual evidence/data from official sources that is either available in the public domain or that is collated/gathered/collected using tools such as the Right to Information (RTI).",
        "slug": "factly",
        "email": "admin@factly.in",
        "_id": ObjectId("5d792544bf1bce0001eda477"),
        "_class": "com.factly.dega.domain.Organization",
        "site_title": "Factly",
        "tag_line": "Making Public Data Meaningful",
        "client_id": "factly",
        "created_date": ISODate("2019-09-11T16:48:00.000Z"),
        "last_updated_date": ISODate("2019-09-26T20:44:36.458Z"),
        "site_address": "https://factcheck.factly.in",
        "mediaLogo" : {
            "$ref" : "media",
            "$id" : ObjectId('5d8f5ce993ace2000112a8c8')
        }
    }
]
print('---Loading organization data---');
for (var i = 0; i < data.length; i++) {
    db.organization.insert(data[i]);
}