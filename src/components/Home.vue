<template>
  <home data-page="true">
    <header class="header-bar">
      <div class="center">
        <h1 class="title">油价计算/比较工具</h1>
      </div>
    </header>
    <div class="content">
      <i class="sel_item">
        <div class="raido_group">
          <div>
            <label class="radio">
                <input type="radio" name="type" value="0#" v-model="oil_type" @change="empty_input()">
                <span></span>
                <span class="text">0#</span>
            </label>
          </div>    
          <div>
            <label class="radio">
                <input type="radio" name="type" value="92#" v-model="oil_type" @change="empty_input()">
                <span></span>
                <span class="text">92#</span>
            </label>
          </div>       
          <div>
            <label class="radio">
                <input type="radio" name="type" value="95#" v-model="oil_type" @change="empty_input()">
                <span></span>
                <span class="text">95#</span>
            </label>
          </div> 
        </div>
        <div class="raido_group" style="flex:1;">
          <div>
            <label class="radio">
                <input type="radio" name="company" value="中石化" v-model="company" @change="empty_input()">
                <span></span>
                <span class="text">中石化</span>
            </label>
          </div> 
          <div>
            <label class="radio">
                <input type="radio" name="company" value="中石油" v-model="company" @change="empty_input()">
                <span></span>
                <span class="text">中石油</span>
            </label>
          </div> 
          <div>
            <label class="radio">
                <input type="radio" name="company" value="中化" v-model="company" @change="empty_input()">
                <span></span>
                <span class="text">中化</span>
            </label>
          </div>
          <div>
            <label class="radio">
                <input type="radio" name="company" value="其他" v-model="company" @change="empty_input()">
                <span></span>
                <span class="text">其他</span>
            </label>
          </div>
        </div>
      </i>
      <div class="parameters">
        <div><div class="caption">价格：</div><input v-model.number="price" type="number" placeholder="价格"></div>
        <div><div class="caption">运费：</div><input v-model.number="carriage" type="number" placeholder="运费"></div>
        <div><div class="caption">密度：</div><input v-model.number="density" type="number" placeholder="密度"></div>
        <!-- <i class="break"></i> -->
        <button class="btn primary" @click.prevent="calc()">计算</button>
      </div>      
      <div style="justify-content:space-around;margin-top:10px;">
        <button v-if="!is_empty" class="btn negative" style="flex:1;" @click.prevent="clear()">清除历史数据</button>
        <button v-if="!is_empty && device_ready" class="btn positive" style="flex:1;" @click.prevent="exp_csv()">导出数据</button>
        <input type="file" @change="process_import_data($event)">
        <button class="btn primary" style="flex:1;" @click.prevent="import_csv()">导入</button>
      </div>
      <div v-if="date_num.length > 5" style="justify-content:space-around;">
        <input v-model="begin_date" type="date" placeholder="起始日期" style="flex:1;" @change="filter_by_date()"/>
        <div class="caption">——</div>
        <input v-model="end_date" type="date" placeholder="截止日期" style="flex:1;" @change="filter_by_date()"/>
      </div>
      <span class="his-data">
        <div class="date" v-for="k0 in group_data['sorted_keys']">
          <div style="font-size:32px;">{{k0}}</div>
          <!-- {{group_data[k0]['sorted_keys']}} -->
          <div class="oil_type" v-for="k1 in group_data[k0]['sorted_keys']">
            <div style="font-size:26px;">{{k1}}</div>
            <div class="rank">
              <div v-for="(d, i) in group_data[k0][k1]">
                {{`${d.company}(${d.result})`}}
                <span v-if="i != group_data[k0][k1].length-1"> 
                  &nbsp;{{ group_data[k0][k1][i+1] && d.result==group_data[k0][k1][i+1].result?'=':'>' }}&nbsp; 
                </span>
              </div>
            </div>
          </div> 
        </div>
      </span>
      
    </div>
  </home>
</template>

