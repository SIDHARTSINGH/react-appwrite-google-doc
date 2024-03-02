import React, { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import authService from "../utils/authService";
import "./TextEditor.css";

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [("bold", "italic", "underline")], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }], // dropdowns with defaults from theme
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["link", "image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const params = useParams();
  const [quill, setQuill] = useState();
  const [loading, setLoading] = useState(true);
  // const user = useAuthStore((s) => s.user);
  const { user } = useAuth();

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    // return style clean up not available in useCallback :
    // reset all to an empty string
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    setQuill(q);
  }, []);

  useEffect(() => {
    const getDocumentOnLoad = async () => {
      if (!loading || quill == null) return;
      // console.log("get doc", params.doc_id);
      authService.databases
        .getDocument(
          import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
          params.docId
        )
        .then((res) => {
          // console.log("res from db", res);
          quill.setContents(JSON.parse(res.content));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };
    getDocumentOnLoad();
    setLoading(false);
  }, [loading, quill]);

  // useEffect(() => {
  //   if (quill == null && user == null) return;

  //   const handler = async (delta, oldDelta, source) => {
  //     if (source !== "user") return;
  //     // console.log("source", source, "delta", delta);
  //     // console.log(user);
  //     const updatedDoc = {
  //       data: JSON.stringify(delta),
  //       content: JSON.stringify(quill.getContents()),
  //       userId: user,
  //     };
  //     // console.log("sending doc", updatedDoc);
  //     authService.databases.updateDocument(
  //       import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
  //       import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
  //       params.doc_id, // document-id
  //       updatedDoc
  //     );
  //     // .then((res) => console.log("update", res));
  //   };
  //   quill.on("text-change", handler);

  //   return () => quill.off("text-change", handler);
  // }, [quill, user]);

  // useEffect(() => {
  //   const unsubscribe = authService.client.subscribe(
  //     // `databases.658eb15349aedbead07b.collections.658eb197c166d8293153.documents.65ca117d25a54c587ae4`,
  //     `databases.${import.meta.env.VITE_APP_APPWRITE_DATABASE_ID}.collections.${
  //       import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID
  //     }.documents.65ca117d25a54c587ae4`,
  //     (res) => {
  //       // console.log(res);
  //       if (user != null && user !== res.payload.userId)
  //         quill.updateContents(JSON.parse(res.payload.data));
  //     }
  //   );

  //   return () => unsubscribe();
  // }, [quill, user]);

  return (
    <div className="rcontainer flex justify-center align-center ">
      <div className="container" ref={wrapperRef}></div>
    </div>
  );
};

export default TextEditor;
