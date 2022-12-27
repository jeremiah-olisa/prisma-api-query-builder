[View Implementation](https://github.com/jeremiah-olisa/shopping-list)

## https://github.com/jeremiah-olisa/shopping-list

<a name="ApiQueryBuilder"></a>

## ApiQueryBuilder

**Kind**: global class

- [ApiQueryBuilder](#ApiQueryBuilder)
  - [new ApiQueryBuilder(modelEntity, entity, [query], validStringFilter)](#new_ApiQueryBuilder_new)
  - [.filter()](#ApiQueryBuilder+filter) ⇒
  - [.sort()](#ApiQueryBuilder+sort) ⇒
  - [.select()](#ApiQueryBuilder+select) ⇒
  - [.populate()](#ApiQueryBuilder+populate) ⇒
  - [.paginate()](#ApiQueryBuilder+paginate) ⇒
  - [.build()](#ApiQueryBuilder+build) ⇒
  - [.all()](#ApiQueryBuilder+all) ⇒
  - [.many()](#ApiQueryBuilder+many) ⇒
  - [.findMany(filter)](#ApiQueryBuilder+findMany) ⇒
  - [.one(filter)](#ApiQueryBuilder+one) ⇒
  - [.toArray(val)](#ApiQueryBuilder+toArray) ⇒
  - [.arrayToBoolObject(selectables, array)](#ApiQueryBuilder+arrayToBoolObject) ⇒
  - [.filterRecursive(filterObj)](#ApiQueryBuilder+filterRecursive)

<a name="new_ApiQueryBuilder_new"></a>

### new ApiQueryBuilder(modelEntity, entity, [query], validStringFilter)

The constructor takes in a modelEntity, entity, query, and validStringFilter

| Param             | Type                                               | Description                                                                                                      |
| ----------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| modelEntity       | <code>PrismaModelDelegate</code>                   | This is the prisma entity e.g this.prisma.shoppingItem                                                           |
| entity            | <code>TModelEntity</code>                          | This is the entity that you want to query. it also contains all the settings for filtering and selecting of data |
| [query]           | <code>IQueryFields</code>                          | This is the query string fields from the api.                                                                    |
| validStringFilter | <code>Array.&lt;PrismaValidStringFilter&gt;</code> | This is an array of PrismaValidStringFilter. This is used to validate the string filter.                         |

<a name="ApiQueryBuilder+filter"></a>

### apiQueryBuilder.filter() ⇒

keysakes a query string, parses it into an object, and then recursively filters out any invalid

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
**Returns**: The builder object with the filter property set to the validFilterObj.
<a name="ApiQueryBuilder+sort"></a>

### apiQueryBuilder.sort() ⇒

the sortable columnsery parameter, splits it into an array, and then filters it to only include

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
**Returns**: The builder object
<a name="ApiQueryBuilder+select"></a>

### apiQueryBuilder.select() ⇒

whether the column was selected or notmn names and the values being `true` or `false` depending on

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
**Returns**: The builder object
<a name="ApiQueryBuilder+populate"></a>

### apiQueryBuilder.populate() ⇒

property to the knex query builderparameter called `include` then we will add the `select`

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
**Returns**: The builder object with the select property set to the selectables object.
<a name="ApiQueryBuilder+paginate"></a>

### apiQueryBuilder.paginate() ⇒

take values for the paginationom the query string, and then uses them to calculate the skip and

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
properties. The builder object with the paginate property set to an object with skip and take
<a name="ApiQueryBuilder+build"></a>

### apiQueryBuilder.build() ⇒

them to the builderObj propertyselect, and sort properties from the builder object and assigns

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
**Returns**: The builder object
<a name="ApiQueryBuilder+all"></a>

### apiQueryBuilder.all() ⇒

query.unction sorts, filters, selects, populates, and paginates the query, and then returns the

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
**Returns**: The query object.
<a name="ApiQueryBuilder+many"></a>

### apiQueryBuilder.many() ⇒

It returns a paginated object with the data and the paginated object

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)
**Returns**: An object with two properties: data and paginated.
<a name="ApiQueryBuilder+findMany"></a>

### apiQueryBuilder.findMany(filter) ⇒

and returns the data and paginated objectatch the filter, calculates the total number of pages,ct,

| --- | --- | --- |
| selectables | <code>Array.&lt;string&gt;</code> | string[] - an array of strings that are the selectable options |
| array | <code>Array.&lt;string&gt;</code> | string[] - the array of strings to convert to a boolean object |

<a name="ApiQueryBuilder+filterRecursive"></a>


### apiQueryBuilder.filterRecursive(filterObj)

it's empty filter object, picks only the valid keys, and then recursively filters the object until

**Kind**: instance method of [<code>ApiQueryBuilder</code>](#ApiQueryBuilder)

| Param     | Type                | Description                                  |
| --------- | ------------------- | -------------------------------------------- |
| filterObj | <code>object</code> | object - The object that you want to filter. |

[View Implementation](https://github.com/jeremiah-olisa/shopping-list)