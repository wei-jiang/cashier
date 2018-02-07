
import Noty from 'noty'
import _ from 'lodash'
import moment from 'moment'

const PAY_TYPE = {
    WX_GZH:     0b00000001,
    WX_ZS:      0b00000010,
    WX_FS:      0b00000100,
    WX_H5:      0b00001000,
    ALI_WAP:    0b00010000,
    ALI_ZS:     0b00100000,
    ALI_FS:     0b01000000,
    ALI_PAGE:   0b10000000,
}
function ability_title(ability){
    let capable = ''
    if(ability & PAY_TYPE.WX_FS) capable = '微信';
    if(ability & PAY_TYPE.ALI_FS) {
        if(capable) capable += '/支付宝'
        else capable = '支付宝'
    }
    return capable
}
function is_wx_capable(ability){
    return ability & PAY_TYPE.WX_FS
}
function is_ali_capable(ability){
    return ability & PAY_TYPE.ALI_FS
}
function hash_str(str){
    return str.split('').map(v=>v.charCodeAt(0)).reduce((a,v)=>a+((a<<7)+(a<<3))^v).toString(16)
}
export default {
    ability_title,
    is_wx_capable,
    is_ali_capable,
    hash_str
}