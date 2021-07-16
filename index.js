var langJson = {
  cn: {
    tit: '寻找测试 (UCC) 币？',
    p1: '填写您的钱包地址以获得500 UCC，每钱包地址只能获取一次',
    p2: '我们会在每天的8点，12点，16点，进行测试UCC的发放（迪拜时间）',
    placeholder: '请输入测试钱包地址',
    btn: '提交',
    message: '领取错误，请检查钱包地址后重试'
  },
  en: {
    tit: 'Looking for Test (UCC) Coins？',
    p1: 'Fill out your test wallet address to receive 500 UCC , a purse can only be used once',
    p2: 'We will test UCC distribution daily at 8am,12am,4pm（Dubai Time）',
    placeholder: 'Test wallet address',
    btn: 'SUBMIT',
    message: 'Receive a mistake, please check the wallet address and try again'
  }
}

var app = new Vue({
  el: '#app',
  data: {
    langType: 'cn',
    lang: langJson['cn'],
    address: '',
    MsgVisible: false,
    message: '',
    timer: null,
    loading: false
  },
  mounted () {
  },
  methods: {
    submit () {
      if (this.loading) {
        return
      }
      var that = this
      var address = this.address.toLowerCase()
      if (!address) {
        this.showMsg(this.lang['placeholder'])
        return
      }
      var reg = /^[a-z0-9]{42}$/i
      if (!reg.test(address))  {
        this.showMsg(this.lang['message'])
        return
      }
      this.loading = true
      axios({
        url: '//49.73.154.68:50324/wallet',
        method: 'post',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          address: address
        }
      })
      .then(function (response) {
        console.log(response)
        that.loading = false
        var data = response.data
        if (data && data.info) {
          that.showMsg(data.info)
        }
      })
      .catch(function (error) {
        console.log(error.response);
        var data = error.response.data
        if (data && data.info) {
          that.showMsg(data.info)
        } else {
          that.showMsg(that.lang['message'])
        }
        that.loading = false
      });
    },
    switchLang: function () {
      this.langType = this.langType === 'cn' ? 'en' : 'cn'
      this.lang = langJson[this.langType]
    },

    showMsg: function (msg) {
      var that = this
      if (this.timer) {
        this.MsgVisible = false
        clearTimeout(this.timer)
        this.timer = null
      }
      this.message = msg
      this.MsgVisible = true
      this.timer = setTimeout(function () {
        that.MsgVisible = false
      }, 3000)
    } 
  }
})