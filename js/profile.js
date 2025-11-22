function initProfilePage() {
  const user = getUserInfo();
  if (!user) return;

  document.getElementById("displayName").textContent = user.firstName + " " + user.lastName;
  document.getElementById("displayEmail").textContent = user.email;
  
  if (user.createdAt) {
    const createdDate = new Date(user.createdAt);
    document.getElementById("accountCreated").textContent = createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
  }

  if (user.isGoogleUser) {
    const emailBtn = document.getElementById("changeEmailBtn");
    const passwordBtn = document.getElementById("changePasswordBtn");
    if (emailBtn) emailBtn.style.display = "none";
    if (passwordBtn) passwordBtn.style.display = "none";
  }

  initProfilePhoto(user);

  // Edit Name
  document.getElementById("editBtn").addEventListener("click", async () => {
    const result = await showEditModal("name", user);
    if (result) {
      try {
        const res = await fetch("https://wattwatch-backend.onrender.com/api/auth/update-name", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            firstName: result.firstName,
            lastName: result.lastName,
          }),
        });

        if (res.ok) {
          user.firstName = result.firstName;
          user.lastName = result.lastName;
          document.getElementById("displayName").textContent =
            result.firstName + " " + result.lastName;
          
          // update topbar
          const topbarName = document.getElementById("userName");
          if (topbarName) topbarName.textContent = `${user.firstName}`;
        
          // update storage
          if (localStorage.getItem("userInfo")) localStorage.setItem("userInfo", JSON.stringify(user));
          if (sessionStorage.getItem("userInfo")) sessionStorage.setItem("userInfo", JSON.stringify(user));

          showMessage("Profile name updated successfully!");
        } else {
          showMessage("Failed to update name.");
        }
      } catch (err) {
        showMessage("Error updating name: " + err.message);
      }
    }
  });

  // Change Email
  document.getElementById("changeEmailBtn").addEventListener("click", async () => {
    const result = await showEditModal("email", { email: user.email });
    if (result) {
      try {
        const res = await fetch("https://wattwatch-backend.onrender.com/api/auth/update-email", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            newEmail: result.email,
          }),
        });

        const data = await res.json(); // parse backend response

        if (res.ok && data.success) {
          user.email = result.email;
          document.getElementById("displayEmail").textContent = result.email;

          // update storage
          if (localStorage.getItem("userInfo")) localStorage.setItem("userInfo", JSON.stringify(user));
          if (sessionStorage.getItem("userInfo")) sessionStorage.setItem("userInfo", JSON.stringify(user));

          showMessage("Email updated successfully!");
        } else {
          showMessage(data.message || "Failed to update email.");
        }
      } catch (err) {
        showMessage("Error updating email: " + err.message);
      }
    }
  });

  // Change Password
  document.getElementById("changePasswordBtn").addEventListener("click", async () => {
    const result = await showEditModal("password");
    if (result) {
      if (result.newPass !== result.confirm) {
        showMessage("Passwords do not match!");
        return;
      }
      try {
        const res = await fetch("https://wattwatch-backend.onrender.com/api/auth/change-password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            currentPassword: result.current,
            newPassword: result.newPass,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          showMessage("Password changed successfully!");
        } else {
          showMessage(data.message || "Failed to change password.");
        }
      } catch (err) {
        showMessage("Error changing password: " + err.message);
      }
    }
  });


}

// ------------------- PROFILE PHOTO -------------------
function initProfilePhoto(user) {
  const profilePreview = document.getElementById('profilePreview');
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const modal = new bootstrap.Modal(document.getElementById('photoModal'));
  const modalPreview = document.getElementById('modalPreview');
  const modalFileInput = document.getElementById('modalFileInput');
  const restoreDefaultBtn = document.getElementById('restoreDefaultBtn');
  const savePhotoBtn = document.getElementById('savePhotoBtn');
  const cancelPhotoBtn = document.querySelector('#photoModal .btn-secondary');
  const topbarImg = document.querySelector(".img-profile.rounded-circle");

  const defaultProfile = "img/undraw_profile.svg";

  // Initialize preview
  profilePreview.src = user.profileImage || defaultProfile;
  if (topbarImg) topbarImg.src = profilePreview.src;

  // Open modal
  changePhotoBtn.addEventListener('click', () => {
    modalPreview.src = profilePreview.src || defaultProfile;
    modalFileInput.value = "";
    modal.show();
  });

  // Cancel button
  cancelPhotoBtn.addEventListener('click', () => {
    modal.hide();
  });

  // Preview selected image
  modalFileInput.addEventListener('change', () => {
    const file = modalFileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => modalPreview.src = e.target.result;
      reader.readAsDataURL(file);
    }
  });

  // Restore default
  restoreDefaultBtn.addEventListener('click', () => {
    modalPreview.src = defaultProfile;
    modalFileInput.value = "";
  });

  // Save photo
  savePhotoBtn.addEventListener('click', async () => {
    let imageData = modalPreview.src === defaultProfile ? null : modalPreview.src;

    try {
      // Update frontend
      profilePreview.src = modalPreview.src;
      if (topbarImg) topbarImg.src = profilePreview.src;

      // Send to backend
      const res = await fetch("https://wattwatch-backend.onrender.com/api/auth/update-profile-image", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.id, profileImage: imageData })
      });

      const data = await res.json();
      if (res.ok) {
        user.profileImage = imageData;

        // Update storage
        if (localStorage.getItem("userInfo")) localStorage.setItem("userInfo", JSON.stringify(user));
        if (sessionStorage.getItem("userInfo")) sessionStorage.setItem("userInfo", JSON.stringify(user));

        showMessage(imageData ? "Profile photo updated successfully!" : "Profile photo reset to default!");
        modal.hide();
      } else {
        showMessage(data.message || "Failed to update photo.");
      }

    } catch (err) {
      showMessage("Error updating photo: " + err.message);
    }
  });
}

