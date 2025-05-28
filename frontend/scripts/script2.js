 const BASE_URL = 'http://localhost:5000/api';

// Check authentication and load dashboard
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    window.location.href = "index.html";
    return;
  }
  
  // Display user info
  document.querySelector('.user-desc h2').textContent = `Welcome ${user.username}`;
  
  // Load exercises
  try {
    const exercisesResponse = await fetch(`${BASE_URL}/exercises`);
    const exercises = await exercisesResponse.json();
    
    const progressResponse = await fetch(`${BASE_URL}/progress`, {
      headers: { 'x-auth-token': token }
    });
    const progress = await progressResponse.json();
    
    // Update UI with exercises and progress
    const container = document.querySelector('.skills-projects');
    container.innerHTML = exercises.map(ex => {
      const exProgress = progress.find(p => p.exerciseId === ex.id) || { status: 'not_started' };
      return `
        <div class="repo" data-id="${ex.id}">
          <div class="status">
            <div class="status-left">
              <p>Exercise ${ex.order}/10</p>
            </div>
            <div class="status-right">
              <p>${exProgress.status.replace('_', ' ')}</p>
            </div>
          </div>
          <div class="excercise-desc">
            <h3>${ex.title}</h3>
          </div>
          <div class="enroll">
            <button class="startBtn">Start</button>
          </div>
        </div>
      `;
    }).join('');
    
    // Add event listeners to all start buttons
    document.querySelectorAll('.startBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const exerciseId = e.target.closest('.repo').getAttribute('data-id');
        window.location.href = `compiler.html?exercise=${exerciseId}`;
      });
    });
    
    // Update progress counts
    const completed = progress.filter(p => p.status === 'completed').length;
    const inProgress = progress.filter(p => p.status === 'in_progress').length;
    const notStarted = exercises.length - completed - inProgress;
    
    const progressDetails = document.querySelectorAll('.progress-details h2');
    progressDetails[0].textContent = completed;
    progressDetails[1].textContent = inProgress;
    progressDetails[2].textContent = notStarted;
    
  } catch (err) {
    console.error('Error loading data:', err);
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  const userConfirmed = window.confirm("Are you sure you want to logout?");
  if (userConfirmed) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "index.html";
  }
});