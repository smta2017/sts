var carouselItemCount = 0;
var adventisersData;


function showAdventisersData() {
    var showAdventisersContainer = document.getElementById("showAdventisers");
    document.getElementById("gif").style.display ="block"
    fetch(`${domainName}/sts/advertising/all`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            adventisersData = data.data;
            showAdventisersContainer.innerHTML = "";
            data.data.forEach((showAdventisers, index) => {
                const element = document.createElement('div');
                element.innerHTML = `
                    <div class="carousel-inner" id="adventisers_${showAdventisers._id}">
                        <div class="carousel-item ${index === 0 ? 'active' : ''}" style="background-image: url('${domainName}/${showAdventisers.photo}')">
                            <div class="carousel-caption">
                                <h5 class="text-dark">${showAdventisers.title}</h5>
                                <p>${showAdventisers.description}</p>
                                <a href="#advertising" onclick="showAdventisersDetails('${showAdventisers._id}')" class="btn btn-warning btn-lg action-button login" type="button">Know More</a>
                            </div>
                        </div>
                    </div>
                `;
                showAdventisersContainer.appendChild(element);

                // Add a new button for each carousel item
                const indicatorsContainer = document.querySelector('.carousel-indicators');
                const button = document.createElement('button');
                button.setAttribute('type', 'button');
                button.setAttribute('data-bs-target', '#carouselExampleCaptions');
                button.setAttribute('data-bs-slide-to', carouselItemCount);
                button.setAttribute('aria-label', `Slide ${carouselItemCount + 1}`);
                if (carouselItemCount === 0) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'true');
                }
                indicatorsContainer.appendChild(button);

                carouselItemCount++;
            });
            document.getElementById("gif").style.display = "none";
          })
          .catch(error => {
            console.log(error);
            document.getElementById("gif").style.display = "none";
          });
}

showAdventisersData();

function showAdventisersDetails(id) {
    // window.location.hash = "#knowMore";
    if (id) {
        const showAdventisersD = adventisersData.find(adventiserss => { return adventiserss._id == id });
        if (showAdventisersD) {
            // window.location.hash = "#knowMore";
            const showAdventisersContainer = document.getElementById("content");
            showAdventisersContainer.innerHTML = "";
            const element = document.createElement('div');
            element.innerHTML = `
                            <div class="profile-page" id="adventisers_${showAdventisersD._id}">
                                <div class="page-header" data-parallax="true" style="background-image:url('${domainName}/STS-Frontend-Website/images/339914637_169095876036285_1735365296112837238_n.jpg');"></div>
                                    <div class="main main-raised">
                                        <div class="profile-content">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-12 ml-auto mr-auto">

                                                            <div class="profile p-0">
                                                                <div class="avatar">
                                                                    <img src='${domainName}/STS-Frontend-Website/images/WhatsApp_Image_2023-05-14_at_14.34.50-removebg-preview.png' alt="Circle Image" class="img-raised rounded-circle img-fluid">
                                                                </div>
                                                            </div>

                                                            <div class="gallery my-0 p-0" id="imgContent">
                                                                <div class="col-10 text-center mx-auto">
                                                                    <img id="photo" src="${domainName}/${showAdventisersD.photo}" class="rounded col-12 col-md-4 mb-2">  					
                                                                </div>
                                                            </div>


                                                            <div class="name">
                                                                <h3 class="title text-dark text-center mt-2" id="title">${showAdventisersD.title}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                    
                                                <div class="description text-center">
                                                    <p class="m-0 pb-5 text-dark px-2 px-md-0" id="paragraph">${showAdventisersD.paragraph}</p>
                                                </div>
                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `;
                showAdventisersContainer.appendChild(element);
                
        } else {
            console.log("No adventisers item found with the provided ID.");
        }
    } else {
        console.log("No adventisers ID provided.");
    }
}