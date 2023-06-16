let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      const toyCollection = document.querySelector("#toy-collection");

      toys.forEach(toy => {
        const toyDiv = document.createElement("div");
        toyDiv.className = "card";

        toyDiv.innerHTML = `
          <h2>${toy.name}</h2>
          <img src=${toy.image} class="toy-avatar" />
          <p>${toy.likes} Likes </p>
          <button class="like-btn">Like <3</button>
        `;

        toyCollection.appendChild(toyDiv);

        const likeBtn = toyDiv.querySelector('.like-btn');

        likeBtn.addEventListener('click', () => {
          toy.likes += 1;

          const reqObj = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              "likes": toy.likes
            })
          };

          fetch(`http://localhost:3000/toys/${toy.id}`, reqObj)
            .then(resp => resp.json())
            .then(updatedToy => {
              const likesParagraph = toyDiv.querySelector('p');
              likesParagraph.textContent = `${updatedToy.likes} Likes`;
            })
            .catch(err => console.log(err));
          });
        });
      });

  const toyForm = document.querySelector(".add-toy-form");

  toyForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const nameInput = toyForm.querySelector("input[name='name']").value;
    const imageInput = toyForm.querySelector("input[name='image']").value;

    const newToy = {
      name: nameInput,
      image: imageInput,
      likes: 0
    };

    const reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    };

    fetch("http://localhost:3000/toys", reqObj)
      .then(resp => resp.json())
      .then(toy => {
        const toyDiv = document.createElement('div');
        toyDiv.className = 'card';
        toyDiv.innerHTML = `
          <h2>${toy.name}</h2>
          <img src=${toy.image} class="toy-avatar" />
          <p>${toy.likes} Likes </p>
          <button class="like-btn">Like <3</button>
        `;
        const toyCollection = document.querySelector('#toy-collection');
        toyCollection.appendChild(toyDiv);
      })
      .catch(err => console.log(err));
    });
  });
