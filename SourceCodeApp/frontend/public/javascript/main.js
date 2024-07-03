function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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