// ------------------- EDIT MODAL -------------------
function showEditModal(type, currentValue = {}) {
  return new Promise((resolve) => {
    const body = document.getElementById("editModalBody");
    const saveBtn = document.getElementById("editSaveBtn");
    const cancelBtn = document.getElementById("editCancelBtn");

    // Build form HTML
    let formHtml = "";
    if (type === "name") {
      formHtml = `
        <label>First Name</label>
        <input type="text" id="editFirstName" class="form-control mb-1" value="${currentValue.firstName || ""}">
        <div id="firstNameError" class="text-danger small mb-2" style="display:none;">First Name is required</div>

        <label>Last Name</label>
        <input type="text" id="editLastName" class="form-control mb-1" value="${currentValue.lastName || ""}">
        <div id="lastNameError" class="text-danger small mb-2" style="display:none;">Last Name is required</div>
      `;
    } else if (type === "email") {
      formHtml = `
        <label>New Email</label>
        <input type="email" id="editEmail" class="form-control mb-1" value="${currentValue.email || ""}">
        <div id="emailError" class="text-danger small mb-2" style="display:none;">Email is required</div>
      `;
    } else if (type === "password") {
      formHtml = `
        <label>Current Password</label>
        <input type="password" id="currentPassword" class="form-control mb-1">
        <div id="currentError" class="text-danger small mb-2" style="display:none;">Current Password is required</div>

        <label>New Password</label>
        <input type="password" id="newPassword" class="form-control mb-1">
        <div id="newError" class="text-danger small mb-2" style="display:none;">New Password is required</div>

        <label>Confirm New Password</label>
        <input type="password" id="confirmPassword" class="form-control mb-1">
        <div id="confirmError" class="text-danger small mb-2" style="display:none;">Confirm Password is required</div>
      `;
    }

    body.innerHTML = formHtml;

    // Validation function (runs only on Save)
    function validate() {
      let valid = true;

      const fieldsMap = {
        name: ["editFirstName", "editLastName"],
        email: ["editEmail"],
        password: ["currentPassword", "newPassword", "confirmPassword"],
      };

      const fields = fieldsMap[type] || [];

      fields.forEach((id) => {
        const input = document.getElementById(id);
        const errorDiv = document.getElementById(
          (id === "currentPassword" ? "current" :
          id === "newPassword" ? "new" :
          id === "confirmPassword" ? "confirm" :
          id.replace("edit", "").replace(/^\w/, c => c.toLowerCase())) + "Error"
        );

        if (!input.value.trim()) {
          input.style.border = "1px solid red";
          if (errorDiv) errorDiv.style.display = "block";
          valid = false;
        } else {
          input.style.border = "";
          if (errorDiv) errorDiv.style.display = "none";
        }
      });

      return valid;
    }

    const onSave = () => {
      if (!validate()) return; // stop if any field is empty

      let result = null;
      if (type === "name") {
        result = {
          firstName: document.getElementById("editFirstName").value.trim(),
          lastName: document.getElementById("editLastName").value.trim(),
        };
      } else if (type === "email") {
        result = { email: document.getElementById("editEmail").value.trim() };
      } else if (type === "password") {
        result = {
          current: document.getElementById("currentPassword").value,
          newPass: document.getElementById("newPassword").value,
          confirm: document.getElementById("confirmPassword").value,
        };
      }

      cleanup();
      resolve(result);
    };

    const onCancel = () => {
      cleanup();
      resolve(null);
    };

    function cleanup() {
      saveBtn.removeEventListener("click", onSave);
      cancelBtn.removeEventListener("click", onCancel);
      $('#editModal').modal('hide');
    }

    saveBtn.addEventListener("click", onSave);
    cancelBtn.addEventListener("click", onCancel);

    $('#editModal').modal('show');
  });
}


