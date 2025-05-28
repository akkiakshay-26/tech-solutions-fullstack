document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');
  
  if (!exerciseId) {
    window.location.href = "dashboard.html";
    return;
  }

  try {
    // Fetch exercise details
    const response = await fetch(`http://localhost:5000/api/exercises/${exerciseId}`);
    const exercise = await response.json();

    // Fetch user progress for this exercise
    const progressResponse = await fetch(`http://localhost:5000/api/progress/${exerciseId}`, {
      headers: {
        'x-auth-token': token
      }
    });
    const progress = await progressResponse.json();

    // Display exercise info
    document.getElementById('exercise-title').textContent = exercise.title;
    document.getElementById('exercise-description').textContent = exercise.description;
    
    // Initialize editor with starter code or user's saved code
    const editor = document.getElementById('html-editor');
    editor.value = progress?.code || exercise.starterCode;

    // Set up event listeners
    document.getElementById('run-btn').addEventListener('click', runCode);
    document.getElementById('submit-btn').addEventListener('click', () => submitSolution(exerciseId, editor.value));
    document.getElementById('back-btn').addEventListener('click', () => {
      window.location.href = "dashboard.html";
    });

    // Initial code run
    runCode();

  } catch (error) {
    console.error('Error loading exercise:', error);
    alert('Failed to load exercise. Please try again.');
  }
});

function runCode() {
  const editor = document.getElementById('html-editor');
  const previewFrame = document.getElementById('preview-frame');
  const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  
  previewDoc.open();
  previewDoc.write(editor.value);
  previewDoc.close();
}

async function submitSolution(exerciseId, code) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/progress/${exerciseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        status: 'completed',
        code: code
      })
    });

    if (response.ok) {
      alert('Solution submitted successfully!');
      window.location.href = "dashboard.html";
    } else {
      const error = await response.json();
      alert(error.message || 'Submission failed');
    }
  } catch (error) {
    console.error('Error submitting solution:', error);
    alert('Failed to submit solution. Please try again.');
  }
}