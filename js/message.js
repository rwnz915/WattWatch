function showMessage(message) {
  document.getElementById("errorMessage").textContent = message;
  $('#errorModal').modal('show');
}
