export default function checkCorrectUrl(url: string) {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (regex.test(url)) {
    return true;
  } else {
    return false;
  }
}
