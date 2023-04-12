migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lejbcjwq96qq97t")

  collection.listRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lejbcjwq96qq97t")

  collection.listRule = null

  return dao.saveCollection(collection)
})
