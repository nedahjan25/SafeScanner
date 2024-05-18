// Check if the DOM is ready and execute the callback function
function domReady(fn) {
	if (document.readyState === "complete" || document.readyState === "interactive") {
	  setTimeout(fn, 200); // Faster response
	} else {
	  document.addEventListener("DOMContentLoaded", fn);
	}
  }
  
  // Calculate the Shannon entropy of a given string
  function calculateEntropy(string) {
	const charMap = {};
  
	for (let char of string) {
	  charMap[char] = (charMap[char] || 0) + 1;
	}
  
	const entropy = Object.keys(charMap).reduce((acc, key) => {
	  const freq = charMap[key] / string.length;
	  return acc - freq * Math.log2(freq);
	}, 0);
  
	return entropy;
  }
  
  // Check if a URL's hostname is an IP address
  function containsIpAddress(hostname) {
	return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  }
  
  // Extract lexical features from a URL to assess potential threats or benign URLs
  function extractUrlFeatures(url) {
	const urlObject = new URL(url);
	const hostname = urlObject.hostname;
	const path = urlObject.pathname;
	const searchParams = urlObject.search;
	const redirectCount = (url.match(/\/\//g) || []).length; // Count of redirects
	const digitsCount = (url.match(/\d/g) || []).length; // Count of digits
	const specialCharsPattern = /[%\/\.=_\-@?~]/g;
  
	const features = {
	  urlLength: url.length, // Total length of the URL
	  hostnameLength: hostname.length, // Length of the hostname
	  pathLength: path.length, // Length of the URL path
	  numSpecialChars: (url.match(specialCharsPattern) || []).length,
	  redirectCount, // Number of URL redirects
	  digitsCount, // Count of digits
	  containsIpAddress: containsIpAddress(hostname), // True if the hostname is an IP address
	  containsPort: /:\d+$/.test(hostname), // True if the URL specifies a port
	  isAbsolute: url.startsWith("http://") || url.startsWith("https://"), // Absolute URL check
	  entropy: calculateEntropy(url),
	  containsSuspiciousKeywords: /(login|free|win|prize|click|admin|secure|bonus|deal|offer|cash)/i.test(url),
	  hasSuspiciousTld: /(tk|ml|ga|cf|gq)/i.test(hostname), // Common suspicious TLDs
	  fileExtension: path.split('.').pop(), // File extension if exists
	  isBenignTld: /(com|org|net|edu|gov)/i.test(hostname), // Typical benign TLDs
	  containsBenignKeywords: /(home|about|contact|blog|help|faq|support)/i.test(url), // Words in benign URLs
	};
  
	return features;
  }
  
  // Function called when a QR code is successfully scanned
  function onScanSuccess(decodeText, decodeResult) {
	const resultDiv = document.getElementById("output");
  
	const urlPattern = /^(https?:\/\/)/; // Regex pattern to check for URLs
	const isUrl = urlPattern.test(decodeText);
  
	if (isUrl) {
	  const features = extractUrlFeatures(decodeText);
  
	  // Define thresholds for determining if a URL is suspicious
	  const isSuspicious =
		features.urlLength > 100 ||
		features.hostnameLength > 30 ||
		features.pathLength > 50 ||
		features.numSpecialChars > 10 ||
		features.redirectCount > 1 ||
		features.digitsCount > 10 ||
		features.containsIpAddress ||
		features.containsPort ||
		features.isAbsolute === false ||
		features.entropy > 5 ||
		features.containsSuspiciousKeywords ||
		features.hasSuspiciousTld;
  
	  // Define conditions for detecting benign URLs
	  const isBenign =
		features.urlLength < 50 &&
		features.hostnameLength < 15 &&
		features.pathLength < 20 &&
		features.numSpecialChars < 5 &&
		features.redirectCount === 1 && // Only one redirect indicates a simpler structure
		features.digitsCount < 5 && // Few digits
		features.entropy < 2 &&
		!features.containsIpAddress &&
		!features.containsPort &&
		features.isAbsolute &&
		!features.containsSuspiciousKeywords &&
		features.isBenignTld &&
		features.containsBenignKeywords;
  
	  if (isSuspicious) {
		resultDiv.innerHTML = `Malicious URL: <span style="color: red;">${decodeText}</span>`;
	  } else if (isBenign) {
		resultDiv.innerHTML = `Benign URL: <a href="${decodeText}" target="_blank">${decodeText}</a>`;
	  } else {
		resultDiv.innerHTML = `Safe URL: <a href="${decodeText}" target="_blank">${decodeText}</a>`;
	  }
	} else {
	  resultDiv.innerHTML = `Scanned Text: ${decodeText}`;
	}
  }
  
  domReady(function () {
	const htmlscanner = new Html5QrcodeScanner("my-qr-reader", {
	  fps: 10,
	  qrbox: 250,
	});
  
	htmlscanner.render(onScanSuccess);
  
	htmlscanner.render(onScanSuccess, function (error) {
	  console.error("QR code scanner error:", error);
	});
  });
  