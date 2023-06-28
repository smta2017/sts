// ENTRIES //
function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : null;
}

function generatePDF(tableElement, entryName) {
  // Get the table inside the tableElement
  var table = tableElement.querySelector('.table');

  // Open a new window for the print preview
  var win = window.open('', '_blank');

  // Create a new document in the new window
  win.document.write('<html><head><title>Entry Table - (' + entryName + ')</title></head><body>');
  win.document.write('<style>table { border-collapse: collapse; } th, td { border: 2px solid black; padding: 8px; }</style>');
  win.document.write('<h1>Entry Table - (' + entryName + ')</h1>');

  // Write the table to the new document
  win.document.write('<div class="table-container">');
  win.document.write(table.outerHTML);
  win.document.write('</div>');

  win.document.write('</body></html>');

  // Close the document
  win.document.close();

  // Wait for the document to fully load before printing
  win.onload = function() {
    // Print the document
    win.print();
    // Close the print preview window after printing
    // win.close();
  };
}

function previewAudio(event) {
  const input = event.target;
  const audioPreview = document.getElementById("audioPreview");
  if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
          audioPreview.src = e.target.result;
          audioPreview.style.display = "block";
      };
      reader.readAsDataURL(input.files[0]);
  } else {
      audioPreview.src = "";
      audioPreview.style.display = "none";
  }
}


function getEntriesData() {
  var entriesContainer = document.getElementById("results_container-school");
  var id = getCookie("subscriptionId");

  document.getElementById("gif").style.display ="block"
  fetch(`${domainName}/sts/entry/${id}`, {
    method: 'GET',
    headers: {'Authorization': token},
  })
    .then(response => response.json())
    .then(data => {
      entriesData = data.data;
      entriesContainer.innerHTML = "";
      data.data.forEach(entry=> {
          const competitorList=entry.competitors.map(competitor=>competitor._id)
          const element = document.createElement('section');
          element.id= "entersS";
          element.className= "pb-1";
          let competitorsTable = `
            <div class="container">
              <div class="m-0 row">
                <div class="panel my-4">
                  <div class="panel-heading">
                    <div class="row">
                      <div class="row">
                        <h4 class="title col-12 col-lg-6 text-md-center" id="nameEntry">${entry.name}</h4>
                        <div class="btn_group col-12 col-lg-6 text-md-center">
                          <audio src="${domainName}/${entry.music}" id="audioPlayer1" controls>
                            <source id="audio_${entry._id}"/>
                          </audio>
                        </div>
                        <div class="col-12 row pb-2"> 
                            <div class="btn_group col-12 col-sm-6 text-sm-start text-center">
                              <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#AddCompatatorToEntry" onclick='getCompetitorsName("${entry._id}","${competitorList}")'>Add Compatators</button>
                              <button class="btn btn-default" title="Pdf" fdprocessedid="vmxwvs" id="generate-pdf" onclick="generatePDF(this.closest('.panel'), '${entry.name}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
                                  <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
                                  <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                </svg>
                              </button>
                              </div>

                            <div class="title col-12 col-sm-6 text-sm-end text-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="edit-btn bi bi-pen-fill" style="color: #3e843e;cursor: pointer;" data-bs-toggle="modal" data-bs-target="#AddCompatator" onclick="editEntry('${entry._id}')" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="delete-btn bi bi-trash-fill delete" style="color: #c10b0b;cursor: pointer;" onclick="deleteEntry('${entry._id}')" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                              </svg>
                              <button class="btn btn-light" id="add-row" data-bs-toggle="modal" data-bs-target="#exampleModal_${entry._id}" onclick="showDgreeForRefree('${entry._id}')">Add Degree</button>
                            </div>
                        </div>
                      </div>
                    </div> 
                    <div class="panel-body table-responsive">
                      <table class="table" id="table-entries">
                        <thead>
                          <tr>
                            <th>Compatator Name</th>
                            <th>Category Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody id="table-body-entriesS">`
                          entry.competitors.forEach(competitor=>{
                            competitorsTable+=`<tr><td>${competitor.firstName} ${competitor.lastName}</td><td>${competitor.category}</td><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="delete-btn bi bi-trash-fill delete" style="color: #c10b0b;cursor: pointer;" onclick="deleteCompatator('${competitor._id}','${entry._id}')" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                          </svg</td></tr>`
                          })
                          competitorsTable+= ` </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div> 

            <div class="modal modal-dialog-scrollable fade" id="AddCompatatorToEntry" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title text-dark" id="exampleModalLabel">Add Compatators to Entry</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="add-CompatatorsToEntry-form" class="row g-3" return false;">
                      <div class="col-12"> 
                        <h2>Add Compatators Names to Entry:</h2> 
                        <div id="name_list">
                          <!-- Names will be added here --> 
                          
                        </div> 
                      </div> 
                      <div class="row ms-5 mx-auto my-2">
                        <button type="button" class="close-popup btn btn-dark col-6" data-bs-dismiss="modal">Close</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal fade" id="exampleModal_${entry._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title text-dark" id="exampleModalLabel">Add Degree</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form class="row g-3" id="form_${entry._id}" onsubmit="addDegreeForEntry(event)">
                    <input type="hidden" class="dgreeForEntre" value="${entry._id}" id="dgreeForEntre">
                      <div class="col-12 col-md-4"> 
                        <label for="degreeRuler1_${entry._id}">Degree Ruler 1:</label> 
                        <input type="number" class="form-control" id="degreeRuler1_${entry._id}" placeholder="Degree Ruler 1" min="1" max="30">
                      </div> 
                      <div class="col-12 col-md-4"> 
                        <label for="degreeRuler2_${entry._id}">Degree Ruler 2:</label> 
                        <input type="number" class="form-control" id="degreeRuler2_${entry._id}" placeholder="Degree Ruler 2" min="1" max="30">
                      </div> 
                      <div class="col-12 col-md-4">  
                        <label for="degreeRuler3_${entry._id}">Degree Ruler 3:</label> 
                        <input type="number" class="form-control" id="degreeRuler3_${entry._id}" placeholder="Degree Ruler 3" min="1" max="30">
                      </div> 
                      <div class="col-12 col-md-6">  
                        <label for="degreeRuler_${entry._id}">Degree Ruler:</label> 
                        <input type="number" class="form-control" id="degreeRuler_${entry._id}" placeholder="Degree Ruler" min="1" max="10">
                      </div>
                      <div class="col-12 col-md-6"> 
                        <label for="showDate_${entry._id}">Show Date:</label> 
                        <input type="datetime-local" class="form-control" id="showDate_${entry._id}" placeholder="Show Date">
                      </div> 
                      <div class="row mx-auto my-3">
                        <input type="reset" value="Clear" class="btn btn-danger px-4 py-1 fs-5" onclick="clearData1()">
                        <button type="submit" id="submit" data-bs-dismiss="modal" class="btn btn-dark col-6">Add</button>
                        <button type="button" class="close-popup btn btn-dark col-6" data-bs-dismiss="modal">Close</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            `;
        element.innerHTML+= competitorsTable
        element.setAttribute('id', `entry-${entry._id}`);
        entriesContainer.appendChild(element);    
      });
      document.getElementById("gif").style.display ="none"  
    })
    .catch(error => {
      console.log(error);
      document.getElementById("gif").style.display = "none";
    }); 
}

