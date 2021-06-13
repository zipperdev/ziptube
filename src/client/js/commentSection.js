const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const comments = document.querySelectorAll(".video__comment");

const addComment = (text, newCommentId) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const deleteSpan = document.createElement("span");
    const deleteIcon = document.createElement("i");
    icon.className = "far fa-comment-alt";
    deleteIcon.className = "fas fa-eraser";
    span.innerText = ` ${text}`;
    deleteSpan.appendChild(deleteIcon);
    newComment.className = "video__comment";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(deleteSpan);
    newComment.dataset.id = newCommentId;
    newComment.addEventListener("click", handleCommentDelete);
    videoComments.prepend(newComment);
};

const handleCommentDelete = async (e) => {
    const div = e.target.parentElement;
    const comment = div.parentElement;
    const response = await fetch(`/api/videos/${videoContainer.dataset.videoid}/comment/${comment.dataset.id}`, {
        method: "DELETE", 
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status === 200) {
        e.target.removeEventListener("click", handleCommentDelete);
        comment.remove();
    };
};

const handleSubmit = async (e) => {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false
    };
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.videoid;
    if (text.trim()) {
        const response = await fetch(`/api/videos/${videoId}/comment`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({ text })
        });
        if (response.status === 201) {
            textarea.value = "";
            const { newCommentId } = await response.json();
            addComment(text, newCommentId);
        };
    };
};

comments.forEach((e) => {
    const deleteButton = e.querySelector("span i");
    if (deleteButton) {
        e.querySelector("span i").addEventListener("click", handleCommentDelete);
    };
});

if (form) {
    form.addEventListener("submit", handleSubmit);
};