const postList = [];
msgMap = {};
const msgIdList = [];
mapLen = 0;
db.collection("msgList")
  .get()
  .then((msgList) => {
    msgList.forEach((m) => {
      const msgId = mapLen;
      const msg = m.data();
      // Save tagId as a property of tagMap
      msgMap[msgId] = msg;
      msgIdList[mapLen] = m.id;
      mapLen += 1;
    });
  })
  .catch((err) => {
    console.log("[err]", err);
  });

function postALL() {
  console.log(msgMap);
  db.collection("postList")
    .get()
    // Successfully get the data
    // .then(function(docList){})
    .then((docList) => {
      //console.log("[dosList]", docList);
      // loop all the doc from docList
      docList.forEach((doc) => {
        //console.log("doc", doc);
        const post = doc.data();
        let message = ``;
        console.log(doc.id);
        for (let i = 0; i < mapLen; i++) {
          const msg = msgMap[i];
          //console.log("tag", tag);
          if (doc.id == msg.postNum) {
            console.log("Y");
            message += `
            <div class="comments">
            <div class="comment1">
              <button data-id="${msgIdList[i]}" class="btn btn-danger delComment-post-btn" style="margin-bottom: 2px;">delete</button>
              <div class="gray">anonymous:</div>
              <div>${msg.comment}</div> 
            </div>
          </div><br>`;
          }
        }

        // Append option to create & update select UI

        // Create HTML table row for each post
        const postIT = `
                <article>
                <br>
                <h4 id="top">${post.title}<span>
                <a href="#page">
                  <button data-id="${doc.id}" class="btn btn-warning update-post-btn">
                    Update
                  </button>
                </a>
                <button data-id="${doc.id}" class="btn btn-danger delete-post-btn">Delete</button>
            </span></h4>                
                <div class="words">${post.article}</div>
                <hr>
                <h3>Comments</h3>
                ${message}
                <br>
                </article>
                `;
        $("#postHTML").append(postIT);
      });

      // select an Element from web page
      // with and id="productList"
    })
    // If some error happened
    // catch( function(err){} )
    .catch((err) => {
      console.log("[err]", err);
    });
}
//*-*-*-**-**-
db.collection("postList")
  .get()
  .then((docList) => {
    docList.forEach((doc) => {
      const post = doc.data();
      const postId = doc.id;
      post["id"] = postId;
      //console.log("[post]", post);
      postList.push(post);
    });
    postALL();
  })
  .catch((err) => console.log("err", err));

$("body").delegate(".delComment-post-btn", "click", function () {
  const postId = $(this).attr("data-id");
  db.doc(`msgList/${postId}`)
    .delete()
    .then(() => {
      alert("This comment has removed.");
      window.location.reload();
    })
    .catch((err) => console.log(err));
});

$("body").delegate(".create-post-btn", "click", function () {
  const a = `    <div class="content" id="createHTML">
    <div class="card">
        <div class="card-header">Create Post</div>
        <form id="createForm" class="card-body">
            <div class="form-group">
                <input id="createPostId" class="d-none" type="text">
                <label for="createTitle">Title</label>
                <input id="createTitle" type="text" class="form-control" required />
            </div>
            <div class="form-group">
                <label for="createArticle">Message</label>
                <input id="createArticle" type="text" class="form-control" required />
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Post</button>
            </div>
        </form>`;
  $("#requestDIV").append(a);
  var $createForm = $("#createForm");
  var $createTitle = $("#createTitle");
  var $createArticle = $("#createArticle");
  $createForm.submit(function (e) {
    // prevent default behavior of browser
    e.preventDefault();
    console.log("New Todo Form Submitted !");
    const post = {
      title: $createTitle.val(),
      article: $createArticle.val(),
    };
    console.log(post);
    db.collection("postList")
      .add(post)
      .then(() => {
        // refresh page
        alert("Post Added.");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  });
});

$("body").delegate(".update-post-btn", "click", function () {
  // Get tag id from button element
  const postId = $(this).attr("data-id");
  // Find that object with the same id in postList
  const post = postList.find((t) => {
    return t.id == postId;
  });
  console.log("postId", postId);
  console.log("post", post);
  // Fill post value in UI
  const a = `    <div class="content" id="updateHTML">
    <div class="card">
        <div class="card-header">Update Post Title: ${post.title}</div>
        <form id="updateForm" class="card-body">
            <div class="form-group">
                <input id="updatePostId" class="d-none" type="text">
                <label for="updateTitle">Title</label>
                <input id="updateTitle" type="text" class="form-control" required />
            </div>
            <div class="form-group">
                <label for="updateArticle">Message</label>
                <input id="updateArticle" type="text" class="form-control" required />
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Post</button>
            </div>
        </form>`;
  $("#requestDIV").append(a);
  $("#updatePostId").val(postId);
  $("#updateTitle").val(post.title);
  $("#updateArticle").val(post.article);
  $("#updateForm").submit(function (e) {
    // prevent default behavior of browser
    e.preventDefault();
    console.log("New Tag Form Submitted !");
    const post = {
      title: $("#updateTitle").val(),
      article: $("#updateArticle").val(),
    };
    console.log(postId, post);
    // Update data
    // .doc("collection/DOC_ID")
    db.doc(`postList/${postId}`)
      .update(post)
      .then(() => {
        alert("Update!");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

$("body").delegate(".delete-post-btn", "click", function () {
  //console.log("this", this);
  const postId = $(this).attr("data-id");
  db.doc(`postList/${postId}`)
    .delete()
    .then(() => {
      alert("This post is removed.");
      window.location.reload();
    })
    .catch((err) => console.log(err));
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // sign in
    console.log("sign in user", user);
    if (user.email == "admin@gmail.com") {
      $("#loader").fadeOut();
    } else {
      alert("No permission to visit Admin Page");
      window.location = "user.html";
    }
  } else {
    // sign out
    console.log("sign out", user);
  }
});
