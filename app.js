const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

const templates = ["aqua_axolotls", "blue_bats", "cyan_coyotes", "green_geckos", "lime_llamas", "orange_ocelots", "pink_parrots", "purple_pandas", "red_rabbits", "yellow_yaks"]

const backgroundImage = new Image();
backgroundImage.src = `assets/templates/${templates.random()}.png`;

const squareImages = [];
const numSquareImages = 4;
const squareImageSize = 128;
const uniformSpacing = 20.4;
const xOffsetFromFirst = 53.2;
const yOffsetFromFirst = 124;

let imagesLoaded = 0;

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === numSquareImages + 1) {

        setTimeout(() => {
            drawCanvasWithImages();
        }, 50);
    }
}

backgroundImage.onload = checkAllImagesLoaded;

const examples = ["jinx.webp", "milly.png", "maxwell.webp", "luna.webp"]

for (let i = 0; i < numSquareImages; i++) {
    const squareImage = new Image();
    squareImage.src = "assets/examples/" + examples[i];
    squareImage.onload = checkAllImagesLoaded;
    squareImages.push(squareImage);
}

const textObjects = [{
        text: "Jinx",
        x: xOffsetFromFirst + squareImageSize / 2,
        y: yOffsetFromFirst + squareImageSize + 36
    },
    {
        text: "Milly",
        x: xOffsetFromFirst + squareImageSize + uniformSpacing + squareImageSize / 2,
        y: yOffsetFromFirst + squareImageSize + 36
    },
    {
        text: "Maxwell",
        x: xOffsetFromFirst + (squareImageSize + uniformSpacing) * 2 + squareImageSize / 2,
        y: yOffsetFromFirst + squareImageSize + 36
    },
    {
        text: "Luna",
        x: xOffsetFromFirst + (squareImageSize + uniformSpacing) * 3 + squareImageSize / 2,
        y: yOffsetFromFirst + squareImageSize + 36
    },
];

function drawCanvasWithImages() {

    canvas.width = backgroundImage.naturalWidth;
    canvas.height = backgroundImage.naturalHeight;

    ctx.drawImage(backgroundImage, 0, 0, backgroundImage.naturalWidth, backgroundImage.naturalHeight);

    let x = xOffsetFromFirst;
    const y = yOffsetFromFirst;

    for (let i = 0; i < numSquareImages; i++) {
        ctx.drawImage(squareImages[i], x, y, squareImageSize, squareImageSize);
        x += squareImageSize + uniformSpacing;
    }

    ctx.fillStyle = "white";
    ctx.font = "16px MinecraftiaRegular";
    ctx.textAlign = "center";

    textObjects.forEach((textObj) => {
        ctx.fillText(textObj.text, textObj.x, textObj.y);
    });
}

function isInsideImage(mouseX, mouseY, imageX, imageY, imageSize) {
    return mouseX >= imageX && mouseX <= imageX + imageSize &&
        mouseY >= imageY && mouseY <= imageY + imageSize;
}

function isInsideText(mouseX, mouseY, textX, textY, textWidth, textHeight) {
    return mouseX >= textX && mouseX <= textX + textWidth &&
        mouseY >= textY && mouseY <= textY + textHeight;
}

function isInsideTitle(mouseX, mouseY, x1, y1, x2, y2) {
    return mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2;
}

function capitalizeWords(str) {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

canvas.addEventListener("mousemove", function(event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvasWithImages();

    let x = xOffsetFromFirst;
    const y = yOffsetFromFirst;

    let insideText = false;
    let insideImage = false;

    if (isInsideTitle(mouseX, mouseY, 113, 45, 550, 77)) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(113, 45, 450, 45);
    }

    for (let i = 0; i < numSquareImages; i++) {
        if (isInsideImage(mouseX, mouseY, x, y, squareImageSize)) {

            insideImage = true;
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.fillRect(x, y, squareImageSize, squareImageSize);
            canvas.style.cursor = "pointer";
            break;
        }
        x += squareImageSize + uniformSpacing;
    }

    textObjects.forEach((textObj) => {
        const textWidth = ctx.measureText(textObj.text).width;
        const textHeight = 22; 

        if (isInsideText(mouseX, mouseY, textObj.x - textWidth / 2, textObj.y - 30, textWidth, textHeight)) {

            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.fillRect(textObj.x - textWidth / 2, textObj.y - 30, textWidth, textHeight);
            canvas.style.cursor = "text";
            insideText = true;
        }
    });

    if (!insideText && !insideImage) {
        canvas.style.cursor = "default";
    }
});

