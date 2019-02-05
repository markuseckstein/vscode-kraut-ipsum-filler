"use strict";

import * as https from "https";

export function getKrautText(): Promise<string> {
  console.log("inserting kraut");
  return new Promise((resolve, reject) => {
    https.get(
      {
        host: "krautipsum.com",
        path: "/api/kraut",
        timeout: 4000
      },
      response => {
        let kraut = "";

        response.on("data", data => {
          console.log(data);
          kraut += data;
        });

        response.on("end", () => {
          let krautString = JSON.parse(kraut).kraut;
          resolve(krautString);
        });

        response.on("error", err => {
          console.error("Error while getting data from Kraut Ipsum API", err);
          reject(err);
        });
      }
    );
  });
}
