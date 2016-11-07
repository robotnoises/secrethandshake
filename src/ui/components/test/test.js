let bridge = window.shbridge;

var vm = new Vue({
  el: '#testharness',
  data: {
    passphrase: ''
  },
  methods: {
    setPassphraseTest: function (event) {
      bridge.setPassphraseTest(this.passphrase);
    }
  }
});