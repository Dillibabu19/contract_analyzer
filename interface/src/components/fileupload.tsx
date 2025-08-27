import { Client, ID, Storage } from "appwrite";

// export interface FileUploadProps {
//   file: File;
// }

export default function FileUpload(file: File) {
  const appwrite_endpoint = import.meta.env.VITE_APP_WRITE_ENDPOINT;
  const appwrite_projectid = import.meta.env.VITE_APP_WRITE_PROJECTID;
  const appwrite_bucketid = import.meta.env.VITE_APP_WRITE_BUCKETID;

  const client = new Client()
    .setEndpoint(appwrite_endpoint)
    .setProject(appwrite_projectid);

  const storage = new Storage(client);

  const promise = storage.createFile(appwrite_bucketid, ID.unique(), file);
  promise.then(
    function (response) {
      console.log(response);
    },
    function (error) {
      console.log(error);
    }
  );
}
