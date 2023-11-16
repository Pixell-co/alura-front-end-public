//--------------------------- New user welcome ---------------------------//
// Function to run when the document is fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Check if 'user' parameter is present and equals 'new'
  if (currentUrl.searchParams.get("user") === "new") {
    launchConfetti();
  }
});

//--------------------------- Greeting message ---------------------------//
document.addEventListener("DOMContentLoaded", function () {
  // Attempt to get the user's name from localStorage.
  let nameFromStorage = localStorage.getItem("userName");

  // Function to display greeting, taking name as a parameter.
  function displayGreeting(name) {
    const urlParams = new URLSearchParams(window.location.search);
    const pastGreetings =
      JSON.parse(localStorage.getItem("pastGreetings")) || [];
    const MAX_PAST_GREETINGS = 2;
    const FALLBACK_GREETING = "Welcome back, " + name + "!";
    let greeting = "";

    if (urlParams.get("user") === "new") {
      greeting = name + ", welcome to your dashboard!";
    } else {
      const date = new Date();
      const hour = date.getHours();
      const day = date.getDay();
      const currentDate = date.getDate();
      const currentMonth = date.getMonth() + 1;
      const dateString = `${currentMonth}-${currentDate}`;

      const dateGreetings = {
        "1-1": "New Year, new opportunities, {name}!",
        "2-14": "Happy Valentine's Day, {name}!",
        "12-24": "Merry Christmas, {name}!",
        "12-25": "Merry Christmas, {name}!",
        "10-31": "Spooky greetings, {name}!",
        "3-17": "Luck of the Irish to you, {name}!",
        "3-8": "Celebrate women, {name}!",
        "4-22": "Love our Earth, {name}.",
        "9-21": "Peace prevails, {name}.",
      };

      const timeGreetings = {
        morning: "Good morning, {name}!",
        afternoon: "Good afternoon, {name}!",
        evening: "Good evening, {name}!",
      };

      const timeOfDay =
        hour < 12
          ? "morning"
          : hour >= 12 && hour < 17
          ? "afternoon"
          : "evening";
      const specificTimeGreeting = timeGreetings[timeOfDay];

      const defaultGreetings = ["Welcome back, {name}!", "Hey there, {name}!"];
      let combinedGreetings = dateGreetings[dateString]
        ? [dateGreetings[dateString]]
        : [];

      combinedGreetings.push(specificTimeGreeting);
      combinedGreetings = combinedGreetings.concat(defaultGreetings);

      combinedGreetings = combinedGreetings.filter(
        (greeting) => !pastGreetings.includes(greeting)
      );

      greeting =
        combinedGreetings.length > 0 ? combinedGreetings[0] : FALLBACK_GREETING;
    }

    greeting = greeting.replace(/{name}/g, name); // Replace all instances of {name} with the actual name.
    document.getElementById("page-greeting").textContent = greeting;

    // Update pastGreetings in localStorage.
    pastGreetings.push(greeting);
    while (pastGreetings.length > MAX_PAST_GREETINGS) {
      pastGreetings.shift(); // Ensure the pastGreetings doesn't exceed the maximum allowed.
    }
    localStorage.setItem("pastGreetings", JSON.stringify(pastGreetings));
  }

  // If we have a name saved, display the greeting immediately with that name.
  if (nameFromStorage) {
    displayGreeting(nameFromStorage);
  }

  // Continues to check for CommonObj to ensure we have the latest name.
  let checkCounter = 0;
  const checkInterval = setInterval(function () {
    if (
      typeof CommonObj !== "undefined" &&
      CommonObj.user_profile_obj &&
      CommonObj.user_profile_obj.fname
    ) {
      clearInterval(checkInterval); // Clear the check if CommonObj is defined.
      let currentName = CommonObj.user_profile_obj.fname;

      if (!nameFromStorage || currentName !== nameFromStorage) {
        localStorage.setItem("userName", currentName); // Update the name in storage.
        nameFromStorage = currentName; // Update the local variable.
        displayGreeting(currentName); // Display greeting with new name.
      }
    } else if (checkCounter > 100) {
      // Give up after 10 seconds.
      clearInterval(checkInterval);
    }
    checkCounter++;
  }, 100); // Check every 100 milliseconds for CommonObj.
});

