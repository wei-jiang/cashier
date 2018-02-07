import Loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
const idbAdapter = new LokiIndexedAdapter();
let db;

//export promise?
export default new Promise((resolve, reject) => {
    if (db) {
        resolve(db);
    } else {
        let cashierDB = new Loki("cashier.db", {
            adapter: idbAdapter,
            autoload: true,
            autoloadCallback: () => {
                db = {
                    his_order: cashierDB.getCollection("his_order") ? cashierDB.getCollection("his_order") : cashierDB.addCollection("his_order"),
                    mch: cashierDB.getCollection("mch") ? cashierDB.getCollection("mch") : cashierDB.addCollection("mch"),
                    product: cashierDB.getCollection("product") ? cashierDB.getCollection("product") : cashierDB.addCollection("product"),
                }
                resolve(db);
            },
            autosave: true,
            autosaveInterval: 1000
        });
    }
})