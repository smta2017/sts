function generatePDF() {
  // Get the HTML table element
  var table = document.getElementById('table-entriesR');

  // Open a new window for the print preview
  var win = window.open('', '_blank');

  // Create a new document in the new window
  win.document.write('<html><head><title>Entries Table</title></head><body>');
  win.document.write('<style>table { border-collapse: collapse; } th, td { border: 2px solid black; padding: 8px; }</style>');
  win.document.write('<h1>Entries Table</h1>');
  win.document.write(table.outerHTML); // Write the table HTML to the new document
  win.document.write('</body></html>');

  // Close the document
  win.document.close();

  // Wait for the document to fully load before printing
  win.onload = function() {
    // Print the document
    // win.print();
    // Close the print preview window after printing
    // win.close();
  };
}

document.getElementById('generate-pdf').addEventListener('click', generatePDF);

var entryDegreeID = getCookie("entryDegree"); 
var type = getCookie("type"); 
var year = getCookie("year"); 

// function setCookie(name, value) {
//   document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; path=/';
// }

var entriesData;
function showEntriesData(entryDegreeID) {
    var entriesContainer = document.getElementById("table-body-entriesR");
    document.getElementById("gif").style.display ="block"
    fetch(`${domainName}/sts/entry/completeresult/${entryDegreeID}`, {
        method: 'GET',
        headers: {'Authorization': token},
    })
        .then(response => response.json())
        .then(data => {
            entriesData = data.data;
            
            entriesContainer.innerHTML = "";
            data.data.forEach(entry => {
                document.getElementById("namecompatator").innerHTML = `Entry List for ${type} - ${year}`
                const element = document.createElement('tr');
                element.id = entry._id
                element.innerHTML = `
                    <td id="entryNameSearch">${entry.name}</td>
                    <td>${entry.qualifierSubscription.academy.academyDetails.schoolName}</td>
                    <td>
                        <form class="text-center" id="form_${entry._id}" onsubmit="addDegreeForEntry(event)">
                            <div class="btn_group row">
                                <div class="col-6">
                                    <input type="number" class="form-control" id="degreeEntry_${entry._id}" placeholder="Degree Entry" min="1" max="30">
                                </div>
                                <div class="col-6">
                                    <input type="submit" class="form-control" id="submit">
                                </div>
                            </div>
                        </form>
                    </td>
                `;
                entriesContainer.appendChild(element);
                setCookie("subscriptionId" , entry.qualifierSubscription._id)
            });
        })
        .catch(error => console.log(error));
        document.getElementById("gif").style.display ="none"
}

showEntriesData(entryDegreeID);

function addDegreeForEntry(e) {
    e.preventDefault(); // Prevent the default form submission
    var subscriptionID = getCookie('subscriptionId');
    var competitionID =  e.target.id.split("_")[1];

    var formData = {
        degree: document.getElementById(`degreeEntry_${competitionID}`).value,
      };

      // New competitor, send POST request
      document.getElementById("gif").style.display ="block"
    fetch(`${domainName}/sts/entry/${subscriptionID}/${competitionID}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" , 'Authorization': token},
        body: JSON.stringify(formData)
    }).then(response => response.json())
        .then(response => {  
          if (response.apiStatus == true) {
            console.log('your data added successfully');

            setCookie("degreeRuler1" ,  document.getElementById(`degreeEntry_${competitionID}`).value)

            showEntriesData(entryDegreeID);
           
          } else {
            console.log('Error:', response.status);
          }
          document.getElementById("gif").style.display ="none";
          responseAlert(response);
        })
        .catch(error => {
          console.log(error);
          document.getElementById("gif").style.display = "none";
          responseAlert(error);
        }); 
}


document.getElementById('search').addEventListener('input', handleSearch);

function handleSearch() {
  var searchQuery = document.getElementById('search').value.toLowerCase();
  var rows = document.querySelectorAll('#table-body-entriesR tr');

  rows.forEach(function (row) {
    var entryName = row.querySelector('#entryNameSearch').textContent.toLowerCase();
    var shouldShowRow = entryName.includes(searchQuery);

    if (shouldShowRow) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}