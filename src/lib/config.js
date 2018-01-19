/*
    * vue测试项目全局配置文件
*/
import Vue from 'vue';
import axios from 'axios';
import md5 from 'md5';
import CryptoJS from 'crypto-js'
import { Base64 } from 'js-base64'
import { JSEncrypt } from 'jsencrypt'

const KEY = 'CHINESE_M#!@_2342##@1%@#$@%1121^$%$';
// let host = window.location.protocol+"//"+window.location.host+"/"+'investApp/';
// let host="https://appinterface.minxindai.com/investApp/" //线上
// let host= "https://192.168.9.208:8440/investApp/"
// let host= "http://192.168.9.208:8441/investApp/"
let host = "http://testapp.minxindai.com/investApp/"//测试环境
// let host = "http://10.10.81.31:8083/investApp/"//开发本机
// let host = "http://10.10.81.31:8083/"
// let host = "http://10.10.99.241:8180/investApp/"
// let host = "https://uatapp.minxindai.com/investApp/"//188的
let phonetest = true;

//重定向跳转
//
let refreshurl = location.origin + location.pathname + 'php/callbackrefresh.php?to='
let signcallback = location.origin + location.pathname + 'php/signcallback.php'
//交易密码对key加密
let getKEYMD5 = function(data) {
  return md5(KEY + json2String(data).replace(/\=|\&/g,'') + KEY).toUpperCase()
}
/**
 * 先AES加密，再base64加密
 */
let cryptoBase64 = function (value) {
  let key  = CryptoJS.enc.Utf8.parse("%&^#hdyel1234f86")
  let iv   = CryptoJS.enc.Utf8.parse("0102030405060708")
  let encrypted = CryptoJS.AES.encrypt(value, key, {iv:iv,mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
  return Base64.encode(encrypted.toString())
}

let RSAkey = function (value) {
  if (typeof JSEncrypt !== 'undefined') {
    const PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCA2IXKPAPso7UaUS2fhtv2TeiNhAcxB0efooR+imLAWZcDxTZTtiwJiORHBklhHwNEvuYm2O5CvoSQml97xY7wOD56c7aPlOo9ioN2NFt8EvI7eyiT8LYCXhHglv8Cn6kFW3qCPwxzr7Y2A6z6PMa4Gt6p9l6G2B9nIOsryGiPcwIDAQAB"
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(PUBLIC_KEY)
    let encrypted = encrypt.encrypt(value)
    return encrypted.replace(/\+/g, ' ').replace(/\&/g, '%26')
  }
}

//  * 统一接口管理*/
let json2String = (jsonData) => {
    let strArr = [];
    for (let k in jsonData) {
        if (typeof jsonData[k] == 'object') {
            json2String(jsonData[k])
        } else {
            strArr.push(k + "=" + jsonData[k]);
        }
    }
    strArr.sort()
    return strArr.join("&");
}
//微信分享 待检测
//前端返回会暴露appid和appsecret，而且存在跨域问题，需要后台提供接口返回
let getSign = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(location.origin + location.pathname + 'php/get_config.php?url=' + url).then(res => {
            resolve(res.data)
        })
        // const AppId = 'wx80d1480018310265'//'wxfb508b6dd635272a'
        // const AppSecret = 'afc1f644db68c44d1e54dc1157ee9f11'//'ffbe71e5a800d952bd67fcc73e2254df'
        // let url1 = 'https://api.weixin.qq.com/cgi-bin/token'
        // let url2 = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
        // $.get(url1, {
        //         'grant_type': 'client_credential',
        //         'appid': AppId,
        //         'secret': AppSecret
        //     }, (data) => {
        //         $.get(url2, {
        //             'access_token': data.access_token,
        //             'type': 'jsapi'
        //         }, (res) => {
        //             let obj = sign(res.ticket, url)
        //             resolve(Object.assign(obj, {'appId': AppId}))
        //         })
        //     })
    })
}


