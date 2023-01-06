fetch("http://localhost:3001/api/notes")
    .then((response) => response.json())
    .then((data) => console.log(data));
