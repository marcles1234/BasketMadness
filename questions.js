const button = document.getElementById("save-json");

const varnames = ["question1", "answer1", 
    "question2", "answer2", 
    "question3", "answer3", 
    "question4", "answer4", 
    "question5", "answer5", 
    "question6", "answer6", 
    "question7", "answer7", 
    "question8", "answer8", 
    "question9", "answer9", 
    "question10", "answer10"];

button.addEventListener("click", function() {
    const jsonData = {};

    for (let i = 0; i < 20; i++) {
        const textarea = document.getElementById(varnames[i]);
        const textareaValue = textarea.value;
        jsonData[varnames[i]] = textareaValue;
        console.log("Textarea Value: ", textareaValue)
    }
    const jsonString = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonString], {type: 'application/json'});

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";

    link.click();
});


const QandAs = new Array(20);

const fileInput = document.getElementById("file-input");

fileInput.addEventListener("change", function(event) {
    i = 0;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);

            for (let key in jsonData) {
                const textarea = document.getElementById(key);
                QandAs[i] = jsonData[key];
                if (textarea) {
                    textarea.value = jsonData[key];
                }
                i++;
            }
            localStorage.setItem('QandAs', JSON.stringify(QandAs)); //save array to local storage to be accessed in game
        } catch (error) {
            alert("Error reading JSON file: " + error);
        }
    };

    reader.readAsText(file);
});