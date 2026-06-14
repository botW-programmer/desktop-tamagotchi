const creature = document.getElementById('creature');
const stats = document.getElementById('stats');

let isPetting = false;

// interactive petting
creature.addEventListener('click', () => {
    if (isPetting) return;
    
    isPetting = true;
    
    creature.innerText = '(≧◡≦)';
    creature.style.color = '#a59197'; 
    
    setTimeout(() => {
        isPetting = false;
    }, 3000);
});

// duo stat handling
window.tamagotchiAPI.onStatsUpdate((data) => {
    // Update the UI text
    stats.innerText = `RAM: ${data.memory}% | CPU: ${data.cpu}%`;

    if (isPetting) return;

    // Change the mood based on whichever resource is struggling the most
    if (data.cpu > 80 || data.memory > 80) {
        creature.innerText = '( × ﹏ × )'; // Exhausted
        creature.style.color = '#b39188';  
    } else if (data.cpu > 50 || data.memory > 50) {
        creature.innerText = '( ＠_＠;)';  // Stressed
        creature.style.color = '#bbad99';  
    } else {
        creature.innerText = '(* ^ ω ^)';  // Happy
        creature.style.color = '#95ad9c';  
    }
});