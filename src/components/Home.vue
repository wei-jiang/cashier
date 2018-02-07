<template>
  <home data-page="true">
    <header class="header-bar">
      <div class="center">
        <h1 class="title">{{mch_title}}</h1>
      </div>
      <button class="btn pull-right icon icon-add" @click.prevent="mgr_product()"></button>
    </header>
    <div class="content">
        <div class="check_group">
          <div v-for="p in products" style="display:flex;flex-flow:row;">
            <div style="font-size: 16px;margin:auto;">{{`${p.name}(${p.price}元)`}}</div>
            <div style="font-size: 16px;margin:auto;">&nbsp;&nbsp;&nbsp;数量:</div>
            <input v-model.number="p.count" type="number" placeholder="数量" onclick="this.select()" @change="fill_input()">
            <input type="checkbox" :value="p.name" v-model="p.selected" @change="fill_input()">            
          </div>    
        </div>
        
      <div class="parameters">
        <div><div class="caption">名称：</div><input v-model="p_name" placeholder="名称"></div>
        <div><div class="caption">价格(元)：</div><input v-model.number="price" type="number" placeholder="价格"></div>
      </div>      
      <div style="justify-content:space-around;margin-top:10px;">
        <button v-if="device_ready && has_mch" class="btn primary" style="flex:1;" @click.prevent="read_pay_code()">
          <h3 style="display:inline-block;margin:auto;">
            读取付款码收款
          </h3>
        </button>
        <button v-if="device_ready" class="btn positive" style="flex:1; margin-top:10px;" @click.prevent="read_mch_info()">
          <h3 style="display:inline-block;margin:auto;">
            {{has_mch?'更新商户信息':'读取商户信息'}}
          </h3>
        </button>
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
            <div>{{o.price}}(元)</div>
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
import Noty from "noty";
import adb from "../db";
import net from "../net";
import util from "../common/util"

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
      this.qr_dealer(qr_code)      
    });
    this.$root.$on("update_order_state", data => {
      this.update_order(data)      
    });
  },
  mounted() {
    this.app.on({ page: "home", preventClose: false, content: null }, this);//add this for onReady function
    this.get_his_data();
    document.addEventListener(
      "deviceready",
      () => {
        this.device_ready = true;
      },
      false
    );
    
    this.update_mch_info()    
  },
  data() {
    return {
      qr_dealer:null,
      has_mch:false,
      mch_title:'',
      device_ready: false,
      products: [],
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
    onReady() {
      this.fill_product()
    },
    fill_product() {
      adb.then(db => {
        this.products = _.map(db.product.find({}), p=>{
          let cp = _.clone(p);
          cp.selected = false;
          cp.count = 1;
          return cp
        });
        this.fill_input();
      })   
    },
    mgr_product() {
      // <a class="pull-right" :href="`#!pay/${m.name}`"></a>
      phonon.navigator().changePage("product", '');
    },
    update_order(data){
      adb.then(db => {
        let o = db.his_order.findOne({out_trade_no:data.out_trade_no});
        if(o){
          o.status = data.state
          db.his_order.findAndUpdate(
            {
              $loki: o.$loki
            },
            obj => o
          );
          this.get_his_data()
        }        
      })   
    },
    handle_mch_info(qr_code){
      net.emit( "verify_mch_token", qr_code,
        res => {
          if(res.ret == 0){
            let capable = util.ability_title(res.info.ability)
            adb.then(db => {
              db.mch.remove(db.mch.find({}));
              db.mch.insert({token:qr_code,info:res.info});
              this.update_mch_info()
              phonon.alert(`【${res.info.name}】商户可以读取(${capable})付款码收款！`, `导入${res.info.name}商户成功`);
            })                
          } else {
            phonon.alert("无效的商户信息！", "读取商户信息失败");
          }
        }
      );
    },
    handle_pay_code(qr_code){
      adb.then(db => {
        const mch = db.mch.findOne({});
        if (mch) {
          const token = mch.token
          const out_trade_no = util.hash_str(mch.info.name) + moment().format("YYYYMMDDHHmmssSSS");
          //wx:（注：用户刷卡条形码规则：18位纯数字，以10、11、12、13、14、15开头）
          //ali: 25~30开头的长度为16~24位的数字，实际字符串长度以开发者获取的付款码长度为准
          let h = parseInt(qr_code.slice(0, 2));
          if (h >= 10 && h <= 15) {
            if( !util.is_wx_capable(mch.info.ability) ) return phonon.alert("请联系【智慧旅游商务】开通微信收款！", "未开通微信反扫功能");
            //wx auth code
            net.emit(
              "wx_auth_pay",
              {
                token,
                out_trade_no,
                body: this.p_name,
                total_fee: parseFloat(this.price)*100,
                auth_code: qr_code
              },
              res => {
                // alert(JSON.stringify(res));
                this.save_order(out_trade_no, this.p_name, this.price, res.msg)
              }
            );
          } else if (h >= 25 && h <= 30) {
            if( !util.is_ali_capable(mch.info.ability) ) return phonon.alert("请联系【智慧旅游商务】开通支付宝收款！", "未开通支付宝反扫功能");
            //ali auth code
            net.emit(
              "ali_auth_pay",
              {
                token,
                out_trade_no,
                body: this.p_name,
                total_fee: this.price,
                auth_code: qr_code
              },
              res => {
                // alert(JSON.stringify(res));
                this.save_order(out_trade_no, this.p_name, this.price, res.msg)
              }
            );
          } else {
            //unknown
            phonon.alert("请扫描客户【微信 或 支付宝】付款码！", "无效的付款码");
          }
          //these are local service(no uese)
          // let out_trade_no = moment().format("YYYYMMDDHHmmssSSS");
          // Pos.req_pay(out_trade_no, this.p_name, this.price, qr_code, res => {
          //   // alert("Pos.req_pay返回：" + res);
          //   let data = JSON.parse(res)
          //   let status = `${data.result_code}` + data.err_code_des? `(${data.err_code_des})` : '';
          //   this.save_order(this.p_name, this.price, status)
          // });
        } else {
          //no mch info 
          phonon.alert("请联系【智慧旅游商务】开通收款功能！", "无商户信息");
        }
      });
    },
    read_mch_info(){
      this.qr_dealer = this.handle_mch_info
      this.read_qr()
    },
    read_pay_code(){
      if (!this.price || !this.p_name) {
        return phonon.alert("名称 或 价格， 不能为空！", "请填写商品信息");
      }
      this.qr_dealer = this.handle_pay_code
      this.read_qr()
    },
    update_mch_info() {
      adb.then(db => {
        const mch = db.mch.findOne({});
        if(mch){
          let capable = util.ability_title(mch.info.ability)
          this.mch_title = `${mch.info.name}收银台（${capable}）`
          this.has_mch = true;
        } else {
          this.mch_title = '智慧收银'
          this.has_mch = false;
        }
      });
    },

    filter_by_date() {
      console.log("begin_date=" + this.begin_date, "end_date=" + this.end_date);
    },
    read_qr() {      
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
      let sels = _.filter(this.products,p=>p.selected)
      let price = 0
      let name = ''
      _.each(sels, p=>{
        const pp = parseFloat(p.price)*parseInt(p.count)
        price += pp
        if(pp){
          name += `${p.name}(${p.count}) `
        }
      })
      this.price = price
      this.p_name = name
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

    save_order(out_trade_no, name, price, status) {
      adb.then(db => {
        let dt = moment().format("YYYY-MM-DD HH:mm:ss");
        let order = {
          out_trade_no,
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
.check_group {
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
input[type="checkbox"] {
  margin-left: auto;
  width: 28px; 
  height:28px;
}
input[type="date"]:after {
  content: attr(placeholder);
}
</style>