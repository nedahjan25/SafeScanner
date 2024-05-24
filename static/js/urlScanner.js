function analyseUrl() {
    const inputUrl = document.getElementById("urlInput").value;
    const featuresList = document.getElementById("featuresList");
    const maliciousCheck = document.getElementById("maliciousCheck");
    featuresList.innerHTML = ""; // Clear previous features
    maliciousCheck.innerHTML = ""; // Clear previous malicious check
    
    try {
        const url = new URL(inputUrl);
        
        // Extract URL features
        addFeature("Scheme", url.protocol);
        addFeature("Authority", url.host);
        addFeature("Path", url.pathname);
        addFeature("Parameters", url.searchParams.toString());
        addFeature("Query", url.search);
        
        // Check if URL is malicious
        const isMalicious = checkIfMalicious(url);
        if (isMalicious) {
            displayMalicious("Warning: This URL might be malicious.");
        } else {
            displaySafe("This URL appears to be safe.");
        }
        
    } catch (error) {
        displayError("Invalid URL format. Please include 'http://' or 'https://'.");
    }
}

function addFeature(label, value) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
    document.getElementById("featuresList").appendChild(listItem);
}

function checkIfMalicious(url) {
    // feature extraction for logistic regression
    const features = {
        hostLength: url.host.length,
        pathLength: url.pathname.length,
        numQueryParams: Array.from(url.searchParams).length,
        hasSuspiciousChars: /[^a-zA-Z0-9\-\/]/.test(url.host + url.pathname),
        subdomains: url.host.split('.').length - 5,
    };

    // logistic regression model with hardcoded coefficients and threshold
    const coefficients = {
        hostLength: 0.05,
        pathLength: 0.03,
        numQueryParams: 0.07,
        hasSuspiciousChars: 0.02,
        subdomains: 0.05,
    };                         

    // Compute the weighted sum
    let score = 0;
    for (const feature in features) {
        score += coefficients[feature] * features[feature];
    }

    // Logistic function to map the score to a probability
    const probability = 1 / (1 + Math.exp(-score));

    // Malicious threshold (e.g., 0.5 indicates 50% chance)                  
    const threshold = 0.9;

    return probability >= threshold;
}

function displayMalicious(message) {
    const warningDiv = document.createElement("div");
    warningDiv.style.color = "red";
    warningDiv.textContent = message;
    document.getElementById("maliciousCheck").appendChild(warningDiv);
}

function displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.textContent = message;
    document.getElementById("featuresList").innerHTML = "";
    document.getElementById("featuresList").appendChild(errorDiv);
}
