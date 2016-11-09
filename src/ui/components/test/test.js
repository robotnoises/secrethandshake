let bridge = window.shbridge;

var vm = new Vue({
  el: '#testharness',
  data: {
    passphrase: '',
    setPassphraseTestResult: bridge.setPassphraseTestResult
  },
  methods: {
    setPassphraseTest: function (event) {
      bridge.setPassphraseTest(this.passphrase);
    }
  }
});