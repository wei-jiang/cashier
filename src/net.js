import _ from 'lodash'
import moment from "moment";
import io from 'socket.io-client';

class Net {
  constructor() {
    document.addEventListener('deviceready', ()=> {
      this.sock = io('https://pay.cninone.com');      
      this.sock.on('connect', this.on_connect.bind(this));
      this.sock.on('refresh_file_list', this.on_refresh_file_list.bind(this));
      // this.sock.on('disconnect', (reason) => {
      //   alert('disconnect 11111111111111111111111111111'+JSON.stringify(reason) )
      // });
      // this.sock.on('error', (error) => {
      //   alert('error 11111111111111111111111111111'+JSON.stringify(error) )
      // });
    });
    
  }
  register_ui_evt() {
    vm.$on("notify_seller_status", data => {
      this.emit('notify_seller_status', data)
    });
  }

  on_connect() {
    // this.register_ui_evt()
    // alert('on_connect pay server')
  }

  on_refresh_file_list(data) {
    vm.$emit('refresh_file_list', '');
  }
  emit(name, data, cb) {
    if (this.sock) {
      this.sock.emit(name, data, cb)
    }
  }
  
}
export default new Net;