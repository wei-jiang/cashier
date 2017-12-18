import Loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
const idbAdapter = new LokiIndexedAdapter();
let db;

//export promise?
export default new Promise((resolve, reject) => {
    if (db) {
        resolve(db);
    } else {
        let quoteDB = new Loki("quote.db", {
            adapter: idbAdapter,
            autoload: true,
            autoloadCallback: () => {
                db = {
                    his_quote: quoteDB.getCollection("his_quote") ? quoteDB.getCollection("his_quote") : quoteDB.addCollection("his_quote"),
                    // orders: quoteDB.getCollection("orders") ? quoteDB.getCollection("orders") : quoteDB.addCollection("orders"),
                }
                resolve(db);
            },
            autosave: true,
            autosaveInterval: 1000
        });
    }
})