<script>
import moment from "moment";
import _ from "lodash";
// import Noty from 'noty';
import adb from "../db";
// function download(filename, text) {
//     let element = document.createElement('a');
//     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
//     element.setAttribute('download', filename);
//     element.style.display = 'none';
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
// }
// function saveTextAsFile(filename, text)
// {
//     var textFileAsBlob = new Blob([text], {
//         type: 'text/plain'
//     });
//     var downloadLink = document.createElement("a");
//     downloadLink.download = filename;
//     downloadLink.innerHTML = "Download File";
//     if (window.webkitURL != null)
//     {
//         downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
//     }
//     else
//     {
//         downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
//         downloadLink.onclick = destroyClickedElement;
//         downloadLink.style.display = "none";
//         document.body.appendChild(downloadLink);
//     }
//     downloadLink.click();
// }
export default {
  name: "PhononHomePage",
  props: {
    app: {
      type: Object
    }
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
  },
  data() {
    return {
      device_ready: false,
      oil_type: "92#",
      company: "中石化",
      density: "",
      price: "",
      carriage: "130",
      result: 0,
      his_quote: [],
      begin_date: "",
      end_date: ""
    };
  },
  computed: {
    is_empty() {
      // console.log(_.size(this.his_quote));
      return _.size(this.his_quote) == 0;
    },
    date_num(){
      return _.uniqBy(this.his_quote, 'date')
    },
    group_data() {
      // console.log("in group_data");
      let data = _.groupBy(this.his_quote, "date");
      _.each(data, (v0, k0) => {
        data[k0] = _.groupBy(v0, "oil_type");
        _.each(data[k0], (v1, k1) => {
          data[k0][k1] = _.orderBy(v1, [i => parseFloat(i.result)], ["desc"]);
        });
      });
      function sort_object(obj) {
        if (_.isPlainObject(obj)) {
          obj.sorted_keys = _.chain(obj)
            .keys()
            .sortBy()
            .value();
          _.each(obj, o => sort_object(o));
        }
      }
      sort_object(data);
      if (this.begin_date) {
        data.sorted_keys = _.filter(
          data.sorted_keys,
          d => d >= this.begin_date
        );
      }
      if (this.end_date) {
        data.sorted_keys = _.filter(data.sorted_keys, d => d <= this.end_date);
      }
      _.reverse(data.sorted_keys);
      // console.log(JSON.stringify(data, null, 4))
      return data;
    }
  },
  methods: {
    process_import_data(event) {
      if (event.target.files.length == 0) return;
      const allow_file_types = ["txt", "csv"];
      let csv_file = event.target.files[0];
      // phonon.alert(csv_file.name,'文件名为')
      let ext = csv_file.name
        .split(".")
        .pop()
        .toLowerCase();
      // phonon.alert(ext,'后缀名为')
      let valid = allow_file_types.indexOf(ext) > -1;
      if (!valid) return phonon.alert(`只能导入txt文件`, "文件格式错误");
      let reader = new FileReader();
      reader.onload = e => {
        let imp_data = e.target.result;
        // phonon.alert(imp_data, "导入数据");
        adb.then(db => {
          // db.his_quote.remove(db.his_quote.find({}));
          let rows = imp_data.split("\r\n");
          rows.pop();
          _.each(rows, r => {
            r = r.split(",");
            let d = {
              date: r[0],
              oil_type: r[1],
              company: r[2],
              result: r[3]
            };
            // phonon.alert( JSON.stringify(d, null, 4), "插入记录");
            db.his_quote.insert(d);
          });
          this.get_his_data();
        });
      };
      reader.onerror = e => {
        phonon.alert("导入失败", "导入数据");
      };
      reader.readAsText(csv_file);
      //this is important for onchange event to fire
      $('input[type="file"]').val("");
    },
    import_csv() {
      $('input[type="file"]').click();
    },
    filter_by_date() {
      console.log("begin_date=" + this.begin_date, "end_date=" + this.end_date);
    },
    get_csv() {
      let csv = _.reduce(
        this.his_quote,
        (data, item) => {
          item = _.pick(item, ["date", "oil_type", "company", "result"]);
          return data + _.values(item).join(",") + "\r\n";
        },
        ""
      );
      // phonon.alert(csv, "导出数据");
      return csv;
    },
    exp_csv() {
      let fn = moment().format("YYYYMMDDHHmmssSSS");
      fn = `${fn}.txt`;
      let csv_data = this.get_csv();
      //Android/data/<app-id>/	externalApplicationStorageDirectory
      window.resolveLocalFileSystemURL(
        cordova.file.externalDataDirectory,
        dirEntry => {
          dirEntry.getFile(
            fn,
            { create: true, exclusive: false },
            fileEntry => {
              fileEntry.createWriter(fileWriter => {
                fileWriter.onwriteend = function() {
                  phonon.alert(`已导出至：${fileEntry.toURL()}`, "导出成功（请备份）");
                };
                fileWriter.onerror = function(e) {
                  phonon.alert("操作失败", "导出数据");
                };
                let dataObj = new Blob([csv_data], { type: "text/plain" });
                fileWriter.write(dataObj);
              });
            },
            () => phonon.alert("创建文件失败", "导出数据")
          );
        },
        () => phonon.alert("打开文件系统失败", "导出数据")
      );
    },
    empty_input() {
      this.price = this.density = "";
      if (this.company == "中石化") {
        this.carriage = 130;
      } else if (this.company == "中石油") {
        this.carriage = 130;
      } else if (this.company == "中化") {
        this.carriage = 220;
      } else {
        this.carriage = "";
      }
    },
    get_his_data() {
      adb.then(db => {
        this.his_quote = db.his_quote.find({});
        if (this.his_quote.length == 0) {
          // this.his_quote = t_data
        } else {
          //  console.log('no set test data')
        }
      });
    },
    clear() {
      let confirm = phonon.confirm(
        "请在删除前导出数据文件，并备份至电脑",
        "确认清除？",
        true,
        "确认",
        "取消"
      );
      confirm.on("confirm", ()=> {
        adb.then(db => {
          db.his_quote.remove(db.his_quote.find({}));
          this.get_his_data();
        });
      });
    },
    calc() {
      if (!this.price || !this.carriage || !this.density) {
        return phonon.alert("价格 或 运费 或 密度， 不能为空！", "请填写参数");
      }
      this.result = (this.price + this.carriage) / (1000 / this.density);
      this.result = parseFloat(this.result).toFixed(2);
      console.log(this.result);
      adb.then(db => {
        let today = moment().format("YYYY-MM-DD");
        let today_data = {
          date: today,
          oil_type: this.oil_type,
          company: this.company
        };
        let old_data = db.his_quote.findOne(today_data);
        if (old_data) {
          old_data.result = this.result;
          db.his_quote.update(old_data);
        } else {
          today_data.result = this.result;
          db.his_quote.insert(today_data);
        }

        this.get_his_data();
      });
    }
  }
};
</script>
<style scoped>
.oil_type {
  background-color: aquamarine;
  border-style: inset;
}
.date {
  margin-top: 5px;
  border: 1px dotted purple;
}
.content,
.sel_item {
  display: flex;
  flex-flow: column;
}
.content > div,
.rank {
  display: flex;
  flex-flow: row;
}
.his-data,
.date,
.oil_type {
  display: flex;
  flex-flow: column;
}
.radio {
  min-width: 70px;
}
.raido_group {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  padding: 1px 5px;
  border: 2px solid greenyellow;
  /* width: 50%; */
}
.break {
  flex-basis: 100%;
  width: 0px;
  height: 0px;
  overflow: hidden;
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
  margin: auto;
}
input[type="number"] {
  flex: 1;
}
input[type="file"] {
  display: none;
}
.btn.primary {
  flex: 1;
  min-width: 100px;
}
/* input[type="date"]:not(.has-value):before{
  color: lightgray;
  content: attr(placeholder);
} */
input[type="date"]:after {
  content: attr(placeholder);
}
</style>