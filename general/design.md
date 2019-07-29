## [Embedded vs Normalized data modelling](https://docs.mongodb.com/manual/core/data-model-design/)

### Embedded 

- you have “contains” relationships between entities. 
- you have one-to-many relationships between entities. In these relationships the “many” or child documents always appear with or are viewed in the context of the “one” or parent documents. (eg: user with multiple addresses)
- In general, embedding provides better performance for read operations, as well as the ability to request and retrieve related data in a single database operation. Embedded data models make it possible to update related data in a single atomic write operation.

### Normalized

- In general, use normalized data models when embedding would result in duplication of data but would not provide sufficient read performance advantages to outweigh the implications of the duplication. (eg: books and publisher info)
- to represent more complex many-to-many relationships.
- to model large hierarchical data sets.

- [Model Relationships between documents](https://docs.mongodb.com/manual/applications/data-models-relationships/)
- [Go through this as well](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1)