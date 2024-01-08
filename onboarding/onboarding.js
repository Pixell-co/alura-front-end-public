const nextDiv = document.querySelector(".w-slider-arrow-right");
const prevDiv = document.querySelector(".w-slider-arrow-left");

document.body.addEventListener("click", function (event) {
  if (event.target.id === "open-alura") {
    // Allow the native action for the button with id "open-alura"
    return;
  }

  if (event.target.matches('[slider-handler="next"]') && nextDiv) {
    event.preventDefault();
    nextDiv.click();
  } else if (event.target.matches('[slider-handler="previous"]') && prevDiv) {
    event.preventDefault();
    prevDiv.click();
  }
});

// Check if any element with [enter="true"] is visible
function getVisibleEnterElement() {
  const enterEnabledElements = document.querySelectorAll('[enter="true"]');
  for (let elem of enterEnabledElements) {
    if (
      getComputedStyle(elem).display !== "none" &&
      getComputedStyle(elem).visibility !== "hidden"
    ) {
      return elem; // return the visible element
    }
  }
  return null;
}

// Check if the div with id command-menu_2 is set to display flex
function isCommandMenu2Visible() {
  const commandMenu2 = document.getElementById("command-menu_2");
  return commandMenu2 && getComputedStyle(commandMenu2).display === "flex";
}

// Added this event listener to detect "Enter" key press
document.body.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !isCommandMenu2Visible()) {
    const visibleEnterElement = getVisibleEnterElement();
    if (visibleEnterElement) {
      visibleEnterElement.click();
    }
  }
});

const chromeAdd = document.getElementById("chrome_add");
const chromeNextStep = document.getElementById("chrome_next-step");
const chromeAddLater = document.getElementById("chrome_add-later");

if (chromeAdd) {
  chromeAdd.addEventListener("click", function () {
    chromeAdd.style.display = "none";

    if (chromeNextStep) {
      chromeNextStep.style.display = "flex";
    }

    if (chromeAddLater) {
      chromeAddLater.style.display = "none";
    }
  });
}

const shortcutKey = document.getElementById("shortcut-key");

if (shortcutKey) {
  if (navigator.platform.indexOf("Win") !== -1) {
    shortcutKey.textContent = "Ctrl";
  }
}