canvas.addEventListener("mouseout", function(event) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvasWithImages();

    canvas.style.cursor = "default";
});

canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    let x = xOffsetFromFirst;
    const y = yOffsetFromFirst;

    if (isInsideTitle(mouseX, mouseY, 113, 45, 546, 77)) {

        Swal.fire({
            title: 'Select an Option',
            html: '<select id="template"> ' +
                templates.map((template) => `<option value="${template}">${capitalizeWords(template)}</option>`).join("") +
                '</select>',
            showCancelButton: true,
            confirmButtonText: 'OK',
            preConfirm: () => {
                const selectedOption = document.getElementById('template').value;

                backgroundImage.src = `assets/templates/${selectedOption}.png`;
                backgroundImage.onload = setTimeout(() => {
                    drawCanvasWithImages()
                }, 100);
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });
    }

    for (let i = 0; i < numSquareImages; i++) {
        if (isInsideImage(mouseX, mouseY, x, y, squareImageSize)) {

            Swal.fire({
                title: 'Add a New Image',
                html: '<input type="file" id="newImageInput" accept="image/*"><br><br>' +
                    '<input type="text" id="imageUrlInput" placeholder="Or enter image URL">',
                showCancelButton: true,
                confirmButtonText: 'Add',
                preConfirm: () => {
                    const newImageInput = document.getElementById('newImageInput');
                    const imageUrlInput = document.getElementById('imageUrlInput');
                    return new Promise((resolve) => {
                        const file = newImageInput.files[0];
                        if (file) {
                            resolve(URL.createObjectURL(file));
                        } else if (imageUrlInput.value.trim() !== '') {
                            resolve(imageUrlInput.value.trim());
                        } else {
                            resolve(null);
                        }
                    });
                },
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {

                if (!result.isDismissed && result.value !== null) {

                    const newImage = new Image();
                    newImage.src = result.value;

                    newImage.onload = () => {
                        squareImages[i].src = newImage.src;
                        drawCanvasWithImages();
                    };
                }
            });

            break;
        }
        x += squareImageSize + uniformSpacing;
    }

    textObjects.forEach((textObj) => {
        const textWidth = ctx.measureText(textObj.text).width;
        const textHeight = 24; 

        if (isInsideText(mouseX, mouseY, textObj.x - textWidth / 2, textObj.y - 30, textWidth, textHeight)) {

            console.log(textWidth)
            const input = document.createElement("input");
            input.type = "text";
            input.value = textObj.text;
            input.style.position = "absolute";
            input.style.left = (canvas.offsetLeft + textObj.x - 64) + "px";
            input.style.top = (canvas.offsetTop + textObj.y - 30) + "px";
            input.style.width = squareImageSize + "px"; 
            input.style.height = "24px";
            input.style.border = "1px solid black";
            input.style.backgroundColor = "white";
            input.id = "name"

            canvas.parentElement.appendChild(input);
            input.focus();

            input.addEventListener("change", function() {
                textObj.text = input.value;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawCanvasWithImages();
                canvas.parentElement.removeChild(input);
            });

            input.addEventListener("focusout", function() {
                input.remove()
            });
        }
    });
});

window.addEventListener("resize", function() {
    this.document.querySelectorAll('#name').forEach((node) => node.remove())
});

function copyCanvas() {
    if (!navigator.clipboard) {
        alert("Clipboard API is not supported in this browser.");
        return;
    }
    canvas.toBlob(function(blob) {
        if (blob) {
            navigator.clipboard.write([new ClipboardItem({
                    "image/png": blob
                })])
                .catch(function(error) {
                    console.error("Failed to copy canvas image:", error);
                });
        } else {
            alert("Failed to create Blob from canvas image.");
        }
    }, "image/png");
}

function saveCanvas() {
    const dataURL = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = "canvas_image.png";
    downloadLink.click();
}