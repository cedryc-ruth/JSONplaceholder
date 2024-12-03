// Point d'entrée de l'application
const app = document.getElementById("content");

let page_start = 0;
let page_limit = 5;

// Charger la liste des posts
async function loadPosts() {
    //Interrogation de l'API pour avoir des données récentes
    app.innerHTML = "<p>Loading posts...</p>";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_start=${page_start}&_limit="+page_limit);
        const posts = await response.json();

        const postList = document.createElement("ul");
        posts.forEach((post) => {
            const postItem = document.createElement("li");
            const postLink = document.createElement("a");

            postLink.textContent = post.title;
            postLink.href = '#';
            postLink.addEventListener("click", (e) => {
                e.preventDefault();

                postLink.classList.add('visited');

                //Mise en cache de la page
                localStorage.home = JSON.stringify({ content: app.innerHTML, timestamp: Date.now() });
                
                loadPostDetails(post);
            });
            postItem.appendChild(postLink);
            postList.appendChild(postItem);
        });

        app.innerHTML = ""; // Efface le chargement
        app.appendChild(postList);

        const previousButton = document.createElement("button");
        previousButton.textContent = 'Previous';
        const nextButton = document.createElement("button");
        nextButton.textContent = 'Next';
        const limitEdit = document.createElement("input");
        limitEdit.type = 'number';
        limitEdit.value = page_limit;

        app.appendChild(previousButton);
        app.appendChild(limitEdit);
        app.appendChild(nextButton);
    } catch (error) {
        console.error("Error loading posts:", error);
        app.innerHTML = "<p>Failed to load posts.</p>";
    }
}

// Charger les détails d'un post
async function loadPostDetails(post) {
    app.innerHTML = "<p>Loading post details...</p>";

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`);
        const postDetails = await response.json();

        //Sauvegarde dans localStorage
        localStorage.post = JSON.stringify(postDetails);

        app.innerHTML = `
            <button onclick="loadPosts()">Back to Posts</button>
            <h2>${postDetails.title}</h2>
            <p>${postDetails.body}</p>
            <button class="delete" onclick="deletePost(${postDetails.id})">Delete</button>
            <button onclick="showEditForm()">Edit</button>
        `;
    } catch (error) {
        console.error("Error loading post details:", error);
        app.innerHTML = "<p>Failed to load post details.</p>";
    }
}

// Supprimer un post
async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: "DELETE",
        });

        alert("Post deleted!");
        loadPosts();
    } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post.");
    }
}

// Afficher le formulaire de modification
function showEditForm() {
    //Récupérer le post de la localStorage
    let {postId, title, body} = JSON.parse(localStorage.post);

    app.innerHTML = `
        <button onclick="loadPosts()">Back to Posts</button>
        <h2>Edit Post</h2>
        <form onsubmit="updatePost(event, ${postId})">
            <label>Title</label>
            <input type="text" id="edit-title" value="${title}" required>
            <label>Body</label>
            <textarea id="edit-body" required>${body}</textarea>
            <button type="submit">Save Changes</button>
        </form>
    `;
}

// Mettre à jour un post
async function updatePost(event, postId) {
    event.preventDefault();

    const title = document.getElementById("edit-title").value;
    const body = document.getElementById("edit-body").value;

    try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, body }),
        });

        alert("Post updated!");
        loadPosts();
    } catch (error) {
        console.error("Error updating post:", error);
        alert("Failed to update post.");
    }
}

// Charger la liste des posts au démarrage
loadPosts();

alert('ok');