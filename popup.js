// Wait for the "Extract Subtitles" button to be clicked
document.getElementById("extractButton").addEventListener("click", function () {
    console.log("Button clicked");
  
    // Send a message to the content script to start extracting subtitles
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Tab found:", tabs[0].id);
  
      // Use chrome.scripting to inject the function
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractSubtitles,
        },
        (injectionResults) => {
          const statusElement = document.getElementById("status");
          const subtitlesElement = document.getElementById("subtitles");
          const downloadButton = document.getElementById("downloadButton");
  
          if (injectionResults && injectionResults[0].result) {
            statusElement.textContent = "Subtitles extracted successfully!";
            console.log("Subtitles extracted:", injectionResults[0].result);
  
            // Enable the download button
            downloadButton.disabled = false;
  
            // Store the subtitles in a variable for later use in download
            window.extractedSubtitles = injectionResults[0].result;
          } else {
            statusElement.textContent = "No subtitles found!";
            console.log("No subtitles found.");
          }
        }
      );
    });
  });
  
  // Function to extract subtitles
  function extractSubtitles() {
    console.log("Extracting subtitles...");
    let dialogueList = document.querySelectorAll("#japaneseDialogueHistoryList li");
  
    let allSubtitles = [];
  
    dialogueList.forEach((li) => {
      let subtitleList = li.querySelectorAll(".dialogueHistoryElement span");
  
      subtitleList.forEach((span) => {
        let subtitleElement = span;
        if (subtitleElement) {
          allSubtitles.push(subtitleElement.innerText.trim());
        }
      });
    });
  
    console.log("All Subtitles Extracted:", allSubtitles);
    return allSubtitles; // Return the subtitles as an array
  }
  
  // Wait for the "Download Subtitles" button to be clicked
  document.getElementById("downloadButton").addEventListener("click", function () {
    if (window.extractedSubtitles && window.extractedSubtitles.length > 0) {
      const cleanedSubtitles = cleanSubtitles(window.extractedSubtitles);
      // Download the subtitles as a .txt file
      downloadSubtitles(cleanedSubtitles);
    } else {
      console.log("No subtitles available to download.");
    }
  });
  
  // Function to download subtitles as a .txt file
  function downloadSubtitles(subtitles) {
    const blob = new Blob([subtitles.join("\n")], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function cleanSubtitles(subtitles){
    return subtitles.map(subtitles => {
        
    }).filter(subtitle => subtitle.length > 0);
  }
  