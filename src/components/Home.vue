<template>
  <home data-page="true">
    <header class="header-bar">
      <div class="center">
        <h1 class="title">中网理发店收银台</h1>
      </div>
    </header>
    <div class="content">
        <div class="raido_group">
          <div v-for="(p, n) in products">
            <label class="radio">
                <input type="radio" name="type" :value="n" v-model="sel_item" @change="fill_input()">
                <span></span>
                <span class="text">{{`${n}(${p}分钱)`}}</span>
            </label>
          </div>    
        </div>
        
      <div class="parameters">
        <div><div class="caption">名称：</div><input v-model="p_name" placeholder="名称"></div>
        <div><div class="caption">价格：</div><input v-model.number="price" type="number" placeholder="价格"></div>
      </div>      
      <div style="justify-content:space-around;margin-top:10px;">
        <button v-if="device_ready" class="btn primary" style="flex:1;" @click.prevent="read_qr()"><h3 style="display:inline-block;margin:auto;">读取付款码收款</h3></button>
      </div>
      <div v-if="date_num.length > 5" style="justify-content:space-around;">
        <input v-model="begin_date" type="date" placeholder="起始日期" style="flex:1;" @change="filter_by_date()"/>
        <div class="caption">——</div>
        <input v-model="end_date" type="date" placeholder="截止日期" style="flex:1;" @change="filter_by_date()"/>
      </div>
      <span class="his-data" style="margin-top: 10px;">
        <div class="order" v-for="o in orders">
          <div style="font-size:24px;">{{o.dt}}</div>
          <div class="order_info" >
            <div>{{o.name}}</div>
            <div>{{o.price}}(分钱)</div>
            <div>{{o.status}}</div>
          </div> 
        </div>
      </span>
      
    </div>
  </home>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import Noty from 'noty';
import adb from "../db";
import net from "../net";
let t_data = [
  {
    dt: "2017-12-29 16:34:19",
    name: "测试商品",
    price: "1",
    status: "支付成功"
  }
];
window.on_qr = function(qr) {
  // alert(qr);
  qr = JSON.parse(qr);
  if (qr.ret == 0) {
    //扫码成功，通过qr.qr_code获取二维码
    // alert(qr.qr_code);
    vm.$emit("on_qrcode", qr.qr_code);
  } else {
    phonon.alert("扫码失败，请重试", "用户取消操作");
  }
};

export default {
  name: "PhononHomePage",
  props: {
    app: {
      type: Object
    }
  },
  created: function() {
    this.$root.$on("on_qrcode", qr_code => {
      //wx:（注：用户刷卡条形码规则：18位纯数字，以10、11、12、13、14、15开头）
      //ali: 25~30开头的长度为16~24位的数字，实际字符串长度以开发者获取的付款码长度为准
      let h = parseInt( qr_code.slice(0,2) )
      if(h >= 10 && h <=15){
        //wx auth code
      } else if(h >= 25 && h <=30){
        //ali auth code
      } else {
        //unknown
      }
      let out_trade_no = moment().format("YYYYMMDDHHmmssSSS");
      Pos.req_pay(out_trade_no, this.p_name, this.price, qr_code, res => {
        // alert("Pos.req_pay返回：" + res);
        let data = JSON.parse(res)
        let status = `${data.result_code}` + data.err_code_des? `(${data.err_code_des})` : '';
        this.save_order(this.p_name, this.price, status)
      });
    });
  },
  mounted() {
    this.app.on({ page: "home", preventClose: false, content: null });
    this.get_his_data();
    document.addEventListener(
      "deviceready",
      () => {
        this.device_ready = true;
      },
      false
    );
    this.fill_input()
  },
  data() {
    return {
      device_ready: false,
      sel_item: "单剪",
      products: {
        单剪: 1,
        洗吹剪: 3,
        "染发+焗油": 5,
        "卷发/拉直": 7,
        "洗头、洗脚、按摩一条龙": 10
      },
      p_name: "",
      price: "",

      his_order: [],
      begin_date: "",
      end_date: ""
    };
  },
  computed: {
    is_empty() {
      // console.log(_.size(this.his_order));
      return _.size(this.his_order) == 0;
    },

    date_num() {
      return _.uniqBy(this.his_order, "date");
    },
    orders() {
      let data = _.orderBy(this.his_order, "dt", "desc");

      if (this.begin_date) {
        data = _.filter(data, o => o.dt >= this.begin_date);
      }
      if (this.end_date) {
        data = _.filter(data, o => o.dt <= this.end_date);
      }
      // _.reverse(data.sorted_keys);
      // console.log(JSON.stringify(data, null, 4))
      return data;
    }
  },
  methods: {
    filter_by_date() {
      console.log("begin_date=" + this.begin_date, "end_date=" + this.end_date);
    },
    read_qr() {
      if (!this.price || !this.p_name) {
        return phonon.alert("名称 或 价格， 不能为空！", "请填写商品信息");
      }
      window.Pos.scan_by_camera(
        function(data) {
          // alert(data);
        },
        function(err) {
          alert(err);
        }
      );
    },
    fill_input() {
      this.price = this.products[this.sel_item];
      this.p_name = this.sel_item;
    },
    get_his_data() {
      adb.then(db => {
        this.his_order = db.his_order.find({});
        if (this.his_order.length == 0) {
          // this.his_order = t_data;
        } else {
          //  console.log('no set test data')
        }
      });
    },

    save_order(name, price, status) {
      adb.then(db => {
        let dt = moment().format("YYYY-MM-DD HH:mm:ss");
        let order = {
          dt,
          name,
          price,
          status
        };

        db.his_order.insert(order);
        this.get_his_data();
      });
    }
  }
};
</script>
<style scoped>
.order_info {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  background-color: aquamarine;
  border-style: inset;
}
.order {
  margin-top: 5px;
  border: 1px dotted purple;
}
.content {
  display: flex;
  flex-flow: column;
}
.content > div {
  display: flex;
  flex-flow: column;
}
.his-data,
.order {
  display: flex;
  flex-flow: column;
}
.radio {
  min-width: 70px;
}
.raido_group {
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  padding: 1px 2px;
  border: 2px ridge rgb(13, 14, 13);

  /* width: 50%; */
}

.parameters {
  margin-bottom: 10px;
}
.result {
  padding-right: 10px;
}
.parameters > div {
  border: 2px dashed coral;
  display: flex;
  flex-flow: row;
}
.caption {
  font-size: 28px;
  margin: auto;
}
input {
  flex: 1;
}

.btn.primary {
  flex: 1;
  min-width: 100px;
}

input[type="date"]:after {
  content: attr(placeholder);
}
</style>