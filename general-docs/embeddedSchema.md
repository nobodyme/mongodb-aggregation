## [Embedded / nested documents](https://docs.mongodb.com/manual/tutorial/query-embedded-documents/)

Eg doc,
```
{ item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" }
```

### Query full nested Document

 - order must not change
 - eg, db.inventory.find( { size: { h: 14, w: 21, uom: "cm" } } ), where size is a nested document, h, w, uom order should be preserved

### Query partial nested Document

- double quotes in added to the embedded doc
- db.inventory.find( { "size.uom": "in" } ) or 
- db.inventory.find( { "size.h": { $lt: 15 } } ) can be done

## [Query Arrays](https://docs.mongodb.com/manual/tutorial/query-arrays/)

 Eg doc,
 ```
 { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] }
 ```

### Query full array in exact way

 - db.inventory.find( { tags: ["red", "blank"] } )
 - order must be preserved

### When order need not be preserved

- db.inventory.find( { tags: { $all: ["red", "blank"] }} )

### Query an array for an element

- db.inventory.find( { tags: "red" } )

### Query an array that satisfies either of the conditions
 - db.inventory.find( { dim_cm: { $gt: 15, $lt: 20 } } )

### Query an array that satisfies all

 - db.inventory.find( { dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } } )

### Query based on size of the array
- db.inventory.find( { "tags": { $size: 3 } } )


## [Query Arrays of embedded docs](https://docs.mongodb.com/manual/tutorial/query-array-of-documents/)

Eg doc,
```
{ item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] }
```

### Exact match

 - db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )
 - Dont forget the double quotes
  
### Query a field - similar to querying a nested doc
 - db.inventory.find( { 'instock.qty': { $lte: 20 } } )

### Query that satisfies all
- db.inventory.find( { "instock": { $elemMatch: { qty: 5, warehouse: "A" } } } )