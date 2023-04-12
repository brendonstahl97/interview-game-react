migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vkn43cujraye8si")

  collection.listRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vkn43cujraye8si")

  collection.listRule = null

  return dao.saveCollection(collection)
})
