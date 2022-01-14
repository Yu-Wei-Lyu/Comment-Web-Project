// Scripts start here...
msgMap = {};
mapLen = 0;
db.collection("msgList")
  .get()
  .then((msgList) => {
    msgList.forEach((m) => {
      const msgId = mapLen;
      const msg = m.data();
      // Save tagId as a property of tagMap
      msgMap[msgId] = msg;
      mapLen += 1;
    });
    postALL();
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
      var i = 0;
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
                <div class="gray">anonymous:</div>
                <div>${msg.comment}</div> 
              </div>
            </div><br>`;
          }
        }
        const temp = `  
        <article>
          <br>
          <h4 id="top">${post.title}</h4>
          <div class="words">${post.article}</div>
          <hr>
          <h3>Comments
            <button data-id="${doc.id}" class="btn btn-primary addComment-post-btn">Add Comment</button>
          </h3>
          <br>
          <div id=${doc.id}></div>
          ${message}
          <br>
        </article>
        `;
        $("#postHTML").append(temp);
        i += 1;
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

$("body").delegate(".addComment-post-btn", "click", function () {
  const a = `            
    <form id="createForm" class="card-body"> 
        <div class="form-group">
            <label for="createComment">Type your comment below</label>
            <input id="createComment" type="text" class="form-control" required />
        </div>
        <div class="card" class="form-group">
            <button class="btn btn-primary">Enter</button>
        </div>
    </form>`;
  const postId = $(this).attr("data-id");
  $("#" + postId).append(a);
  var $createForm = $("#createForm");
  var $createComment = $("#createComment");
  $createForm.submit(function (e) {
    // prevent default behavior of browser
    e.preventDefault();
    console.log("New Todo Form Submitted !");
    const msg = {
      postNum: postId,
      comment: $createComment.val(),
    };
    console.log(msg);
    db.collection("msgList")
      .add(msg)
      .then(() => {
        alert("The Comment is added.");
        // refresh page
        window.location.reload();
      })
      .catch((err) => console.log(err));
  });
});