let api = {
    login:"webLogin/login.mxd",//登录
    regUser:"user/saveUser.mxd",//注册
    regGetMsg:"user/findPhoneCaptcha.mxd",//根据手机号获取验证码
    regTel:"user/findPhone.mxd",//验证手机号码
    banner:"cms/findBannerImageByNodeId.mxd",//banner图
    getInvestTotal:"appUser/getInvestTotal.mxd", //首页公告
    newFindHomePageRecommand:"borrowHomePage/NewFindHomePageRecommand.mxd", //首页推荐标
    findAccountMsg:"personalInfo/findAccountMsg.mxd", //获取实名信息
    findAccountCartMsg: "app/accountCard/findAccountCartMsg.mxd",//APP存管账户绑卡信息
    openAccount:"userAccount/openAccount.mxd",//存管开户
    checkRecharge:'depositSwitch/toCheckRechargeSwitch.mxd',//检查充值开关
    findAccount:'appAccount/findAccount.mxd',//总资产明细
    getYestday:'appAccount/getYestdayIncomeInfo.mxd',//我的账户-昨日收益及明细
    getAlready:'appAccount/getAlreadyIncomeInfo.mxd',//我的账户-累计收益及明细
    availableLog:'accountLog/findAppAccountLog.mxd',//我的-可用余额金额明细
    availableLogcg:'app/userAccountLog/findAppAccountLog.mxd',//存管可用金额明细
    userBankBefore:'userBankCard/findBankCardsInfo.mxd',//我的银行卡，解绑银行卡展示银行卡信息
    modifyPassword: 'user/modifyPassword.mxd',//修改登录密码
    verifyUserNameCardNoAndCaptcha: 'authApp/verifyUserNameCardNoAndCaptcha.mxd',//验证用户名、身份证号、验证码是否通过
    setTransPwdH5: 'userTransPwd/setTransPwdH5.mxd',//开户设置密码
    checkPayPassword: 'userPayPW/checkPayPassword.mxd',//旧账户是否设置了交易密码
    changePayPassword: 'userPayPW/changePayPassword.mxd',//旧账户修改交易密码
    findBorrowListPag: "borrowApp/newFindBorrowListPag.mxd",//投资列表
    findConditionList: "borrowApp/findConditionList.mxd",//投资列表筛选产品
    findBorrowInfo: "borrow/findBorrowInfo.mxd",//优选标详情
    checkBorrowStatus: 'borrow/checkBorrowStatus.mxd',//检查优选标状态
    findBorrowSetInfo: "appBorrowSet/findBorrowSetInfo.mxd",//VIP标详情
    checkBorrowSetStatus: "appBorrowSet/checkBorrowSetStatus.mxd",//检查VIP标状态
    getRespectIncome: 'invest/getRespectIncome.mxd',//预期收益计算
    getBasicDetailState: 'borrowApp/getBasicDetailState.mxd',//标基本信息
    findBorrowRule: 'app/borrowRule/findBorrowRule.mxd',//vip标协议
    getBorrowUserInfo: 'borrow/app/getBorrowUserInfo.mxd',//标借款人信息
    findBorrowInvestVoList: 'borrow/findBorrowInvestVoList.mxd',//优选标投资人记录
    getSetInvestList: 'appBorrowSet/getSetInvestList.mxd',//vip标投资人记录
    findBalanceCaption: 'app/withdraw/findBalanceCaption.mxd',//获取存管账户可用余额
    couponCanUsed: 'couponSwitch/couponCanUsed.mxd',//是否显示选券行
    findAllCanUseCouponTicket: 'couponTicket/findAllCanUseCouponTicket.mxd',//查找可用优惠券
    updateCouponTicketUsername: 'couponTicket/updateCouponTicketUsername.mxd',//兑换劵功能（劵和用户绑定）
    findInvestNoticeConf: 'borrowApp/findInvestNoticeConf.mxd',//投资按钮下方文本
    getInvestFormParams: 'invest/getInvestFormParams.mxd',//存管账户抢投（优选标）
    investSeptadTicket: 'invest/app/investSeptadTicket.mxd',//非存管抢投（U+标）
    addSetInvest: 'appSetInvest/addSetInvest.mxd',//非存管抢投（VIP标）
    investRecordListCg : "investRecord/investRecordListCg.mxd", //投资管理散标列表
    incomeRecordListCg : "investRecord/incomeRecordListCg.mxd",//投资管理散标详情
    getUserInvestTrack : "userBorrowSet/getUserInvestTrack.mxd",//投资管理VIP列表
    getInvestedBorrowSetDetail : "userBorrowSet/getInvestedBorrowSetDetail.mxd",//投资管理VIP详情
    findAuth:'auth/findAuth.mxd',//查看认证信息
    findOnlyOneCardInfo : "bankCard/findOnlyOneCardInfo.mxd",//旧账户充值-获取绑卡信息
    findAccountold : "account/findAccount.mxd", //旧账户充值-获取余额
    applyRecharge : "recharge/applyRecharge.mxd",//旧账户充值
    sumRecharge : "recharge/sumRecharge.mxd", //旧账户充值记录-获取充值总额
    rechargeList : "recharge/rechargeList.mxd",//旧账户充值记录-获取充值列表
    findBankMsgByCardNo : "bankCard/checkBankCardNo.mxd", //旧账户银行卡号前六位查询开户行
    findBankNameListOfYeePay:'bankCard/findBankNameListOfYeePay.mxd',//旧账户银行列表
    findBankMsgByCard : "userAccount/findBankMsgByCardNo.mxd", //存管账户充值-根据银行卡获取限额说明
    findJindunBankList : "userAccount/findJindunBankList.mxd", //存管账户充值-银行限额表
    appToRechargeNew : "app/depositRecharge/appToRechargeNew.mxd",//存管账户充值
    rechargeListcg : "app/depositRecharge/rechargeList.mxd",//存管账户充值-获取充值记录
    bankcardold:'bankCard/addBankCardOnlyOneCard.mxd',//旧帐号绑定银行卡
    checkStatusAndCount:'authApp/findAuthStatusAndCount.mxd',//查询用户的 认证状态 和认证次数
    bankcardcg:'userBankCard/userBindingCard.mxd',//存管账户绑卡
    provingCaptcha:'user/provingCaptcha.mxd',//比较验证码否正确
    findAllCouponTicketNew:'couponTicket/findAllCouponTicketNew.mxd',//我的券
    queryRedEnvellope:'redenvelope/queryRedEnvellope.mxd',//现金红包
    findPhoneFriend:'phoneFriend/findPhoneFriend.mxd',//邀请好友-邀请好友明细
    findPhoneFriendContribute:'phoneFriend/findPhoneFriendContribute.mxd',//邀请好友-查询邀请好友贡献
    findInterfaceSwitchByType:'interfaceSwitch/findInterfaceSwitchByType.mxd',//邀请好友-详细规则
    getUserEncryptionUrl:'phoneFriend/getUserEncryptionUrl.mxd',//获取加密链接（手机端）
    updateTel:'personalInfo/updateTel.mxd',//修改用户手机号
    findPhoneRanking:"phoneFriend/findPhoneRanking.mxd",//2016邀请好友排名
    addRealnameAuth:'auth/app/addRealnameAuth.mxd',//实名认证接口
    findUserByEmailandPhone:'user/findUserByEmailandPhone.mxd',//获取用户验证过的手机号
    updatePassword:'user/updatePassword.mxd',//账户安全-手机号登录密码
    findAppConfLink:'borrowApp/findAppConfLink.mxd',//协议接口
    packageJinDunDate:'assignmentAutoSign/packageJinDunDate.mxd',//开通自动债转签约
}

