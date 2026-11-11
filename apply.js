/* ============================================================
   HER BODY CLUB — Apply Page JavaScript
   Handles: multi-step form, validation, Google Sheets submission
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// CONFIGURATION — Paste your Google Apps Script Web App URL here
// after deploying the Code.gs script to Google Apps Script.
// ─────────────────────────────────────────────────────────────
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';


// ─────────────────────────────────────────────────────────────
// STEP NAVIGATION
// ─────────────────────────────────────────────────────────────
let currentStep = 1;
const totalSteps = 3;

function nextStep(step) {
  if (!validateStep(step)) return;

  // Mark current step as done
  document.querySelector(`[data-step="${step}"]`).classList.remove('active');
  document.querySelector(`[data-step="${step}"]`).classList.add('done');

  // Show next step
  document.getElementById(`step${step}`).classList.add('hidden');
  document.getElementById(`step${step + 1}`).classList.remove('hidden');

  // Activate next progress dot
  document.querySelector(`[data-step="${step + 1}"]`).classList.add('active');

  currentStep = step + 1;

  // Scroll to top of form
  document.querySelector('.apply-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep(step) {
  // Deactivate current
  document.querySelector(`[data-step="${step}"]`).classList.remove('active');
  document.getElementById(`step${step}`).classList.add('hidden');

  // Re-activate previous
  const prevStepEl = document.querySelector(`[data-step="${step - 1}"]`);
  prevStepEl.classList.remove('done');
  prevStepEl.classList.add('active');

  document.getElementById(`step${step - 1}`).classList.remove('hidden');
  currentStep = step - 1;

  document.querySelector('.apply-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ─────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────
function validateStep(step) {
  let valid = true;

  if (step === 1) {
    valid = validateField('firstName', 'firstNameError') && valid;
    valid = validateField('lastName', 'lastNameError') && valid;
    valid = validateEmail('email', 'emailError') && valid;
    valid = validateSelect('age', 'ageError') && valid;
  }

  if (step === 2) {
    valid = validateRadioGroup('primaryGoal', 'primaryGoalError') && valid;
    valid = validateSelect('trainingExperience', 'trainingExperienceError') && valid;
    valid = validateField('currentChallenge', 'currentChallengeError') && valid;
  }

  if (step === 3) {
    valid = validateRadioGroup('trainingLocation', 'trainingLocationError') && valid;
    valid = validateSelect('daysPerWeek', 'daysPerWeekError') && valid;
    valid = validateField('injuries', 'injuriesError') && valid;
    valid = validateConsent('consent', 'consentError') && valid;
  }

  return valid;
}

function validateField(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field.value.trim()) {
    field.classList.add('error');
    error.classList.add('show');
    return false;
  }
  field.classList.remove('error');
  error.classList.remove('show');
  return true;
}

function validateEmail(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(field.value.trim())) {
    field.classList.add('error');
    error.classList.add('show');
    return false;
  }
  field.classList.remove('error');
  error.classList.remove('show');
  return true;
}

function validateSelect(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field.value) {
    field.classList.add('error');
    error.classList.add('show');
    return false;
  }
  field.classList.remove('error');
  error.classList.remove('show');
  return true;
}

function validateRadioGroup(groupName, errorId) {
  const selected = document.querySelector(`input[name="${groupName}"]:checked`);
  const error = document.getElementById(errorId);
  if (!selected) {
    error.classList.add('show');
    return false;
  }
  error.classList.remove('show');
  return true;
}

function validateConsent(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field.checked) {
    error.classList.add('show');
    return false;
  }
  error.classList.remove('show');
  return true;
}

// Clear error on input
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errorEl = document.getElementById(el.id + 'Error');
      if (errorEl) errorEl.classList.remove('show');
    });
    el.addEventListener('change', () => {
      el.classList.remove('error');
      const errorEl = document.getElementById(el.id + 'Error');
      if (errorEl) errorEl.classList.remove('show');
    });
  });

  // Radio cards clear error on selection
  document.querySelectorAll('.radio-card input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const groupErrorId = radio.name + 'Error';
      const groupError = document.getElementById(groupErrorId);
      if (groupError) groupError.classList.remove('show');
    });
  });
});


// ─────────────────────────────────────────────────────────────
// FORM SUBMISSION → Google Apps Script → Google Sheets
// ─────────────────────────────────────────────────────────────
document.getElementById('applyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Final validation for step 3
  if (!validateStep(3)) return;

  // Collect all form data
  const formData = {
    timestamp:          new Date().toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }),
    firstName:          document.getElementById('firstName').value.trim(),
    lastName:           document.getElementById('lastName').value.trim(),
    email:              document.getElementById('email').value.trim(),
    age:                document.getElementById('age').value,
    instagram:          document.getElementById('instagram').value.trim() || 'Not provided',
    primaryGoal:        document.querySelector('input[name="primaryGoal"]:checked')?.value || '',
    trainingExperience: document.getElementById('trainingExperience').value,
    currentChallenge:   document.getElementById('currentChallenge').value.trim(),
    trainingLocation:   document.querySelector('input[name="trainingLocation"]:checked')?.value || '',
    daysPerWeek:        document.getElementById('daysPerWeek').value,
    injuries:           document.getElementById('injuries').value.trim(),
    heardAbout:         document.getElementById('heardAbout').value || 'Not specified',
    anythingElse:       document.getElementById('anythingElse').value.trim() || 'None',
  };

  // Show loading state
  const btn = document.getElementById('submitBtn');
  btn.querySelector('.btn-text').classList.add('hide');
  btn.querySelector('.btn-loading').classList.add('show');
  btn.disabled = true;

  // Check if the script URL has been configured
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    // Dev mode: just show success without sending
    console.log('Form data (not sent — no script URL configured):', formData);
    showSuccess();
    return;
  }

  try {
    // Send to Google Apps Script via POST
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // 'no-cors' means we can't read the response — assume success
    showSuccess();

  } catch (error) {
    console.error('Submission error:', error);
    // Reset button
    btn.querySelector('.btn-text').classList.remove('hide');
    btn.querySelector('.btn-loading').classList.remove('show');
    btn.disabled = false;

    // Show inline error
    alert('Something went wrong. Please try again or email us directly.');
  }
});

function showSuccess() {
  document.getElementById('applyForm').style.display = 'none';
  const success = document.getElementById('formSuccess');
  success.classList.add('show');
  success.style.display = 'block';
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

