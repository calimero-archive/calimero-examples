export async function post(
  url = "",
  data = {},
  responseType: "text" | "JSON" = "JSON"
) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  if (responseType === "text") {
    return response.text();
  }
  return response.json();
}