getEntriesData();


function editEntry(id) {
  var entry = entriesData.find(entry => entry._id == id);
  document.getElementById("entriesId").value = id;
  document.getElementById('entryname').value = entry.name;
  document.querySelector('#audioPreview').src = entry.music;
  document.querySelector('#audioPreview').style.display = 'block'
}

function changeEntry(e) {
  e.preventDefault(); // Prevent the default form submission

  var entriesId = document.getElementById('entriesId').value;

  // Get the form values
  const audioData = document.querySelector('#uMusic').files[0]
  const formData = new FormData();
  formData.append('qualifierSubscription', getCookie('subscriptionId'));
  formData.append('name', document.getElementById("entryname").value);
  if(document.querySelector("#uMusic").files[0]){formData.append('music', audioData)};


  if (entriesId) {
    // Existing competitor, send PUT request
    document.getElementById("gif").style.display ="block"
    fetch(`${domainName}/sts/entry/${entriesId}`, {
      method: 'PUT',
      headers: {'Authorization': token},
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        console.log(formData)
        if (response.apiStatus == true) {
          console.log("your entry updated sucssefully")
          document.getElementById('entriesId').value = '';
          document.getElementById('entryname').value = '';
          document.getElementById('uMusic').value = '';
          document.getElementById("audioPreview").style.display = "none";

          getEntriesData();
        } else {
          console.log('Error:', response.status);
        }
        document.getElementById("gif").style.display = "none";
        responseAlert(response);
      })
      .catch(error => {
        console.log(error);
        document.getElementById("gif").style.display = "none";
        responseAlert(error);
      }); 
  } else {
    // New competitor, send POST request
    document.getElementById("gif").style.display ="block"
    fetch(`${domainName}/sts/entry`, {
      method: 'POST',
      headers: {'Authorization': token},
      body: formData
    }).then(response => response.json())
      .then(response => {
        if (response.apiStatus == true) {
          console.log("your entry added sucssefully")
          document.getElementById('entriesId').value = '';
          document.getElementById('entryname').value = '';
          document.getElementById('uMusic').value = '';
          document.getElementById("audioPreview").style.display = "none";

          getEntriesData();

        } else {
          console.log('Error:', response.status);
        }
        document.getElementById("gif").style.display = "none";
        responseAlert(response);
      })
      .catch(error => {
        console.log(error);
        document.getElementById("gif").style.display = "none";
        responseAlert(error);
      }); 
  }
}

