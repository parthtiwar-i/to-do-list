let lati;
let longi;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    lati = position.coords.latitude;
    longi = position.coords.longitude;
    // Make the fetch request inside the getCurrentPosition callback
    const url = "http://localhost:3000/?lati=" + lati +"&longi="+ longi
    fetch(url, {
      method: "POST",
    })
      .then((response) => {
        console.log(data);
        if (response.redirected) {
          window.location.href = response.url;
        }
      })
      .catch((err) => {
        console.log("error occurred: " + err);
      });
  });
} else {
  console.log("No GPS available on the device");
}

// Add event listener for the add button
$("#addButton").on("click", () => {
  let value = $("#userInputValue").val();
  if (value === "") {
    alert("Please enter a task for the list");
  } 
  //else {
  //   console.log(value);
  //   // Make the fetch request to send the task value to the backend
  //   fetch("/", {
  //     method: "POST",
  //     body: JSON.stringify({ task: value }),
  //     headers: {
  //       "Content-type": "application/json; charset=UTF-8"
  //     }
  //   })
  //     .then((response) => {

  //       console.log("Successfully sent data to the backend server: " + response);
  //       if (response.ok) {
  //         window.location.href = '/';
  //       } else {
  //         console.error('Error:', response.status);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   // Clear the input field
  //   $("#userInputValue").val("");
  // }
});