/*
    * 统一数据请求
    * {key, data,method, callback}
*/
export const getData = function (options) {
    let key = options.key;
    let data = json2String(options.data);
    let method = options.method || 'get';
    let callback = options.callback || function () { };
    let mxd = md5(api[key] + '?' + data + KEY);
    axios[method](host + api[key], data + '&mxd=' + mxd)
        .then(function (res) {
            callback && callback(res.data)
        })
}

/**
* 客户端检测
*/
const UA = navigator.userAgent
const isIpad = /(iPad).*OS\s([\d_]+)/.test(UA)
const isIpod = /(iPod)(.*OS\s([\d_]+))?/.test(UA)
const isIphone = !isIpad && /(iPhone\sOS)\s([\d_]+)/.test(UA)
const isIos = isIpad || isIpod || isIphone
const isAndroid = /(Android);?[\s\/]+([\d.]+)?/.test(UA)
const isWechat = /micromessenger/i.test(UA)
const isQQ = /QQ\/([\d\.]+)/.test(UA)
const isQQMBrowser = /MQQBrowser/i.test(UA) && !isWechat && !isQQ
const isUCMBrowser = /UCBrowser/i.test(UA)

const BrowserInfo = {
    userAgent: UA.toLowerCase(),
    isAndroid,
    isIphone,
    isIpad,
    isWeixin: isWechat,
    isQQMBrowser,
    isUCMBrowser,
}
export default {
    phonetest,
    refreshurl,
    signcallback,
    getSign,
    getKEYMD5,
    cryptoBase64,
    RSAkey,
    getData,
    BrowserInfo
}; 
