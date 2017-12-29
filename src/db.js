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
                    his_order: quoteDB.getCollection("his_order") ? quoteDB.getCollection("his_order") : quoteDB.addCollection("his_order"),
                    // orders: quoteDB.getCollection("orders") ? quoteDB.getCollection("orders") : quoteDB.addCollection("orders"),
                }
                resolve(db);
            },
            autosave: true,
            autosaveInterval: 1000
        });
    }
})