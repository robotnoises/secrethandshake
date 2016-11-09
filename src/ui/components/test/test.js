let bridge = window.shbridge;

var vm = new Vue({
  el: '#testharness',
  data: {
    passphrase: '',
    setPassphraseTestResult: ''
  },
  methods: {
    setPassphraseTest: function (event) {
      bridge.setPassphraseTest(this.passphrase);
    }
  }
});

// Notifications

function receiveMessage(notifcation) {
  if (notifcation.data.type === 'setPassphraseTestResult') {
    vm.setPassphraseTestResult = notifcation.data.value;
  }
}

window.addEventListener("message", receiveMessage, false);