//--------------------------- Shortcuts section ---------------------------//
document.addEventListener("DOMContentLoaded", function () {
  // Save the state to Local Storage
  function saveStateToLocalStorage() {
    const items = document.querySelectorAll(".p-app-icon_wrap");
    const state = Array.from(items).map((item) => ({
      dataId: item.getAttribute("data-id"),
      dataState: item.getAttribute("data-state"),
    }));

    localStorage.setItem("shortcutsState", JSON.stringify(state));
  }

  function manageIconsByState(item, state) {
    const manageIcon = item.querySelector(".p-app-icon_manage");
    const isHidden = state === "hidden";
    manageIcon.setAttribute("manage-state", isHidden ? "add" : "remove");
    manageIcon
      .querySelector('[manage-action="remove"]')
      .classList.toggle("visible", !isHidden);
    manageIcon
      .querySelector('[manage-action="add"]')
      .classList.toggle("visible", isHidden);
  }

  const manageShortcutsBtn = document.getElementById("manage-shortcuts");
  const shortcuts = document.querySelector(".shortcuts");
  const shortcutsInactive = document.querySelector(".shortcuts-inactive");

  shortcuts.addEventListener("click", function (event) {
    if (shortcuts.getAttribute("data-state") === "editable") {
      event.preventDefault();
    }

    if (event.target.closest(".p-app-icon_manage")) {
      const manageIcon = event.target.closest(".p-app-icon_manage");
      const currentItem = manageIcon.closest(".p-app-icon_wrap");
      const currentState = currentItem.getAttribute("data-state");

      if (currentState === "hidden") {
        document
          .querySelector(".shortcuts-active .shortcut-grid")
          .appendChild(currentItem);
        currentItem.setAttribute("data-state", "visible");
      } else {
        document
          .querySelector(".shortcuts-inactive .shortcut-grid")
          .appendChild(currentItem);
        currentItem.setAttribute("data-state", "hidden");
      }

      manageIconsByState(currentItem, currentItem.getAttribute("data-state"));
      saveStateToLocalStorage();
    }
  });

  manageShortcutsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const isEditable = shortcuts.getAttribute("data-state") === "normal";

    shortcuts.setAttribute("data-state", isEditable ? "editable" : "normal");
    shortcutsInactive.style.display = isEditable ? "flex" : "none";
    manageShortcutsBtn.innerText = isEditable ? "Done" : "Edit";

    const icons = document.querySelectorAll(".p-app-icon");
    icons.forEach((icon) => icon.classList.toggle("jiggly", isEditable));
  });

  // Initialize Sortable for all shortcut grids
  document.querySelectorAll(".shortcut-grid").forEach((grid) => {
    new Sortable(grid, {
      animation: 150,
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      swapThreshold: 0.65,
      onUpdate: saveStateToLocalStorage,
    });
  });
  // Restore the state from Local Storage
  const savedState = JSON.parse(localStorage.getItem("shortcutsState"));
  if (savedState) {
    savedState.forEach((savedItem) => {
      const item = document.querySelector(`[data-id="${savedItem.dataId}"]`);
      if (item) {
        item.setAttribute("data-state", savedItem.dataState);
        const targetGrid =
          savedItem.dataState === "hidden"
            ? ".shortcuts-inactive .shortcut-grid"
            : ".shortcuts-active .shortcut-grid";
        document.querySelector(targetGrid).appendChild(item);
        manageIconsByState(item, savedItem.dataState);
      }
    });
  }

  // Hide the loader and show the content
  const loader = document.querySelector(".shortcuts-loader");
  const content = document.querySelector(".shortcuts-active");

  loader.style.display = "none";
  content.style.display = "block";
});

// For 'shortcut_command-menu' ID with a check for data-state="editable"
var cmdMenu = document.getElementById("shortcut_command-menu");
if (cmdMenu) {
  cmdMenu.addEventListener("mouseup", function () {
    var shortcutsDiv = document.querySelector(
      '.shortcuts[data-state="normal"]'
    );
    if (shortcutsDiv) {
      // Check if shortcuts div is in "editable" state
      setTimeout(() => simulateCmdKKeyPress(), 0);
    }
  });
}

// Modify 'addHelpMenuListener' to check for 'editable' state before simulating key press
function addHelpMenuListener(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.addEventListener("mouseup", function () {
      var shortcutsDiv = document.querySelector(
        '.shortcuts[data-state="normal"]'
      );
      if (shortcutsDiv) {
        // Check if shortcuts div is in "editable" state
        setTimeout(() => simulateQuestionMarkKeyPress(), 0);
      }
    });
  }
}

// Existing code to add event listeners remains the same
addHelpMenuListener("shortcut_help");
addHelpMenuListener("sidebar_help");

//--------------------------- News section ---------------------------//

// This function will handle the showing and hiding of the slideouts and updating the state of the aside element
function handleNewsItemDisplay(clickedDataId) {
  // Find all elements with the class 'news-item-slideout'
  var slideoutItems = document.querySelectorAll(".news-item-slideout");
  // Find the aside element
  var slideoutAside = document.querySelector(".p-slideout");

  // Assume no match found initially
  var matchFound = false;

  // Loop through each slideout item
  slideoutItems.forEach(function (item) {
    // Check if the item's 'data-id' matches the 'data-id' of the clicked element
    if (item.getAttribute("data-id") === clickedDataId) {
      // If it matches, set the display to 'block'
      item.style.display = "block";
      // Since we have a match, set matchFound to true
      matchFound = true;
    } else {
      // If not, set the display to 'none'
      item.style.display = "none";
    }
  });

  // If a matching slideout was found, set the aside data-state to 'open', else to 'closed'
  if (matchFound) {
    slideoutAside.setAttribute("data-state", "open");
  } else {
    slideoutAside.setAttribute("data-state", "closed");
  }
}

// Listen for a click event on the entire document
document.addEventListener("click", function (event) {
  // Check if the clicked element or any of its parents have the class 'news-item'
  var path = event.path || (event.composedPath && event.composedPath());
  var target = path
    ? path.find((el) => el.classList && el.classList.contains("news-item"))
    : event.target;

  // If a 'news-item' was part of the click event
  if (target && target.classList.contains("news-item")) {
    // Get the 'data-id' attribute from the clicked element or parent element
    var clickedDataId = target.getAttribute("data-id");
    // Handle the display of the news item slideouts and update the aside state
    handleNewsItemDisplay(clickedDataId);
  }
});
