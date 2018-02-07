<template>
  <product data-page="true">
    <header class="header-bar">
      <div class="center">
        <button class="btn pull-left icon icon-arrow-back" data-navigation="$previous-page"></button>
        <h1 class="title">商品管理</h1>
      </div>
    </header>

    <div class="content">
      <div class="padded-full">
        <ul class="list">
          <li v-for="p in products">
            <div class="item" >
              <div><div class="caption">名称：</div><input v-model="p.name" placeholder="名称"></div>
              <div><div class="caption">价格(元)：</div><input v-model.number="p.price" type="number" placeholder="价格(元)" onclick="this.select()"></div>
              <div class="opertion">
                <button class="btn primary" @click.prevent="save_item(p)" >保存</button>
                <button class="btn negative" @click.prevent="delete_item(p)" >删除</button>
              </div>
              
            </div>
          </li>
        </ul>
        <button class="btn fit-parent positive" style="margin-top:15px;" @click.prevent="add_product()">添加商品</button>
 
      </div>
    </div>
  </product>
</template>

<script>
import Vue from 'vue'
import moment from "moment";
import _ from "lodash";

import adb from "../db";

export default {
  name: 'PhononProduct',
  props: {
    app: {
      type: Object
    }
  },

  data () {
    return {
      products: [],
      saved: true
    }
  },

  mounted () {
    /*
     * Phonon also supports objects
     * With VueJS, it is better to use "this"
     * instead of a callable function like other examples
     * If Phonon finds page events, it will call them
     * here we want to use onClose, onHidden and onHashChanged methods
     */
    this.app.on({page: 'product', preventClose: true}, this)
    
  },

  methods: {
    onReady() {
      this.fill_product();
    },
    onClose (self) {
      if (this.saved) {
        self.close()
      } else {
        let confirm = phonon.confirm('商品信息尚未保存', '确认离开吗？', true, '确认', '取消');
        confirm.on('confirm', ()=> {
          self.close()
        });
        confirm.on('cancel', ()=> {} );
      }
    },

    onHidden () {
      this.action = true
    },

    onHashChanged (pizza) {

    },
    save_item(p) {
      adb.then(db => {
        db.product.findAndUpdate(
          {
            $loki: p.$loki
          },
          obj => p
        );
        phonon.alert('商品信息修改成功', '保存成功')
        this.fill_product();
      });
    },
    delete_item(p) {
      adb.then(db => {
        db.product.remove(p);
        this.fill_product();
      });
    },
    fill_product() {
      adb.then(db => {
        this.products = db.product.find({})
      })
    },
    add_product() {
      adb.then(db => {
        this.products = db.product.insert({name:'测试商品', price:0.01})
        this.fill_product();
      })
    }
  }
}
</script>
<style scoped>
.item {
  border: dotted outset lightgreen;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
}
.item > div{

  display: flex;
  flex-flow: row;
  justify-content: space-around;
}
input {
  flex: 1;
}
.opertion > button{
  flex: 1;
}
.caption {
  font-size: 16px;
  margin: auto;
}
</style>