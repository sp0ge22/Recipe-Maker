document.getElementById('recipeForm').addEventListener('submit', function(event) {
    console.log("Form submit event triggered");
    event.preventDefault();
    let mealName = document.getElementById('mealName').value;
    let dietRestrictions = document.getElementById('dietRestrictions').value;
    let peopleToFeed = document.getElementById('peopleToFeed').value;
    console.log('Form data:', { mealName, dietRestrictions, peopleToFeed });

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealName, dietRestrictions, peopleToFeed }),
    })
    .then(response => {
        console.log('Server response:', response);
        return response.json();
    })
    .then(data => {
        console.log('Data received from server:', data);
        document.getElementById('recipeResult').innerText = data.recipe;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
