function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// kiểm tra mật khẩu
document.getElementById('password2').addEventListener('input', function () {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('password2').value;
    var errorElement = document.getElementById('password-error');
    var submitBtn = document.getElementById('submit-btn');

    if (password !== confirmPassword) {
      errorElement.textContent = "Passwords do not match";
      submitBtn.disabled = true;
    } else {
      errorElement.textContent = "";
      submitBtn.disabled = false;
    }
  });


  function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

var closeButton = document.getElementsByClassName('close')[0];

closeButton.onclick = function () {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
}
function closeModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = 'none';
}