function deleteEntry(id) {
  if (id) {
    try {
      document.getElementById("gif").style.display ="block"
      fetch(`${domainName}/sts/entry/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': token},
      })
        .then(response => {
          if (response.status == 200) {
            getEntriesData();
          } else {
            throw new Error('Request failed.');
          }
          document.getElementById("gif").style.display = "none";
          response.json().then(data => {
            responseAlert(data);
        });
        })
        .catch(error => {
          console.log(error);
          document.getElementById("gif").style.display = "none";
          error.json().then(data => {
            responseAlert(data);
        });
        }); 
    } catch (error) {
      console.log(error);
    }
  } else {
  }
}

function getCompetitorsName(entriesID, competitors) {
  // var entriesID = document.getElementById('entriesId').value;
  competitors=competitors.split(',')
    // competitors=competitors.map(competitor=>competitor._id)
  var id = getCookie("subscriptionId");
  var competitorsContainer = document.getElementById("name_list");
  // Existing competitor, send PUT request
  document.getElementById("gif").style.display ="block"
  fetch(`${domainName}/sts/competitor/${id}`, {
    method: 'GET',
    headers: {'Authorization': token},
  })
    .then(response => response.json())
    .then(data => {
      let competitorsData = data.data;
      competitorsData = competitorsData.filter(comp => !competitors.includes(comp._id))
      competitorsContainer.innerHTML = "";
      competitorsData.forEach(competitor => {
        const element = document.createElement('table');
        element.innerHTML = `
          <tr class="text-dark">
            <td class="col-7">${competitor.firstName} ${competitor.lastName}</td>
            <td class="col-3">${competitor.category}</td>
            <td class="col-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="add-compatator bi bi-person-fill-add" id="${competitor._id}" style="color: #3e843e;cursor: pointer;" data-bs-dismiss="modal" onclick="add_editCompatatorsToEntry('${competitor._id}','${entriesID}')" viewBox="0 0 16 16">
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
              </svg>
            </td>
          </tr>
        `;
        element.setAttribute('id', `competitor-${competitor._id}`);
        competitorsContainer.appendChild(element);
      });
      document.getElementById("gif").style.display = "none";
    })
    .catch(error => {
      console.log(error);
      document.getElementById("gif").style.display = "none";
    }); 
}


function add_editCompatatorsToEntry(compatatorID, entriesID) {
  // var competitors_Category = document.getElementById("table-body-entriesU");
  document.getElementById("gif").style.display ="block"
  fetch(`${domainName}/sts/entry/${entriesID}/${compatatorID}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" , 'Authorization': token},
  })
    .then(response => response.json())
    .then(response => {
      if (response.apiStatus === true) {

        const existingRow = document.getElementById(response.data._id);
        if (existingRow) {
          // Update existing row
          const firstCell = existingRow.querySelector('.competitor-cell');
          const secondCell = existingRow.querySelector('.category-cell');

          // Update competitor cell
          firstCell.innerHTML = "";
          response.data.competitors.forEach((competitor) => {
            firstCell.innerHTML += `<span>${competitor}</span>`;
          });

          // Update category cell
          secondCell.innerHTML = "";
          response.data.competitorsCategories.forEach((category) => {
            secondCell.innerHTML += `<span>${category}</span>`;
          });
        } else {
          // Create new row
          const element = document.createElement('tr');
          element.id = response.data._id;
          element.innerHTML = `
            <td class="competitor-cell">
              ${response.data.competitors.map(competitor => `<span>${competitor}</span>`).join('')}
            </td>
            <td class="category-cell">
              ${response.data.competitorsCategories.map(category => `<span>${category}</span>`).join('')}
            </td>
            <td>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="delete-btn bi bi-trash-fill delete" style="color: #c10b0b;cursor: pointer;" onclick="deleteCompatator('${compatatorID}','${entriesID}')" viewBox="0 0 16 16">
                  path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </td>
          `;
          // competitors_Category.appendChild(element);
        }

        getEntriesData();
      } else {
        console.log('Error:', response.apiMessage);
        // Display an error message to the user indicating the duplication
        alert(response.apiMessage);
      }
      document.getElementById("gif").style.display = "none";
      responseAlert(response);
    })
    .catch(error => {
      console.log(error);
      document.getElementById("gif").style.display = "none";
      responseAlert(error);
    }); 

}


function deleteCompatator(compatatorID,entriesID) {
  try {
    document.getElementById("gif").style.display ="block"
    fetch(`${domainName}/sts/entry/${entriesID}/${compatatorID}`, {
      method: 'DELETE',
      headers: {'Authorization': token},
    })
      .then(response => {
        if (response.status == 200) {
          getEntriesData();
        } else {
          throw new Error('Request failed.');
        }
        document.getElementById("gif").style.display = "none";
        response.json().then(data => {
          responseAlert(data);
      });
      })
      .catch(error => {
        console.log(error);
        document.getElementById("gif").style.display = "none";
        error.json().then(data => {
          responseAlert(data);
      });
      }); 
  } catch (error) {
    console.log(error);
  }
}

function showDgreeForRefree(id) {
  var subscriptionID = getCookie("subscriptionId");
  document.getElementById("gif").style.display ="block"
  fetch(`${domainName}/sts/entry/${subscriptionID}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" , 'Authorization': token}
  })
    .then(response => response.json())
    .then((data) => {
      document.getElementById(`degreeRuler1_${id}`).value = data.data.qualifierRefree1
      document.getElementById(`degreeRuler2_${id}`).value = data.data.qualifierRefree2
      document.getElementById(`degreeRuler3_${id}`).value = data.data.qualifierRefree3
      document.getElementById(`degreeRuler_${id}`).value = data.data.qualifierLast10Present
      document.getElementById(`showDate_${id}`).value = data.data.qualifierShowDate
      document.getElementById("gif").style.display = "none";
    })
    .catch(error => {
      console.log(error);
      document.getElementById("gif").style.display = "none";
    }); 

}


function addDegreeForEntry(e) {
  e.preventDefault(); // Prevent the default form submission
console.log(e.target.querySelector(".dgreeForEntre").value)
  var subscriptionID = getCookie('subscriptionId');
  var competitionID =  e.target.id.split("_")[1];

  var formData = {
      ShowDate: e.target.querySelector(`#showDate_${competitionID}`).value,
      Refree1: e.target.querySelector(`#degreeRuler1_${competitionID}`).value,
      Refree2: e.target.querySelector(`#degreeRuler2_${competitionID}`).value,
      Refree3: e.target.querySelector(`#degreeRuler3_${competitionID}`).value,
      Last10Present: e.target.querySelector(`#degreeRuler_${competitionID}`).value,
    };
    document.getElementById("gif").style.display ="block"
    fetch(`${domainName}/sts/entry/${subscriptionID}/${competitionID}`, {
        method: 'PATCH',
        headers:{ "Content-Type": "application/json" , 'Authorization': token},
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(response => {  
      if (response.apiStatus == true) {
        console.log("your entry updated sucssefully")
        getEntriesData();
      }else {
        console.log('Error:', response.status);
      }
      document.getElementById("gif").style.display = "none";
      responseAlert(response);
    })
    .catch(error => {
      console.log(error);
      document.getElementById("gif").style.display = "none";
      responseAlert(error);
    }); 

}
  

function handleSearch() {
  var searchQuery = document.getElementById('search').value.toLowerCase();
  var entrySections = document.querySelectorAll('#results_container-school section');

  entrySections.forEach(function (entrySection) {
    var entryName = entrySection.querySelector('.title').textContent.toLowerCase();
    var rows = entrySection.querySelectorAll('#table-body-entriesS tr');
    var shouldShowEntry = false;

    rows.forEach(function (row) {
      var cells = row.getElementsByTagName('td');
      var shouldShowRow = false;

      Array.from(cells).forEach(function (cell) {
        if (cell.textContent.toLowerCase().includes(searchQuery)) {
          shouldShowRow = true;
          shouldShowEntry = true;
        }
      });

      // Show rows that match the search query within the entry name
      if (entryName.includes(searchQuery)) {
        shouldShowRow = true;
        shouldShowEntry = true;
      }

      if (shouldShowRow) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });

    if (shouldShowEntry) {
      entrySection.style.display = '';
    } else {
      entrySection.style.display = 'none';
    }
  });
}

function clearData(){
  document.getElementById("entriesId").value = '';
  document.querySelector('#audioPreview').src = '';
  document.querySelector('#audioPreview').style.display = 'none'
}

function clearData1(){
  document.getElementById("dgreeForEntre").value = '';
}
// ENTRIES //