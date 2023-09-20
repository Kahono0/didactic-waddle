# r/farmers
r/farmers is a social place for farmers to share information on farming practices, where to source products, best markets etc.
It revelages the utu sdk to receive feedback from fellow users inform of badges and comments.  A user can also give an endorsement but they need to use UTT token for that.

## How it works
- When getting started, a user connects their wallet and uses the wallet to sign into Utu.
- They receive articles stored on a backend application.
- They can view or give feedback on articles
- A user can also create a new article.

## technical
- When creating a new article, a uuid is generated and assigned to the article as the id
- The id is registered as an entity on utu
- The article is sent to the backend application for savuing
- When querying, the uuid generated during creation is used to interact with the utu sdk


