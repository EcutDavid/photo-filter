const dom = document.getElementById("input");
dom.addEventListener("change", handleFiles, false);
function handleFiles() {
	var fileList = this.files; /* now you can work with the file list */

	var img = document.createElement("img");
	document.body.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

	var reader = new FileReader();
	reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; console.log(e.target.result) }; })(img);
	reader.readAsDataURL(fileList[0]);
}