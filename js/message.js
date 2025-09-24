// ------------------- MESSAGE MODAL -------------------
function showMessage(message) {
  document.getElementById("messageText").textContent = message;

  document.getElementById("cancelBtn").style.display = "none";
  const okBtn = document.getElementById("okBtn");
  okBtn.textContent = "OK";

  const newOkBtn = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newOkBtn, okBtn);

  $('#messageModal').modal('show');
}

// ------------------- CONFIRM MODAL -------------------
function showConfirm(message) {
  return new Promise((resolve) => {
    const messageText = document.getElementById("messageText");
    const okBtn = document.getElementById("okBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    messageText.textContent = message;

    // Show cancel button
    cancelBtn.style.display = "inline-block";

    // Handlers
    const onOk = () => {
      cleanup();
      resolve(true);
    };
    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    function cleanup() {
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      cancelBtn.style.display = "none"; // hide cancel for normal messages
      $('#messageModal').modal('hide');
    }

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);

    $('#messageModal').modal('show');
  });
}

