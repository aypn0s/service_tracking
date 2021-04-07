const myAlert = document.querySelector('.alert')
const bsAlert = new bootstrap.Alert(myAlert)
setTimeout(() => bsAlert.close(), 3000)