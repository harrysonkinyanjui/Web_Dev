document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GET HTML ELEMENTS
    // ==========================================
    const regForm = document.getElementById("regform");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm-password");
    const genderSelect = document.getElementById("gender");
    const dobInput = document.getElementById("dob");
    const countryInput = document.getElementById("country");
    const phoneInput = document.getElementById("phone");
    const bioInput = document.getElementById("bio");

    const successMsg = document.getElementById("successMsg");
    const memberList = document.getElementById("memberList");
    const emptyNote = document.getElementById("emptyNote");
    const countSpan = document.getElementById("count");
    const themeBtn = document.getElementById("theme");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmError = document.getElementById("confirmError");
    const genderError = document.getElementById("genderError");
    const dobError = document.getElementById("dobError");
    const countryError = document.getElementById("countryError");
    const phoneError = document.getElementById("phoneError");
    const bioError = document.getElementById("bioError");

    // Check that essential HTML elements exist
    if (!regForm || !countryInput || !phoneInput || !memberList || !countSpan) {
        console.error(
            "Required HTML elements are missing. Check the IDs in index.html."
        );
        return;
    }
    
// ==========================================
// COUNTRY AND PHONE NUMBER
// ==========================================

const countrySettings = {
    kenya: {
        name: "Kenya",
        code: "+254",
        placeholder: "+254 712 345 678"
    },
    uganda: {
        name: "Uganda",
        code: "+256",
        placeholder: "+256 712 345 678"
    },
    tz: {
        name: "Tanzania",
        code: "+255",
        placeholder: "+255 712 345 678"
    }
};

// Let the user type in the phone field
phoneInput.disabled = false;
phoneInput.value = "";
phoneInput.placeholder = "Select a country first";

