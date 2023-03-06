function onActiveChange(element, callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "active"
      ) {
        callback(mutation.target.attributes.hasOwnProperty("active"));
      }
    });
  });
  observer.observe(element, { attributes: true });
  return observer.disconnect;
}

function afterDelay() {
  alert("5 seconds passed");
  //window.location.assign("http://www.google.com");
}

const itemToWatch = document.querySelector("#endcard");
let timeOutId;

onActiveChange(itemToWatch, (isActive) => {
  if (isActive) {
    console.log("active");
    timeOutId = setTimeout(afterDelay, 5000);
  } else {
    console.log("inactive");
    clearInterval(timeOutId);
  }
});
