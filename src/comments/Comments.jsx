import React, { useState, useEffect } from "react";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  deleteComment as deleteCommentApi,
} from "../api";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
const Comments = ({ currentUserId }) => {
  const [backendComments, setBackendComments] = useState([]);
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  const getReplies = (commentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };
  const addComment = (text, parentId) => {
    console.log("add comment", text, parentId);
    createCommentApi(text, parentId).then((comment) => {
      setBackendComments([comment, ...backendComments]);
    });
  };
  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure ?")) {
      deleteCommentApi(commentId).then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id != commentId
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };
  // console.log("backComm", backendComments);
  useEffect(() => {
    getCommentsApi().then((data) => {
      setBackendComments(data);
    });
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          // <div key={rootComment.id}>{rootComment.body}</div>
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            currentUserId={currentUserId}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
