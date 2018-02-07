webpackJsonp([2,0],{0:function(t,e,n){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}var i=n(182),s=a(i);n(241);var o=n(260),r=a(o);n(35),s.default.config.ignoredElements=["home","product"],n(242),n(252),window.vm=new s.default({el:"#app",template:"<App/>",components:{App:r.default}})},23:function(t,e,n){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(191),s=a(i),o=n(248),r=a(o),c=n(56),u=a(c),d=new u.default,l=void 0;e.default=new s.default(function(t,e){if(l)t(l);else var n=new r.default("cashier.db",{adapter:d,autoload:!0,autoloadCallback:function(){l={his_order:n.getCollection("his_order")?n.getCollection("his_order"):n.addCollection("his_order"),mch:n.getCollection("mch")?n.getCollection("mch"):n.addCollection("mch"),product:n.getCollection("product")?n.getCollection("product"):n.addCollection("product")},t(l)},autosave:!0,autosaveInterval:1e3})})},35:function(t,e,n){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(192),s=a(i),o=n(193),r=a(o),c=n(20),u=(a(c),n(1)),d=(a(u),n(254)),l=a(d),f=n(23),_=(a(f),function(){function t(){var e=this;(0,s.default)(this,t),document.addEventListener("deviceready",function(){e.sock=(0,l.default)("https://pay.cninone.com"),e.sock.on("connect",e.on_connect.bind(e)),e.sock.on("refresh_file_list",e.on_refresh_file_list.bind(e)),e.sock.on("update_order_state",e.on_update_order_state.bind(e))})}return(0,r.default)(t,[{key:"register_ui_evt",value:function(){var t=this;vm.$on("notify_seller_status",function(e){t.emit("notify_seller_status",e)})}},{key:"on_connect",value:function(){}},{key:"on_update_order_state",value:function(t){vm.$emit("update_order_state",t)}},{key:"on_refresh_file_list",value:function(t){vm.$emit("refresh_file_list","")}},{key:"emit",value:function(t,e,n){this.sock&&this.sock.emit(t,e,n)}}]),t}());e.default=new _},186:function(t,e,n){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(261),s=a(i),o=n(262),r=a(o);e.default={name:"app",data:function(){return{app:phonon.navigator()}},mounted:function(){var t=this;this.$nextTick(function(){phonon.options({navigator:{defaultPage:"home",animatePages:!0,enableBrowserBackButton:!0},i18n:null}),window.setTimeout(function(){t.app.start()},500)})},components:{Home:s.default,Product:r.default}}},187:function(t,e,n){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),s=a(i),o=n(20),r=a(o),c=n(175),u=(a(c),n(23)),d=a(u),l=n(35),f=a(l),_=n(189),p=a(_);window.on_qr=function(t){t=JSON.parse(t),0==t.ret?vm.$emit("on_qrcode",t.qr_code):phonon.alert("扫码失败，请重试","用户取消操作")},e.default={name:"PhononHomePage",props:{app:{type:Object}},created:function(){var t=this;this.$root.$on("on_qrcode",function(e){t.qr_dealer(e)}),this.$root.$on("update_order_state",function(e){t.update_order(e)})},mounted:function(){var t=this;this.app.on({page:"home",preventClose:!1,content:null},this),this.get_his_data(),document.addEventListener("deviceready",function(){t.device_ready=!0},!1),this.update_mch_info()},data:function(){return{qr_dealer:null,has_mch:!1,mch_title:"",device_ready:!1,products:[],p_name:"",price:"",his_order:[],begin_date:"",end_date:""}},computed:{is_empty:function(){return 0==r.default.size(this.his_order)},date_num:function(){return r.default.uniqBy(this.his_order,"date")},orders:function(){var t=this,e=r.default.orderBy(this.his_order,"dt","desc");return this.begin_date&&(e=r.default.filter(e,function(e){return e.dt>=t.begin_date})),this.end_date&&(e=r.default.filter(e,function(e){return e.dt<=t.end_date})),e}},methods:{onReady:function(){this.fill_product()},fill_product:function(){var t=this;d.default.then(function(e){t.products=r.default.map(e.product.find({}),function(t){var e=r.default.clone(t);return e.selected=!1,e.count=1,e}),t.fill_input()})},mgr_product:function(){phonon.navigator().changePage("product","")},update_order:function(t){var e=this;d.default.then(function(n){var a=n.his_order.findOne({out_trade_no:t.out_trade_no});a&&(a.status=t.state,n.his_order.findAndUpdate({$loki:a.$loki},function(t){return a}),e.get_his_data())})},handle_mch_info:function(t){var e=this;f.default.emit("verify_mch_token",t,function(n){if(0==n.ret){var a=p.default.ability_title(n.info.ability);d.default.then(function(i){i.mch.remove(i.mch.find({})),i.mch.insert({token:t,info:n.info}),e.update_mch_info(),phonon.alert("【"+n.info.name+"】商户可以读取("+a+")付款码收款！","导入"+n.info.name+"商户成功")})}else phonon.alert("无效的商户信息！","读取商户信息失败")})},handle_pay_code:function(t){var e=this;d.default.then(function(n){var a=n.mch.findOne({});if(a){var i=a.token,o=p.default.hash_str(a.info.name)+(0,s.default)().format("YYYYMMDDHHmmssSSS"),r=parseInt(t.slice(0,2));if(r>=10&&r<=15){if(!p.default.is_wx_capable(a.info.ability))return phonon.alert("请联系【智慧旅游商务】开通微信收款！","未开通微信反扫功能");f.default.emit("wx_auth_pay",{token:i,out_trade_no:o,body:e.p_name,total_fee:100*parseFloat(e.price),auth_code:t},function(t){e.save_order(o,e.p_name,e.price,t.msg)})}else if(r>=25&&r<=30){if(!p.default.is_ali_capable(a.info.ability))return phonon.alert("请联系【智慧旅游商务】开通支付宝收款！","未开通支付宝反扫功能");f.default.emit("ali_auth_pay",{token:i,out_trade_no:o,body:e.p_name,total_fee:100*parseFloat(e.price),auth_code:t},function(t){e.save_order(o,e.p_name,e.price,t.msg)})}else phonon.alert("请扫描客户【微信 或 支付宝】付款码！","无效的付款码")}else phonon.alert("请联系【智慧旅游商务】开通收款功能！","无商户信息")})},read_mch_info:function(){this.qr_dealer=this.handle_mch_info,this.read_qr()},read_pay_code:function(){return this.price&&this.p_name?(this.qr_dealer=this.handle_pay_code,void this.read_qr()):phonon.alert("名称 或 价格， 不能为空！","请填写商品信息")},update_mch_info:function(){var t=this;d.default.then(function(e){var n=e.mch.findOne({});if(n){var a=p.default.ability_title(n.info.ability);t.mch_title=n.info.name+"收银台（"+a+"）",t.has_mch=!0}else t.mch_title="智慧收银",t.has_mch=!1})},filter_by_date:function(){console.log("begin_date="+this.begin_date,"end_date="+this.end_date)},read_qr:function(){window.Pos.scan_by_camera(function(t){},function(t){alert(t)})},fill_input:function(){var t=r.default.filter(this.products,function(t){return t.selected}),e=0,n="";r.default.each(t,function(t){var a=parseFloat(t.price)*parseInt(t.count);e+=a,a&&(n+=t.name+"("+t.count+") ")}),this.price=e,this.p_name=n},get_his_data:function(){var t=this;d.default.then(function(e){t.his_order=e.his_order.find({}),0==t.his_order.length})},save_order:function(t,e,n,a){var i=this;d.default.then(function(o){var r=(0,s.default)().format("YYYY-MM-DD HH:mm:ss"),c={out_trade_no:t,dt:r,name:e,price:n,status:a};o.his_order.insert(c),i.get_his_data()})}}}},188:function(t,e,n){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(182),s=(a(i),n(1)),o=(a(s),n(20)),r=(a(o),n(23)),c=a(r);e.default={name:"PhononProduct",props:{app:{type:Object}},data:function(){return{products:[],saved:!0}},mounted:function(){this.app.on({page:"product",preventClose:!0},this)},methods:{onReady:function(){this.fill_product()},onClose:function(t){if(this.saved)t.close();else{var e=phonon.confirm("商品信息尚未保存","确认离开吗？",!0,"确认","取消");e.on("confirm",function(){t.close()}),e.on("cancel",function(){})}},onHidden:function(){this.action=!0},onHashChanged:function(t){},save_item:function(t){var e=this;c.default.then(function(n){n.product.findAndUpdate({$loki:t.$loki},function(e){return t}),phonon.alert("商品信息修改成功","保存成功"),e.fill_product()})},delete_item:function(t){var e=this;c.default.then(function(n){n.product.remove(t),e.fill_product()})},fill_product:function(){var t=this;c.default.then(function(e){t.products=e.product.find({})})},add_product:function(){var t=this;c.default.then(function(e){t.products=e.product.insert({name:"测试商品",price:.01}),t.fill_product()})}}}},189:function(t,e,n){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}function i(t){var e="";return t&l.WX_FS&&(e="微信"),t&l.ALI_FS&&(e?e+="/支付宝":e="支付宝"),e}function s(t){return t&l.WX_FS}function o(t){return t&l.ALI_FS}function r(t){return t.split("").map(function(t){return t.charCodeAt(0)}).reduce(function(t,e){return t+((t<<7)+(t<<3))^e}).toString(16)}Object.defineProperty(e,"__esModule",{value:!0});var c=n(175),u=(a(c),n(20)),d=(a(u),n(1)),l=(a(d),{WX_GZH:1,WX_ZS:2,WX_FS:4,WX_H5:8,ALI_WAP:16,ALI_ZS:32,ALI_FS:64,ALI_PAGE:128});e.default={ability_title:i,is_wx_capable:s,is_ali_capable:o,hash_str:r}},241:function(t,e){},242:function(t,e){},243:function(t,e){},244:function(t,e){},245:function(t,e){},249:function(t,e,n){function a(t){return n(i(t))}function i(t){return s[t]||function(){throw new Error("Cannot find module '"+t+"'.")}()}var s={"./af":57,"./af.js":57,"./ar":64,"./ar-dz":58,"./ar-dz.js":58,"./ar-kw":59,"./ar-kw.js":59,"./ar-ly":60,"./ar-ly.js":60,"./ar-ma":61,"./ar-ma.js":61,"./ar-sa":62,"./ar-sa.js":62,"./ar-tn":63,"./ar-tn.js":63,"./ar.js":64,"./az":65,"./az.js":65,"./be":66,"./be.js":66,"./bg":67,"./bg.js":67,"./bm":68,"./bm.js":68,"./bn":69,"./bn.js":69,"./bo":70,"./bo.js":70,"./br":71,"./br.js":71,"./bs":72,"./bs.js":72,"./ca":73,"./ca.js":73,"./cs":74,"./cs.js":74,"./cv":75,"./cv.js":75,"./cy":76,"./cy.js":76,"./da":77,"./da.js":77,"./de":80,"./de-at":78,"./de-at.js":78,"./de-ch":79,"./de-ch.js":79,"./de.js":80,"./dv":81,"./dv.js":81,"./el":82,"./el.js":82,"./en-au":83,"./en-au.js":83,"./en-ca":84,"./en-ca.js":84,"./en-gb":85,"./en-gb.js":85,"./en-ie":86,"./en-ie.js":86,"./en-nz":87,"./en-nz.js":87,"./eo":88,"./eo.js":88,"./es":91,"./es-do":89,"./es-do.js":89,"./es-us":90,"./es-us.js":90,"./es.js":91,"./et":92,"./et.js":92,"./eu":93,"./eu.js":93,"./fa":94,"./fa.js":94,"./fi":95,"./fi.js":95,"./fo":96,"./fo.js":96,"./fr":99,"./fr-ca":97,"./fr-ca.js":97,"./fr-ch":98,"./fr-ch.js":98,"./fr.js":99,"./fy":100,"./fy.js":100,"./gd":101,"./gd.js":101,"./gl":102,"./gl.js":102,"./gom-latn":103,"./gom-latn.js":103,"./gu":104,"./gu.js":104,"./he":105,"./he.js":105,"./hi":106,"./hi.js":106,"./hr":107,"./hr.js":107,"./hu":108,"./hu.js":108,"./hy-am":109,"./hy-am.js":109,"./id":110,"./id.js":110,"./is":111,"./is.js":111,"./it":112,"./it.js":112,"./ja":113,"./ja.js":113,"./jv":114,"./jv.js":114,"./ka":115,"./ka.js":115,"./kk":116,"./kk.js":116,"./km":117,"./km.js":117,"./kn":118,"./kn.js":118,"./ko":119,"./ko.js":119,"./ky":120,"./ky.js":120,"./lb":121,"./lb.js":121,"./lo":122,"./lo.js":122,"./lt":123,"./lt.js":123,"./lv":124,"./lv.js":124,"./me":125,"./me.js":125,"./mi":126,"./mi.js":126,"./mk":127,"./mk.js":127,"./ml":128,"./ml.js":128,"./mr":129,"./mr.js":129,"./ms":131,"./ms-my":130,"./ms-my.js":130,"./ms.js":131,"./my":132,"./my.js":132,"./nb":133,"./nb.js":133,"./ne":134,"./ne.js":134,"./nl":136,"./nl-be":135,"./nl-be.js":135,"./nl.js":136,"./nn":137,"./nn.js":137,"./pa-in":138,"./pa-in.js":138,"./pl":139,"./pl.js":139,"./pt":141,"./pt-br":140,"./pt-br.js":140,"./pt.js":141,"./ro":142,"./ro.js":142,"./ru":143,"./ru.js":143,"./sd":144,"./sd.js":144,"./se":145,"./se.js":145,"./si":146,"./si.js":146,"./sk":147,"./sk.js":147,"./sl":148,"./sl.js":148,"./sq":149,"./sq.js":149,"./sr":151,"./sr-cyrl":150,"./sr-cyrl.js":150,"./sr.js":151,"./ss":152,"./ss.js":152,"./sv":153,"./sv.js":153,"./sw":154,"./sw.js":154,"./ta":155,"./ta.js":155,"./te":156,"./te.js":156,"./tet":157,"./tet.js":157,"./th":158,"./th.js":158,"./tl-ph":159,"./tl-ph.js":159,"./tlh":160,"./tlh.js":160,"./tr":161,"./tr.js":161,"./tzl":162,"./tzl.js":162,"./tzm":164,"./tzm-latn":163,"./tzm-latn.js":163,"./tzm.js":164,"./uk":165,"./uk.js":165,"./ur":166,"./ur.js":166,"./uz":168,"./uz-latn":167,"./uz-latn.js":167,"./uz.js":168,"./vi":169,"./vi.js":169,"./x-pseudo":170,"./x-pseudo.js":170,"./yo":171,"./yo.js":171,"./zh-cn":172,"./zh-cn.js":172,"./zh-hk":173,"./zh-hk.js":173,"./zh-tw":174,"./zh-tw.js":174};a.keys=function(){return Object.keys(s)},a.resolve=i,t.exports=a,a.id=249},260:function(t,e,n){n(245);var a=n(34)(n(186),n(265),null,null);t.exports=a.exports},261:function(t,e,n){n(244);var a=n(34)(n(187),n(264),"data-v-afc1077a",null);t.exports=a.exports},262:function(t,e,n){n(243);var a=n(34)(n(188),n(263),"data-v-77f0203b",null);t.exports=a.exports},263:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("product",{attrs:{"data-page":"true"}},[n("header",{staticClass:"header-bar"},[n("div",{staticClass:"center"},[n("button",{staticClass:"btn pull-left icon icon-arrow-back",attrs:{"data-navigation":"$previous-page"}}),t._v(" "),n("h1",{staticClass:"title"},[t._v("商品管理")])])]),t._v(" "),n("div",{staticClass:"content"},[n("div",{staticClass:"padded-full"},[n("ul",{staticClass:"list"},t._l(t.products,function(e){return n("li",[n("div",{staticClass:"item"},[n("div",[n("div",{staticClass:"caption"},[t._v("名称：")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"p.name"}],attrs:{placeholder:"名称"},domProps:{value:e.name},on:{input:function(n){n.target.composing||t.$set(e,"name",n.target.value)}}})]),t._v(" "),n("div",[n("div",{staticClass:"caption"},[t._v("价格(元)：")]),n("input",{directives:[{name:"model",rawName:"v-model.number",value:e.price,expression:"p.price",modifiers:{number:!0}}],attrs:{type:"number",placeholder:"价格(元)",onclick:"this.select()"},domProps:{value:e.price},on:{input:function(n){n.target.composing||t.$set(e,"price",t._n(n.target.value))},blur:function(e){t.$forceUpdate()}}})]),t._v(" "),n("div",{staticClass:"opertion"},[n("button",{staticClass:"btn primary",on:{click:function(n){n.preventDefault(),t.save_item(e)}}},[t._v("保存")]),t._v(" "),n("button",{staticClass:"btn negative",on:{click:function(n){n.preventDefault(),t.delete_item(e)}}},[t._v("删除")])])])])})),t._v(" "),n("button",{staticClass:"btn fit-parent positive",staticStyle:{"margin-top":"15px"},on:{click:function(e){e.preventDefault(),t.add_product()}}},[t._v("添加商品")])])])])},staticRenderFns:[]}},264:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("home",{attrs:{"data-page":"true"}},[n("header",{staticClass:"header-bar"},[n("div",{staticClass:"center"},[n("h1",{staticClass:"title"},[t._v(t._s(t.mch_title))])]),t._v(" "),n("button",{staticClass:"btn pull-right icon icon-add",on:{click:function(e){e.preventDefault(),t.mgr_product()}}})]),t._v(" "),n("div",{staticClass:"content"},[n("div",{staticClass:"check_group"},t._l(t.products,function(e){return n("div",{staticStyle:{display:"flex","flex-flow":"row"}},[n("div",{staticStyle:{"font-size":"16px",margin:"auto"}},[t._v(t._s(e.name+"("+e.price+"元)"))]),t._v(" "),n("div",{staticStyle:{"font-size":"16px",margin:"auto"}},[t._v("   数量:")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:e.count,expression:"p.count",modifiers:{number:!0}}],attrs:{type:"number",placeholder:"数量",onclick:"this.select()"},domProps:{value:e.count},on:{change:function(e){t.fill_input()},input:function(n){n.target.composing||t.$set(e,"count",t._n(n.target.value))},blur:function(e){t.$forceUpdate()}}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.selected,expression:"p.selected"}],attrs:{type:"checkbox"},domProps:{value:e.name,checked:Array.isArray(e.selected)?t._i(e.selected,e.name)>-1:e.selected},on:{change:[function(n){var a=e.selected,i=n.target,s=!!i.checked;if(Array.isArray(a)){var o=e.name,r=t._i(a,o);i.checked?r<0&&(e.selected=a.concat([o])):r>-1&&(e.selected=a.slice(0,r).concat(a.slice(r+1)))}else t.$set(e,"selected",s)},function(e){t.fill_input()}]}})])})),t._v(" "),n("div",{staticClass:"parameters"},[n("div",[n("div",{staticClass:"caption"},[t._v("名称：")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.p_name,expression:"p_name"}],attrs:{placeholder:"名称"},domProps:{value:t.p_name},on:{input:function(e){e.target.composing||(t.p_name=e.target.value)}}})]),t._v(" "),n("div",[n("div",{staticClass:"caption"},[t._v("价格(元)：")]),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.price,expression:"price",modifiers:{number:!0}}],attrs:{type:"number",placeholder:"价格"},domProps:{value:t.price},on:{input:function(e){e.target.composing||(t.price=t._n(e.target.value))},blur:function(e){t.$forceUpdate()}}})])]),t._v(" "),n("div",{staticStyle:{"justify-content":"space-around","margin-top":"10px"}},[t.device_ready&&t.has_mch?n("button",{staticClass:"btn primary",staticStyle:{flex:"1"},on:{click:function(e){e.preventDefault(),t.read_pay_code()}}},[n("h3",{staticStyle:{display:"inline-block",margin:"auto"}},[t._v("\n          读取付款码收款\n        ")])]):t._e(),t._v(" "),t.device_ready?n("button",{staticClass:"btn positive",staticStyle:{flex:"1","margin-top":"10px"},on:{click:function(e){e.preventDefault(),t.read_mch_info()}}},[n("h3",{staticStyle:{display:"inline-block",margin:"auto"}},[t._v("\n          "+t._s(t.has_mch?"更新商户信息":"读取商户信息")+"\n        ")])]):t._e()]),t._v(" "),t.date_num.length>5?n("div",{staticStyle:{"justify-content":"space-around"}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.begin_date,expression:"begin_date"}],staticStyle:{flex:"1"},attrs:{type:"date",placeholder:"起始日期"},domProps:{value:t.begin_date},on:{change:function(e){t.filter_by_date()},input:function(e){e.target.composing||(t.begin_date=e.target.value)}}}),t._v(" "),n("div",{staticClass:"caption"},[t._v("——")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.end_date,expression:"end_date"}],staticStyle:{flex:"1"},attrs:{type:"date",placeholder:"截止日期"},domProps:{value:t.end_date},on:{change:function(e){t.filter_by_date()},input:function(e){e.target.composing||(t.end_date=e.target.value)}}})]):t._e(),t._v(" "),n("span",{staticClass:"his-data",staticStyle:{"margin-top":"10px"}},t._l(t.orders,function(e){return n("div",{staticClass:"order"},[n("div",{staticStyle:{"font-size":"24px"}},[t._v(t._s(e.dt))]),t._v(" "),n("div",{staticClass:"order_info"},[n("div",[t._v(t._s(e.name))]),t._v(" "),n("div",[t._v(t._s(e.price)+"(元)")]),t._v(" "),n("div",[t._v(t._s(e.status))])])])}))])])},staticRenderFns:[]}},265:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("home",{attrs:{app:t.app}}),t._v(" "),n("product",{attrs:{app:t.app}})],1)},staticRenderFns:[]}},266:function(t,e){}});
//# sourceMappingURL=app.108a9407ba36e45c30ca.js.map