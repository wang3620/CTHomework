# CTHomework

## How to run this repo:

1. set up your mariadb on your local machine, with your preferred username + password (remember to update our code, see backend/main.js)
2. make sure you have node v16+ on your local machine
3. in backend folder, `npm install`
4. in frontend folder, `npm install`
5. initialize your database by running the `ddl/init.sql` file
6. in backend folder, `npm start`
7. in frontend folder, `npm start`


## Assumption
1. During adding a bitcoin address, we only fetch the latest 50 records. (What is the oldest record we need to store?)
2. For each bitcoin address, our `background.js` will fetch its transactions every 120 minutes. (How frequently we update our transaction table?) According to the research:
```Markdown
In summary, there is no fixed or "usual" frequency at which transactions are added to a Bitcoin address.
It varies greatly depending on the specific circumstances, use case, and user behavior.
The 10-minute block time is an average, but the actual frequency of transactions to a specific address can be much higher or lower.
```
3. query blockchain info api has rate limit constraints
4. for more assumptions: please see my figma design [doc](https://www.figma.com/file/Qik5Dq4FEyLZHbC7dyQBEm/Design-Doc?type=whiteboard&node-id=0%3A1&t=La9kO4bzlzGsuxr9-1)

## Todo
Globally search `todo` keyword in this repo.