countryInput.addEventListener("change", function () {
    const selected = countrySettings[countryInput.value];

    if (selected) {
        // Automatically insert the selected country code
        phoneInput.value = selected.code + " ";

        // Update the example shown in the field
        phoneInput.placeholder = selected.placeholder;

        // Put the cursor after the country code
        phoneInput.focus();
        phoneInput.setSelectionRange(
            phoneInput.value.length,
            phoneInput.value.length
        );
    } else {
        phoneInput.value = "";
        phoneInput.placeholder = "Select a country first";
    }

    if (phoneError) {
        phoneError.textContent = "";
    }

    phoneInput.classList.remove("invalid");
});

 
    // ==========================================
    // 3. DARK MODE AND LIGHT MODE
    // ==========================================
    if (themeBtn) {
        function updateThemeButton() {
            const darkMode = document.body.classList.contains("dark");

            themeBtn.textContent = darkMode
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";
        }

        updateThemeButton();

        themeBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark");
            updateThemeButton();
        });
    }

    // ==========================================
    // 4. CLEAR ERRORS WHEN FIELDS CHANGE
    // ==========================================
    const fieldMappings = [
        [nameInput, nameError],
        [emailInput, emailError],
        [passwordInput, passwordError],
        [confirmInput, confirmError],
        [genderSelect, genderError],
        [dobInput, dobError],
        [countryInput, countryError],
        [phoneInput, phoneError],
        [bioInput, bioError]
    ];

    fieldMappings.forEach(function ([input, error]) {
        if (input) {
            function clearFieldError() {
                input.classList.remove("invalid");
                if (error) error.textContent = "";
            }

            input.addEventListener("input", clearFieldError);
            input.addEventListener("change", clearFieldError);
        }
    });

    // ==========================================
    // 5. MEMBER COUNTER
    // ==========================================
    function updateMemberCount() {
        const members = memberList.querySelectorAll(".member-item");
        countSpan.textContent = members.length;

        if (emptyNote) {
            emptyNote.style.display = members.length === 0 ? "block" : "none";
        }
    }

    updateMemberCount();

    // ==========================================
    // 6. FORM SUBMISSION AND VALIDATION
    // ==========================================
    regForm.addEventListener("submit", function (event) {
        event.preventDefault();

        fieldMappings.forEach(function ([input, error]) {
            if (input) input.classList.remove("invalid");
            if (error) error.textContent = "";
        });

        if (successMsg) {
            successMsg.textContent = "";
            successMsg.classList.add("hidden");
        }

        let isValid = true;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        const gender = genderSelect.value;
        const dob = dobInput.value;
        const countryKey = countryInput.value;
        const phone = phoneInput.value.trim();
        const bio = bioInput.value.trim();

        function showError(input, errorElement, message) {
            if (input) input.classList.add("invalid");
            if (errorElement) errorElement.textContent = message;
            isValid = false;
        }

        // Validate name
        if (name.length < 2) {
            showError(
                nameInput,
                nameError,
                "Please enter your full name (at least 2 characters)."
            );
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showError(emailInput, emailError, "Please enter a valid email address.");
        }

        // Validate password
        if (password.length < 6) {
            showError(
                passwordInput,
                passwordError,
                "Password must be at least 6 characters."
            );
        }

        // Confirm password
        if (!confirmPassword || confirmPassword !== password) {
            showError(confirmInput, confirmError, "Passwords do not match.");
        }

        // Validate gender
        if (!gender) {
            showError(genderSelect, genderError, "Please select your gender.");
        }

        // Validate date of birth
        if (!dob) {
            showError(dobInput, dobError, "Please select your date of birth.");
        } else {
            const birthDate = new Date(dob + "T00:00:00");
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
                showError(
                    dobInput,
                    dobError,
                    "Please enter a valid date that is not in the future."
                );
            }
        }

        // Validate country
        const country = countrySettings[countryKey];

        if (!country) {
            showError(countryInput, countryError, "Please select a country.");
        }

        // Validate phone number for the selected country
        const phonePatterns = {
            kenya: /^\+254\s?7\d{2}\s?\d{3}\s?\d{3}$/,
            uganda: /^\+256\s?7\d{2}\s?\d{3}\s?\d{3}$/,
            tz: /^\+255\s?7\d{2}\s?\d{3}\s?\d{3}$/
        };

        if (!country) {
            showError(
                phoneInput,
                phoneError,
                "Please select a country before entering your phone number."
            );
        } else if (!phone) {
            showError(phoneInput, phoneError, "Please enter your phone number.");
        } else if (!phonePatterns[countryKey].test(phone)) {
            showError(
                phoneInput,
                phoneError,
                "Enter a valid number, e.g. " + country.placeholder + "."
            );
        }

        // Validate biography
        if (bio.length < 5) {
            showError(
                bioInput,
                bioError,
                "Please enter a short bio of at least 5 characters."
            );
        }

        // Stop if any field is invalid
        if (!isValid) return;

        // ==========================================
        // 7. ADD MEMBER TO THE LIST
        // ==========================================
        const li = document.createElement("li");
        li.className = "member-item";

        const info = document.createElement("div");
        info.className = "info";

        const memberName = document.createElement("strong");
        memberName.textContent = name;

        const memberDetails = document.createElement("p");
        memberDetails.textContent =
            email + " | " + country.name + " | " + phone;

        const memberBio = document.createElement("p");
        memberBio.textContent = "Bio: " + bio;

        info.appendChild(memberName);
        info.appendChild(memberDetails);
        info.appendChild(memberBio);

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove";
        removeBtn.textContent = "Remove";

        removeBtn.addEventListener("click", function () {
            li.remove();
            updateMemberCount();
        });

        li.appendChild(info);
        li.appendChild(removeBtn);
        memberList.appendChild(li);

        updateMemberCount();

        // Show success message
        if (successMsg) {
            successMsg.textContent = "Successfully registered " + name + "!";
            successMsg.classList.remove("hidden");
        }

        // Reset form
        regForm.reset();

        // Disable phone until another country is selected
        phoneInput.disabled = true;
        phoneInput.value = "";
        phoneInput.placeholder = "Select a country first";

        // Clear validation messages
        fieldMappings.forEach(function ([input, error]) {
            if (input) input.classList.remove("invalid");
            if (error) error.textContent = "";
        });
    });

    console.log("Registration system loaded successfully.");
});
