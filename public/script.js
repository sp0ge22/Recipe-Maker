document.getElementById('recipeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let generateButton = document.getElementById('generateButton');
    let loader = generateButton.parentNode.querySelector('.loader');

    generateButton.disabled = true; // Disable the button during loading
    loader.style.display = 'inline-block'; // Show the loader

    let mealNameInput = document.getElementById('mealName');
    let dietRestrictionsInput = document.getElementById('dietRestrictions');
    let peopleToFeedInput = document.getElementById('peopleToFeed');

    let mealName = mealNameInput.value;
    let dietRestrictions = dietRestrictionsInput.value;
    let peopleToFeed = peopleToFeedInput.value;

    // Remove existing error styling
    mealNameInput.classList.remove('error');
    dietRestrictionsInput.classList.remove('error');
    peopleToFeedInput.classList.remove('error');

    // Validate the input fields
    let isValid = true;

    if (mealName.trim() === '') {
        isValid = false;
        mealNameInput.classList.add('error');
    }

    if (dietRestrictions.trim() === '') {
        isValid = false;
        dietRestrictionsInput.classList.add('error');
    }

    if (peopleToFeed === '') {
        isValid = false;
        peopleToFeedInput.classList.add('error');
    }

    if (!isValid) {
        // Show an error message or perform any necessary action
        console.log('Please fill in all the fields');
        generateButton.disabled = false; // Re-enable the button
        loader.style.display = 'none'; // Hide the loader

        // Flash error styling three times
        let flashCount = 0;
        let intervalId = setInterval(function() {
            if (flashCount % 2 === 0) {
                mealNameInput.classList.add('error');
                dietRestrictionsInput.classList.add('error');
                peopleToFeedInput.classList.add('error');
            } else {
                mealNameInput.classList.remove('error');
                dietRestrictionsInput.classList.remove('error');
                peopleToFeedInput.classList.remove('error');
            }
            flashCount++;
            if (flashCount === 6) {
                clearInterval(intervalId);
            }
        }, 150); // Flash every 250 milliseconds

        return; // Exit the function
    }

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealName, dietRestrictions, peopleToFeed }),
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        document.getElementById('recipeResult').innerText = data.recipe;
        document.getElementById('resultContainer').style.display = 'block';
    })
    .catch((error) => {
        console.error('Error:', error);
    })
    .finally(() => {
        generateButton.disabled = false; // Re-enable the button
        loader.style.display = 'none'; // Hide the loader
    });
});